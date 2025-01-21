type CustomModalProps={
  isOpen: boolean
}

export function CustomModal({ isOpen }: CustomModalProps) {
  return (
    <div className={`modal-overlay ${isOpen? "show":""}`}>
      <div className="modal">
        <p>This is a <strong>CUSTOM</strong> modal</p>
        <button>Close</button>
      </div>
    </div>
  )
}
