import React, { useEffect, useRef, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatIsoToSpanish } from '@/utils/formatDate';

type SavedImage = {
  id?: number | string;
  url?: string;
  path?: string;
  uploaded_at?: string;
};

type CameraCaptureProps = {
  inputId?: string;
  multiple?: boolean;
  helperText?: string;
  error?: string | null;
  initialImages?: SavedImage[];
  onFilesChange: (files: File[]) => void;
  onDeleteSavedImage?: (image: SavedImage) => void;
};

const CameraCapture: React.FC<CameraCaptureProps> = ({
  inputId = 'camera-input',
  multiple = true,
  helperText = 'Toca el botón para abrir la cámara o seleccionar fotos.',
  error,
  initialImages = [],
  onDeleteSavedImage,
  onFilesChange,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [filesState, setFilesState] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const resetZoom = () => setZoom(1);
  const zoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
  const zoomOut = () => setZoom((z) => Math.max(0.5, z - 0.25));
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteSaved = (idx: number) => {
    setSavedImages((prev) => {
        const copy = [...prev];
        const [removed] = copy.splice(idx, 1);

        if (removed && onDeleteSavedImage) {
        onDeleteSavedImage(removed);
        }

        return copy;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setFilesState((prev) => {
      const updated = multiple ? [...prev, ...files] : files;
      onFilesChange(updated);
      return updated;
    });

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => (multiple ? [...prev, ...newUrls] : newUrls));
  };

  // Si quieres ser pulcro con los objectURL, revoca solo al desmontar
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // 👈 sin dependencia para no revocar mientras los sigues usando

  return (
    <>
      <div className="d-flex flex-column align-items-center w-100">
        {/* input de archivo oculto */}
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={multiple}
          className="d-none"
          onChange={handleFileChange}
        />

        {/* Botón circular de cámara */}
        <button
          type="button"
          className="btn btn-dark rounded-circle p-3 d-flex align-items-center justify-content-center"
          onClick={openPicker}
        >
          <IconifyIcon icon="tabler:camera" className="fs-3" />
        </button>

        {/* Texto de ayuda */}
        {helperText && (
          <div className="text-muted small mt-2 text-center">
            {helperText}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-danger small mt-1">
            {error}
          </div>
        )}

        {/* Previews nuevas */}
        {previews.length > 0 && (
          <div className="w-100 mt-3">
            <div className="mb-2 fw-semibold small">Fotos nuevas</div>
            <div className="row g-2">
              {previews.map((src, idx) => (
                <div className="col-4 col-md-2" key={idx}>
                  <button
                    type="button"
                    className="border rounded-4 overflow-hidden p-0 w-100"
                    onClick={() => setSelectedImage(src)}
                    style={{ background: 'transparent' }}
                  >
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="img-fluid"
                      style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedImages.length > 0 && (
            <div className="w-100 mt-3">
                <div className="mb-2 fw-semibold small">Fotos guardadas</div>
                <div className="row g-2">
                {savedImages.map((img, idx) => {
                  const imageUrl = img.url ?? (img.path ? `/storage/${img.path}` : '');
                  const imageKey = img.id ?? img.path ?? idx;

                  return (
                    <div className="col-4 col-md-2" key={imageKey}>
                    <div className="border rounded-4 overflow-hidden position-relative">
                        <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSaved(idx);
                        }}
                        >
                        <IconifyIcon icon="tabler:trash" className="fs-6" />
                        </button>
                        <button
                        type="button"
                        className="p-0 border-0 bg-transparent w-100"
                        onClick={() => imageUrl && setSelectedImage(imageUrl)}
                        >
                        <img
                            src={imageUrl}
                            alt={`saved-${idx}`}
                            className="img-fluid"
                            style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
                        />
                        </button>

                        <div className="small px-2 pb-2">
                            {formatIsoToSpanish(img.uploaded_at ?? '')}
                        </div>
                    </div>
                    </div>
                  );
                })}
                </div>
            </div>
            )}
      </div>

      {/* Overlay / lightbox */}
      {selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1050 }}
          onClick={() => setSelectedImage(null)} // cerrar al hacer click fuera
        >
          <div
            className="position-relative"
            onClick={(e) => e.stopPropagation()} // que no cierre al click en la imagen
          >
            <button
              type="button"
              className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="preview-full"
              className="img-fluid"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '0.5rem',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CameraCapture;
