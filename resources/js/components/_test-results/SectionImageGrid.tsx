import React from 'react';

type ImageRef =
  | string
  | {
      id?: number | string;
      url?: string;
      path?: string;
      uploaded_at?: string;
    };

type Props = {
  images?: ImageRef[];
  label?: string;
  emptyMessage?: string;
};

const resolveImageUrl = (image: ImageRef): string | null => {
  if (typeof image === 'string') return image;
  if (image.url) return image.url;
  if (image.path) return `/storage/${image.path}`;
  if (image.id) return route('test-results.images.show', { image: image.id });
  return null;
};

const SectionImageGrid: React.FC<Props> = ({
  images = [],
  label,
  emptyMessage,
}) => {
  const normalized = images
    .map((image, idx) => {
      const url = resolveImageUrl(image);
      if (!url) return null;
      const key =
        typeof image === 'string'
          ? url
          : image.id ?? image.path ?? image.url ?? idx;
      return { url, key };
    })
    .filter(
      (item): item is { url: string; key: string | number } => item !== null,
    );

  if (!normalized.length) {
    return emptyMessage ? (
      <div className="text-muted small">{emptyMessage}</div>
    ) : null;
  }

  return (
    <>
      {label && <div className="text-muted small mb-2">{label}</div>}
      <div className="row g-2">
        {normalized.map(({ url, key }) => (
          <div className="col-4 col-md-2" key={key}>
            <div className="border rounded-4 overflow-hidden">
              <img
                src={url}
                alt="evidencia"
                className="img-fluid"
                style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionImageGrid;
