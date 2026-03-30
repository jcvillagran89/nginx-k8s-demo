import React from 'react';
import { Card } from 'react-bootstrap';

type Props = {
  results: any[];
  activeKey?: string;
  onChange?: (key: string, data: any) => void;
};

const TestStatusChips: React.FC<Props> = ({ results, activeKey, onChange }) => {
  const firstResult = results?.[0];
  const content = firstResult?.content ?? {};

  const sections = Object.keys(content);

  const chips = sections.map((sectionKey) => {
    const section = content[sectionKey];
    const statusValue = Number(section?.status ?? 0);

    let badgeClass = '';
    let statusLabel = '';

    switch (statusValue) {
      case 2:
        badgeClass = 'bg-success-subtle text-success-emphasis border border-success-subtle';
        statusLabel = 'Completado';
        break;

      case 1:
        badgeClass = 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle';
        statusLabel = 'En Proceso';
        break;

      default:
        badgeClass = 'bg-warning-subtle text-warning-emphasis border border-primary-subtle';
        statusLabel = 'Pendiente';
        break;
    }

    return {
      key: sectionKey,
      label: `${sectionKey} - ${statusLabel}`,
      badgeClass,
      data: section,
    };
  });

  if (!sections.length) return null;
  const isInteractive = typeof onChange === 'function';

  return (
    <Card className="border-3 bg-body-tertiary rounded-4 mt-3">
      <Card.Body className="p-3">
        <div className="mb-2 fw-semibold">Estado de Pruebas</div>
        <div className="d-flex flex-wrap gap-2">
          {chips.map((chip) => {
            const isActive = activeKey === chip.key;
            const classes = [
              'badge rounded-pill px-3 py-2',
              chip.badgeClass,
              isActive ? 'shadow-sm border border-dark' : '',
              isInteractive ? 'cursor-pointer' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const activeStyle = isActive
              ? {
                  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.25)',
                  transform: 'translateY(-1px)',
                }
              : undefined;

            if (!isInteractive) {
              return (
                <span
                  key={chip.key}
                  className={classes}
                  style={{ fontWeight: 350, fontSize: '0.70rem', ...activeStyle }}
                >
                  {chip.label}
                </span>
              );
            }

            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => onChange?.(chip.key, chip.data)}
                className={classes}
                style={{
                  fontWeight: 350,
                  fontSize: '0.70rem',
                  borderWidth: isActive ? 2 : 1,
                  ...activeStyle,
                }}
                aria-pressed={isActive}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TestStatusChips;
