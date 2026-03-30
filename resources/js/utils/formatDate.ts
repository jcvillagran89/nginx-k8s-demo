export function formatIsoToSpanish(isoString: string): string {
    if (!isoString) return '';

    const date = new Date(isoString);

    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
