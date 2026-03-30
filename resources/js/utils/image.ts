export const getImageUrl = (imageId?: number | string | null): string | null => {
  if (!imageId) return null;
  return route('test-results.images.show', { image: imageId });
};
