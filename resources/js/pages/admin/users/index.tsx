// react
import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
// bootstrap
import { Button, Card, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
// components
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import MainLayout from '@/layouts/MainLayout';
import UserForm from '@/components/_admin/forms/UserForm';
import ConfirmModal from '@/components/_general/ConfirmModal';

const UsersPage = () => {
  const { users, roles, permissions, filters } = usePage().props;
  const [show, setShow] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmPwdOpen, setConfirmPwdOpen] = useState(false);
  const [selectedUserPwd, setSelectedUserPwd] = useState(null);
  const [resettingPwd, setResettingPwd] = useState(false);

  const handleClose = () => { setShow(false); setEditingUser(null); };
  const handleShowNew = () => { setEditingUser(null); setShow(true); };
  const handleShowEdit = (user) => { setEditingUser(user); setShow(true); };
  const openDelete = (user) => { setSelectedUser(user); setConfirmOpen(true); };
  const closeDelete = () => { setConfirmOpen(false); setSelectedUser(null); };
  const openResetPassword = (user) => { setSelectedUserPwd(user); setConfirmPwdOpen(true); };
  const closeResetPassword = () => { setConfirmPwdOpen(false); setSelectedUserPwd(null); };

  const handleDelete = () => {
    if (!selectedUser) return;
    setDeleting(true);
    router.delete(route('admin.users.destroy', selectedUser.id), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setDeleting(false);
        closeDelete();
      },
    });
  };

  const handleResetPassword = () => {
    if (!selectedUserPwd) return;
    setResettingPwd(true);

    router.post(route('admin.users.password.reset', selectedUserPwd.id), {}, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setResettingPwd(false);
        closeResetPassword();
      },
    });
  };

  return (
    <MainLayout>
      <PageTitle title="Lista de Usuarios" subTitle="Admin" />
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
                        router.get(route('admin.users'), {
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
                    <IconifyIcon icon="tabler:plus" className="me-1" /> Nuevo usuario
                  </Button>
                </div>
              </CardHeader>
                <div className="table-responsive">
                  <table className="table table-nowrap mb-0">
                    <thead className="bg-light-subtle">
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-center" style={{ width: 120 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.data?.map((item, idx) => (
                        <tr key={item.id ?? idx}>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
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
                                variant="soft-warning"
                                size="sm"
                                className="btn-icon rounded-circle"
                                onClick={() => openResetPassword(item)}
                                title="Actualizar contraseña"
                              >
                                <IconifyIcon icon="tabler:key" />
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
                        router.get(route('admin.users'), {
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
                    {users?.links?.map((link, i) => {
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
                            <span
                              className="page-link"
                              dangerouslySetInnerHTML={{ __html: label }}
                            />
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
      <UserForm
        show={show}
        onHide={handleClose}
        roles={roles ?? []}
        permissions={permissions ?? []}
        user={editingUser}
      />
      <ConfirmModal
        show={confirmOpen}
        onClose={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar usuario"
        body={
          selectedUser
            ? `¿Deseas eliminar al usuario "${selectedUser.name}"?`
            : '¿Deseas eliminar al usuario?'
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />
      <ConfirmModal
        show={confirmPwdOpen}
        onClose={closeResetPassword}
        onConfirm={handleResetPassword}
        loading={resettingPwd}
        title="Actualizar contraseña"
        body={
          selectedUserPwd
            ? `¿Deseas actualizar la contraseña del usuario "${selectedUserPwd.name}"? Se enviará por correo.`
            : '¿Deseas actualizar la contraseña del usuario?'
        }
        confirmText="Actualizar"
        confirmVariant="warning"
      />
    </MainLayout>
  );
};

export default UsersPage;
