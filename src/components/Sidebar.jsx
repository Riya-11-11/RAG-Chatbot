import { useState } from 'react'
import Icon from './Icon.jsx'

function Sidebar({
  activeDocument,
  inert = false,
  onDocumentSelect,
  onNewConversation,
  onUpload,
  onClose,
}) {
  const [search, setSearch] = useState('')
  const showRecentDocument = activeDocument?.name
    .toLocaleLowerCase()
    .includes(search.trim().toLocaleLowerCase())

  return (
    <aside className="sidebar" aria-label="Workspace navigation" inert={inert}>
      <div className="sidebar-top">
        <a className="brand" href="/" aria-label="RAG Chatbot home">
          <span className="brand-mark"><Icon name="sparkles" size={20} /></span>
          <span>RAG Chatbot</span>
        </a>
        <button
          className="icon-button sidebar-close"
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
        >
          <Icon name="x" />
        </button>
      </div>

      <button className="new-chat-button" type="button" onClick={onNewConversation}>
        <Icon name="plus" size={20} />
        <span>New chat</span>
      </button>

      <button className="upload-sidebar-button" type="button" onClick={onUpload}>
        <Icon name="upload" size={19} />
        <span>Add document</span>
      </button>

      <label className="sidebar-search">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations"
          aria-label="Search conversations and recent files"
        />
      </label>

      <div className="sidebar-scroll">
        <section className="sidebar-section" aria-label="Conversation history">
          <div className="section-heading">
            <Icon name="clock" size={16} />
            <span className="sidebar-section-label">History</span>
          </div>
        </section>

        <section className="sidebar-section" aria-label="Recent activity">
          <div className="section-heading">
            <Icon name="file" size={16} />
            <span className="sidebar-section-label">Recent</span>
          </div>
          {showRecentDocument && (
            <button
              className="document-list-item selected"
              type="button"
              onClick={onDocumentSelect}
              title={activeDocument.name}
            >
              <Icon name="file" size={19} />
              <span className="document-list-copy">
                <strong>{activeDocument.name}</strong>
              </span>
            </button>
          )}
        </section>
      </div>
    </aside>
  )
}

export default Sidebar
