import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal({
  show,
  title = 'Confirmación',
  body = '¿Deseas continuar?',
  confirmText = 'Confirmar',
  confirmVariant = 'danger',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando…' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
