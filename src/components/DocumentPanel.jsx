import Icon from './Icon.jsx'

function DocumentPanel({ document, isOpen, inert = false, onUpload, onClose }) {
  if (!document) return null

  return (
    <aside
      className={`document-panel ${isOpen ? 'document-panel-open' : ''}`}
      aria-label="Document information"
      aria-hidden={inert}
      inert={inert}
    >
      <div className="document-panel-header">
        <h2>Document</h2>
        <button
          className="icon-button document-close"
          type="button"
          aria-label="Close document panel"
          onClick={onClose}
        >
          <Icon name="x" />
        </button>
      </div>

      <div className="document-details">
        <div className="document-identity">
          <span className="large-file-icon"><Icon name="file" size={23} /></span>
          <div className="document-card-title">
            <strong title={document.name}>{document.name}</strong>
            <small>Selected on this device</small>
          </div>
        </div>

        <p className="document-local-status">Not uploaded or processed</p>

        <dl className="file-properties">
          <div><dt>Type</dt><dd>{document.type || 'Unknown'}</dd></div>
          <div><dt>Size</dt><dd>{document.size}</dd></div>
        </dl>

        <button className="document-upload-button" type="button" onClick={onUpload}>
          <Icon name="upload" size={19} />
          <span>Choose another document</span>
        </button>
      </div>
    </aside>
  )
}

export default DocumentPanel
