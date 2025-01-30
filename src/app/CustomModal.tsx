type CustomModalProps={
  isOpen: boolean
  onClose: () => void
}

export function CustomModal({ isOpen, onClose }: CustomModalProps) {
  return (
    <div className={`modal-overlay ${isOpen? "show":""}`}>
      <div className="modal">
        <p>This is a <strong>CUSTOM</strong> modal</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
