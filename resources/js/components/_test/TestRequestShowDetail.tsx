import { ReactNode, useMemo } from 'react';
import { Card, CardBody, CardHeader, Button } from 'react-bootstrap';
import {Link} from '@inertiajs/react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';


type ContainerCardProps = {
  title: string;
  description?: ReactNode;
  image?: string;
  children: ReactNode;
};

const TestRequestShowDetail = ({ title, description, image, children }: ContainerCardProps) => {
  const resolveImg = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('test-requests/')) return `/storage/${path}`;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
  };

  const src = useMemo(() => resolveImg(image ?? ''), [image]);

  return (
    <Card className="border rounded-4">
      <CardHeader className="border-0 border-bottom border-dashed bg-white rounded-top-4">
        <h4 className="header-title mb-0">{title}</h4>
         <div className="d-flex justify-content-end mb-3">
                    <Link href={route('test.request.index')}>
                      <Button variant="soft-secondary">
                        <IconifyIcon icon="tabler:arrow-left" className="me-1" /> Regresar
                        </Button>
                    </Link>
                  </div>
      </CardHeader>

      <CardBody className="p-4">
        {/* ✅ HEADER / SUMMARY (como imagen 2) */}
        {(description || src) && (
          <div className="row g-4 align-items-stretch">
            <div className={src ? 'col-12 col-lg-9' : 'col-12'}>
              {description && <div>{description}</div>}
            </div>

            {src && (
              <div className="col-12 col-lg-3">
                <div
                  className="border rounded-4 d-flex align-items-center justify-content-center"
                  style={{ height: '100%', minHeight: 220, background: '#fafafa' }}
                >
                  <img
                    src={src}
                    alt="Producto"
                    className="img-fluid rounded-4"
                    style={{ maxHeight: 240, objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ Separador */}
        <hr className="my-4" />

        {/* ✅ CONTENIDO LARGO (tabs/tablas) SIEMPRE full width */}
        <div className="row">
          <div className="col-12">{children}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TestRequestShowDetail;
