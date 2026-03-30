import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

type Props = {
  data: {
    folio: string;
    estilo: string;
    sku: string;
    notes: string;
    solicitado: string;
    fechaIngreso: string;
    fechaSalida: string;
    pruebasPendientes: string | number;
    image: string;
  };
};

const TestResultInfoCard: React.FC<Props> = ({ data }) => {
  const resolveImg = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('test-requests/')) return `/storage/${path}`;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
  };

  const src = useMemo(() => resolveImg(data.image), [data.image]);

  const Item = ({
    icon,
    label,
    value,
    bg,
  }: {
    icon: string;
    label: string;
    value: React.ReactNode;
    bg: string;
  }) => (
    <div className="col-12 col-md-6">
      <div className="d-flex align-items-start gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40, background: bg }}
        >
          <IconifyIcon icon={icon} className="fs-20" />
        </div>
        <div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {label}
          </div>
          <div className="fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border rounded-4">
      <Card.Body className="p-4">
        <div className="row g-4 align-items-stretch">
          {/* IZQUIERDA: info */}
          <div className={src ? 'col-12 col-lg-9' : 'col-12'}>
            <div className="row g-4">
              <Item
                icon="tabler:hash"
                label="Folio"
                value={data.folio}
                bg="#e7f0ff"
              />

              <Item
                icon="tabler:box"
                label="SKU / Estilo"
                value={`${data.sku} ${data.estilo}`}
                bg="#f3ecff"
              />

              <Item
                icon="tabler:file-description"
                label="Descripción"
                value={data.notes}
                bg="#fff2d9"
              />

              <Item
                icon="tabler:user"
                label="Solicitado por"
                value={data.solicitado}
                bg="#e6fbf6"
              />

              <Item
                icon="tabler:calendar"
                label="Fecha de Ingreso"
                value={data.fechaIngreso}
                bg="#e9f9ed"
              />

              <Item
                icon="tabler:alert-circle"
                label="Pruebas Pendientes"
                value={data.pruebasPendientes}
                bg="#fdecec"
              />
            </div>
          </div>

          {/* DERECHA: imagen */}
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
      </Card.Body>
    </Card>
  );
};

export default TestResultInfoCard;
