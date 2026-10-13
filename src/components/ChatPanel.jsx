import { useRef, useState } from 'react'
import Icon from './Icon.jsx'

const suggestions = [
  {
    title: 'Summarize a document',
    description: 'Get the main ideas at a glance',
    prompt: 'Summarize the document I selected.',
    icon: 'book',
  },
  {
    title: 'Find key information',
    description: 'Locate a specific detail or answer',
    prompt: 'Find the key information in the document I selected.',
    icon: 'search',
  },
  {
    title: 'Explain a complex topic',
    description: 'Make a difficult idea easier to follow',
    prompt: 'Explain the most complex topic in the document I selected in simple terms.',
    icon: 'sparkles',
  },
  {
    title: 'Compare information',
    description: 'Understand how ideas relate across files',
    prompt: 'Compare the key information across my selected documents.',
    icon: 'layers',
  },
]

function ChatPanel({ notice, hasSelectedDocument, onSend, onAttach, onClearNotice }) {
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  function submitMessage(event) {
    event.preventDefault()
    if (!message.trim()) return
    onSend(message.trim())
  }

  function selectSuggestion(prompt) {
    setMessage(prompt)
    onClearNotice()
    inputRef.current?.focus()
  }

  return (
    <section className="chat-panel" aria-label="Document chat">
      <div className="chat-scroll-area">
        <div className="welcome-content">
          <div className="welcome-mark" aria-hidden="true">
            <Icon name="file" size={22} />
            <span><Icon name="sparkles" size={15} /></span>
          </div>
          <h1>What can I help you understand?</h1>
          <p className="welcome-description">
            Add a document and choose a prompt to get started.
          </p>
          <div className="suggestion-grid" aria-label="Suggested prompts">
            {suggestions.map((suggestion) => (
              <button
                className="suggestion-tile"
                key={suggestion.title}
                type="button"
                onClick={() => selectSuggestion(suggestion.prompt)}
              >
                <span className="suggestion-icon"><Icon name={suggestion.icon} size={19} /></span>
                <span className="suggestion-copy">
                  <strong>{suggestion.title}</strong>
                  <small>{suggestion.description}</small>
                </span>
                <Icon className="suggestion-arrow" name="arrow-up-right" size={17} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="composer-area">
        {notice && <div className="backend-notice" role="status"><Icon name="info" size={19} />{notice}</div>}
        <form className="composer" onSubmit={submitMessage}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form.requestSubmit()
              }
            }}
            placeholder="Ask anything about your documents..."
            aria-label="Ask anything about your documents"
            rows={1}
          />
          <div className="composer-footer">
            <div className="composer-tools">
              <button
                className="composer-tool"
                type="button"
                aria-label="Attach a document"
                title="Attach a document"
                onClick={onAttach}
              >
                <Icon name="paperclip" size={20} />
              </button>
            </div>
            <button
              className="send-button"
              type="submit"
              aria-label="Send message"
              title="Send message"
              disabled={!message.trim()}
            >
              <Icon name="send" size={19} />
            </button>
          </div>
        </form>
        <p className="composer-hint">
          <Icon name={hasSelectedDocument ? 'info' : 'paperclip'} size={14} />
          <span>
            {hasSelectedDocument
              ? 'File selected locally; it has not been uploaded or processed.'
              : 'Select a document to get started.'}
          </span>
          {!hasSelectedDocument && (
            <button type="button" onClick={onAttach}>Choose a file</button>
          )}
        </p>
      </div>
    </section>
  )
}

export default ChatPanel
