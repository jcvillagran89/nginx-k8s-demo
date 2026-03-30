// react
import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
// bootstrap
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
// components
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import ConfirmModal from '@/components/_general/ConfirmModal';
import PermissionForm from '@/components/_admin/forms/PermissionForm';

const PermissionsPage = () => {
  const { permissions, filters } = usePage().props;

  const [show, setShow] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleClose = () => { setShow(false); setEditingPermission(null); };
  const handleShowEdit = (permission) => { setEditingPermission(permission); setShow(true); };

  const openDelete = (permission) => { setSelectedPermission(permission); setConfirmOpen(true); };
  const closeDelete = () => { setConfirmOpen(false); setSelectedPermission(null); };

  const handleDelete = () => {
    if (!selectedPermission) return;
    setDeleting(true);
    router.delete(route('admin.permissions.destroy', selectedPermission.id), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setDeleting(false);
        closeDelete();
      },
    });
  };

  return (
    <MainLayout>
      <PageTitle title="Lista de Permisos" subTitle="Admin" />

      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="d-flex align-items-center justify-content-between border-bottom border-light">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar"
                  defaultValue={filters?.q ?? ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.get(route('admin.permissions'), {
                        ...filters,
                        q: e.currentTarget.value,
                        page: 1,
                      }, { preserveState: true, preserveScroll: true });
                    }
                  }}
                />
              </div>
              <div>
                <Button variant="success" className="bg-gradient" onClick={() => setShow(true)}>
                  <IconifyIcon icon="tabler:plus" className="me-1" /> Nuevo permiso
                </Button>
              </div>
            </CardHeader>

            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th className="text-center" style={{ width: 120 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions?.data?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="text-muted">{item.description ?? '—'}</td>
                      <td className="pe-3">
                        <div className="hstack gap-1 justify-content-end">
                          <Button
                            variant="soft-success"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => handleShowEdit(item)}
                          >
                            <IconifyIcon icon="tabler:edit" className="fs-16" />
                          </Button>
                          <Button
                            variant="soft-danger"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => openDelete(item)}
                          >
                            <IconifyIcon icon="tabler:trash" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CardFooter>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span>Filas:</span>
                  <select
                    value={filters?.per_page ?? 10}
                    onChange={(e) =>
                      router.get(route('admin.permissions'), {
                        ...filters,
                        per_page: e.target.value,
                        page: 1,
                      }, { preserveState: true, preserveScroll: true })
                    }
                    className="form-select form-select-sm"
                    style={{ width: 80 }}
                  >
                    {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <ul className="pagination mb-0">
                  {permissions?.links?.map((link, i) => {
                    let label = link.label;
                    if (label.includes('Previous')) label = '&laquo;';
                    if (label.includes('Next')) label = '&raquo;';
                    return (
                      <li
                        key={i}
                        className={[
                          'page-item',
                          link.active ? 'active' : '',
                          !link.url ? 'disabled' : ''
                        ].join(' ')}
                      >
                        {link.url ? (
                          <Link
                            href={link.url}
                            className="page-link"
                            preserveState
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: label }}
                          />
                        ) : (
                          <span className="page-link" dangerouslySetInnerHTML={{ __html: label }} />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      <PermissionForm
        show={show}
        onHide={handleClose}
        permission={editingPermission}
      />

      <ConfirmModal
        show={confirmOpen}
        onClose={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar permiso"
        body={
          selectedPermission
            ? `¿Deseas eliminar el permiso "${selectedPermission.name}"?`
            : '¿Deseas eliminar el permiso?'
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </MainLayout>
  );
};

export default PermissionsPage;
