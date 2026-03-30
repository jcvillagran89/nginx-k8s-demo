import { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { router } from '@inertiajs/react';

function groupByModule(perms) {
  const map = {};
  perms.forEach(p => {
    const full = p.name || '';
    const [module, action] = full.split('-', 2);
    const key = (module || 'Otros').trim();
    if (!map[key]) map[key] = [];
    map[key].push({
      full,
      action: (action || '').trim() || full, // fallback
      description: p.description || '',
    });
  });

  return Object.entries(map)
    .sort(([a],[b]) => a.localeCompare(b))
    .reduce((acc, [k, arr]) => {
      acc[k] = arr.sort((a,b) => a.action.localeCompare(b.action));
      return acc;
    }, {});
}

function groupByDescription(perms) {
  const buckets = {};

  perms.forEach(p => {
    const desc = (p.description || '').trim();
    let moduleKey = 'Otros';
    if (desc.includes('-')) {
      moduleKey = desc.split('-', 1)[0].trim() || 'Otros';
    } else if (desc.length) {
      moduleKey = desc;
    }
    if (!buckets[moduleKey]) buckets[moduleKey] = [];
    buckets[moduleKey].push({
      key: p.name,
      label: p.name,
      fullDesc: p.description || ''
    });
  });

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .reduce((acc, [k, arr]) => {
      acc[k] = arr.sort((a, b) => a.label.localeCompare(b.label, 'es'));
      return acc;
    }, {});
}


export default function AssignPermissionsModal({ show, onHide, role, allPermissions = [] }) {
  const isOpen = show && !!role;

  // Agrupar por descripción (módulo)
  const grouped = useMemo(() => groupByDescription(allPermissions), [allPermissions]);

  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    if (!isOpen) return;
    const current = Array.isArray(role?.permission_names) ? role.permission_names : [];
    setSelected(new Set(current)); // selecciona por name
  }, [isOpen, role]);

  const toggleOne = (permName) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(permName) ? next.delete(permName) : next.add(permName);
      return next;
    });
  };

  const toggleModule = (moduleKey, checkAll) => {
    const names = (grouped[moduleKey] || []).map(p => p.key);
    setSelected(prev => {
      const next = new Set(prev);
      names.forEach(n => checkAll ? next.add(n) : next.delete(n));
      return next;
    });
  };

  const handleSave = () => {
    router.post(route('admin.roles.permissions.sync', role.id), {
      permissions: Array.from(selected), // names
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: onHide,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-xl" scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>Permisos de rol: {role?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4">
          {Object.keys(grouped).map((moduleKey) => {
            const items = grouped[moduleKey];
            const allChecked = items.every(p => selected.has(p.key));
            const someChecked = !allChecked && items.some(p => selected.has(p.key));

            return (
              <Col xs={12} md={6} key={moduleKey}>
                <div className="mb-2 fw-semibold">{moduleKey}</div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Seleccionar todo"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={(e) => toggleModule(moduleKey, e.target.checked)}
                  />
                </div>

                <div className="ms-2">
                  {items.map((p) => (
                    <Form.Check
                      key={p.key}
                      type="checkbox"
                      label={p.label}          // muestra el name (p.ej. "create users")
                      checked={selected.has(p.key)}
                      onChange={() => toggleOne(p.key)}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Col>
            );
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}
