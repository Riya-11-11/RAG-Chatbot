import { useEffect, useRef, useState } from 'react'
import Icon from './components/Icon.jsx'
import Sidebar from './components/Sidebar.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import DocumentPanel from './components/DocumentPanel.jsx'
import './App.css'

function App() {
  const [theme, setTheme] = useState(
    () => {
      const savedTheme = localStorage.getItem('rag-chatbot-theme')
      const initialTheme = savedTheme === 'dark' ? 'dark' : 'light'
      document.documentElement.dataset.theme = initialTheme
      return initialTheme
    },
  )
  const [activeDocument, setActiveDocument] = useState(null)
  const [chatResetKey, setChatResetKey] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const fileInputRef = useRef(null)
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches,
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('rag-chatbot-theme', theme)
  }, [theme])

  useEffect(() => {
    function closeDrawers(event) {
      if (event.key === 'Escape') {
        setNavigationOpen(false)
        setDocumentPanelOpen(false)
      }
    }

    window.addEventListener('keydown', closeDrawers)
    return () => window.removeEventListener('keydown', closeDrawers)
  }, [])

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)')
    function updateViewport() {
      setIsMobileViewport(mobileQuery.matches)
      setNavigationOpen(false)
      if (!mobileQuery.matches) setSidebarCollapsed(false)
    }

    mobileQuery.addEventListener('change', updateViewport)
    return () => mobileQuery.removeEventListener('change', updateViewport)
  }, [])

  function handleFileSelection(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const size = file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    const extension = file.name.includes('.') ? file.name.split('.').pop() : ''

    setActiveDocument({
      name: file.name,
      size,
      type: file.type || extension?.toUpperCase() || 'Unknown',
    })
    setNavigationOpen(false)
    setDocumentPanelOpen(true)
    setNotice('')
    event.target.value = ''
  }

  function handleNewConversation() {
    setChatResetKey((key) => key + 1)
    setNotice('')
    setNavigationOpen(false)
  }

  function handleSend() {
    setNotice('No RAG backend is connected yet. Your message was not sent.')
  }

  async function handleShare() {
    if (!navigator.clipboard?.writeText) {
      setNotice('Clipboard access is not available in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setNotice('Workspace link copied to your clipboard.')
    } catch {
      setNotice('Could not copy the workspace link. Check your browser permissions.')
    }
  }

  return (
    <div
      className={[
        'app-shell',
        sidebarCollapsed && 'sidebar-collapsed',
        navigationOpen && 'navigation-open',
        documentPanelOpen && 'document-panel-open',
      ].filter(Boolean).join(' ')}
      data-theme={theme}
    >
      <Sidebar
        activeDocument={activeDocument}
        inert={isMobileViewport ? !navigationOpen : sidebarCollapsed}
        onDocumentSelect={() => {
          setDocumentPanelOpen(true)
          setNavigationOpen(false)
        }}
        onNewConversation={handleNewConversation}
        onUpload={() => fileInputRef.current?.click()}
        onClose={() => {
          setNavigationOpen(false)
          setSidebarCollapsed(true)
        }}
      />

      {navigationOpen && (
        <button
          className="navigation-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavigationOpen(false)}
        />
      )}
      {documentPanelOpen && (
        <button
          className="document-backdrop"
          type="button"
          aria-label="Close document information"
          onClick={() => setDocumentPanelOpen(false)}
        />
      )}

      <main className="workspace">
        <header className="workspace-header">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={isMobileViewport
              ? navigationOpen ? 'Close navigation' : 'Open navigation'
              : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={isMobileViewport ? navigationOpen : !sidebarCollapsed}
            title="Toggle navigation"
            onClick={() => {
              if (window.matchMedia('(max-width: 760px)').matches) {
                setDocumentPanelOpen(false)
                setNavigationOpen((open) => !open)
              } else {
                setSidebarCollapsed((collapsed) => !collapsed)
              }
            }}
          >
            <Icon name="menu" />
          </button>
          <div className="workspace-title">
            <div>
              <strong>New chat</strong>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Copy workspace link" onClick={handleShare}>
              <Icon name="share" />
            </button>
            {activeDocument && (
              <button
                className="icon-button document-toggle"
                type="button"
                aria-label={documentPanelOpen ? 'Close document information' : 'Open document information'}
                aria-expanded={documentPanelOpen}
                title="Document information"
                onClick={() => {
                  setNavigationOpen(false)
                  setDocumentPanelOpen((open) => !open)
                }}
              >
                <Icon name="file" size={20} />
              </button>
            )}
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        </header>

        <ChatPanel
          key={chatResetKey}
          notice={notice}
          hasSelectedDocument={Boolean(activeDocument)}
          onSend={handleSend}
          onAttach={() => fileInputRef.current?.click()}
          onClearNotice={() => setNotice('')}
        />
      </main>

      {activeDocument && (
        <DocumentPanel
          document={activeDocument}
          isOpen={documentPanelOpen}
          inert={!documentPanelOpen}
          onUpload={() => fileInputRef.current?.click()}
          onClose={() => setDocumentPanelOpen(false)}
        />
      )}

      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        onChange={handleFileSelection}
        aria-label="Choose a document"
      />
    </div>
  )
}

export default App
