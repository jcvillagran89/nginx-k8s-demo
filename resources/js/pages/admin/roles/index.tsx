import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import ConfirmModal from '@/components/_general/ConfirmModal';
import RoleForm from '@/components/_admin/forms/RoleForm';
import AssignPermissionsModal from '@/components/_admin/modals/AssignPermissionsModal';

const RolesPage = () => {
  const { roles, filters, permissions } = usePage().props;
  const [show, setShow] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [selectedRolePerms, setSelectedRolePerms] = useState(null);

  const handleClose = () => { setShow(false); setEditingRole(null); };
  const handleShowNew = () => { setEditingRole(null); setShow(true); };
  const handleShowEdit = (role) => { setEditingRole(role); setShow(true); };
  const openDelete = (role) => { setSelectedRole(role); setConfirmOpen(true); };
  const closeDelete = () => { setConfirmOpen(false); setSelectedRole(null); };
  const openAssignPermissions = (role) => { setSelectedRolePerms(role); setPermModalOpen(true); };
  const closeAssignPermissions = () => { setPermModalOpen(false); setSelectedRolePerms(null); };

  const handleDelete = () => {
    if (!selectedRole) return;
    setDeleting(true);
    router.delete(route('admin.roles.destroy', selectedRole.id), {
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
      <PageTitle title="Lista de Roles" subTitle="Admin" />

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
                      router.get(route('admin.roles'), {
                        ...filters,
                        q: e.currentTarget.value,
                        page: 1,
                      }, { preserveState: true, preserveScroll: true });
                    }
                  }}
                />
              </div>

              <div>
                <Button variant="success" className="bg-gradient" onClick={handleShowNew}>
                  <IconifyIcon icon="tabler:plus" className="me-1" /> Nuevo rol
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
                  {roles?.data?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="text-muted">{item.description ?? '—'}</td>
                      <td className="pe-3">
                        <div className="hstack gap-1 justify-content-end">
                          <Button
                            variant="soft-warning"
                            size="sm"
                            className="btn-icon rounded-circle"
                            onClick={() => openAssignPermissions(item)}
                            title="Asignar permisos"
                          >
                            <IconifyIcon icon="tabler:lock-access" />
                          </Button>
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
                      router.get(route('admin.roles'), {
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
                  {roles?.links?.map((link, i) => {
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

      <RoleForm show={show} onHide={handleClose} role={editingRole} />

      <ConfirmModal
        show={confirmOpen}
        onClose={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar rol"
        body={
          selectedRole
            ? `¿Deseas eliminar el rol "${selectedRole.name}"?`
            : '¿Deseas eliminar el rol?'
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />

      <AssignPermissionsModal
        show={permModalOpen}
        onHide={closeAssignPermissions}
        role={selectedRolePerms}
        allPermissions={permissions}
      />
    </MainLayout>
  );
};

export default RolesPage;
