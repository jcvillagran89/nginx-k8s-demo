export type SectionKey =
    | 'INICIAL'
    | 'APARIENCIA'
    | 'DENSIDAD'
    | 'TRACCION'
    | 'ESTABILIDAD EN PRENDA'
    | 'ESTABILIDAD EN TELA'
    | 'PESO'
    | 'PILLING'
    | 'TORSION'
    | 'FROTE'
    | 'VALOR PH'
    | 'RASGADO'
    | 'SOLIDEZ'
    | 'TORSION 207';

type SectionConfig = {
    title: string;
    routeSection: string;
    startButtonLabel: string;
    pendingMessage: string;
    editButtonLabel: string;
    allowImages?: boolean;
    onlyImages?: boolean;
};

export const SECTION_CONFIG: Record<SectionKey, SectionConfig> = {
    INICIAL: {
        title: 'DATOS INICIALES DE LA MUESTRA',
        routeSection: 'INICIAL',
        startButtonLabel: 'Capturar Datos Iniciales',
        pendingMessage: 'Pendiente de capturar datos iniciales',
        editButtonLabel: 'Editar Datos Iniciales',
        allowImages: true,
    },
    APARIENCIA: {
        title: 'APARIENCIA DE LA PRENDA',
        routeSection: 'APARIENCIA',
        startButtonLabel: 'Capturar APARIENCIA',
        pendingMessage: 'Pendiente de capturar datos de APARIENCIA',
        editButtonLabel: 'Editar APARIENCIA',
        allowImages: true,
    },
    DENSIDAD: {
        title: 'DATOS DE DENSIDAD',
        routeSection: 'DENSIDAD',
        startButtonLabel: 'Capturar Densidad',
        pendingMessage: 'Pendiente de capturar datos de densidad',
        editButtonLabel: 'Editar Densidad',
        allowImages: true,
    },
    TRACCION: {
        title: 'ASTM D5034 – RESISTENCIA A LA TRACCION',
        routeSection: 'TRACCION',
        startButtonLabel: 'Capturar TRACCION',
        pendingMessage: 'Pendiente de capturar datos TRACCION',
        editButtonLabel: 'Editar TRACCION',
        allowImages: true,
    },
    'ESTABILIDAD EN PRENDA': {
        title: 'AATCC 150 – ESTABILIDAD DIMENCIONAL',
        routeSection: 'ESTABILIDAD EN PRENDA',
        startButtonLabel: 'Capturar ESTABILIDAD EN PRENDA',
        pendingMessage: 'Pendiente de capturar datos ESTABILIDAD EN PRENDA',
        editButtonLabel: 'Editar ESTABILIDAD EN PRENDA',
        allowImages: true,
    },
    'ESTABILIDAD EN TELA': {
        title: 'AATCC 135 – ESTABILIDAD DIMENCIONAL LAVADO',
        routeSection: 'ESTABILIDAD EN TELA',
        startButtonLabel: 'Capturar ESTABILIDAD EN TELA',
        pendingMessage: 'Pendiente de capturar datos ESTABILIDAD EN TELA',
        editButtonLabel: 'Editar ESTABILIDAD EN TELA',
        allowImages: true,
    },
    PESO: {
        title: 'ASTM D3776 – MASA POR UNIDAD DE AREA',
        routeSection: 'PESO',
        startButtonLabel: 'Capturar PESO',
        pendingMessage: 'Pendiente de capturar datos PESO',
        editButtonLabel: 'Editar PESO',
        allowImages: true,
    },
    PILLING: {
        title: 'ASTM D3512 – PILLING',
        routeSection: 'PILLING',
        startButtonLabel: 'Capturar PILLING',
        pendingMessage: 'Pendiente de capturar datos PILLING',
        editButtonLabel: 'Editar PILLING',
        allowImages: true,
    },
    TORSION: {
        title: 'AATCC 179 – TORSION',
        routeSection: 'TORSION',
        startButtonLabel: 'Capturar TORSION',
        pendingMessage: 'Pendiente de capturar datos TORSION',
        editButtonLabel: 'Editar TORSION',
        allowImages: true,
    },
    FROTE: {
        title: 'AATCC 8 – SOLIDEZ AL FROTE',
        routeSection: 'FROTE',
        startButtonLabel: 'Capturar FROTE',
        pendingMessage: 'Pendiente de capturar datos FROTE',
        editButtonLabel: 'Editar FROTE',
        allowImages: true,
    },
    'VALOR PH': {
        title: 'AATCC 81 – VALOR DE PH',
        routeSection: 'VALOR PH',
        startButtonLabel: 'Capturar VALOR PH',
        pendingMessage: 'Pendiente de capturar datos VALOR PH',
        editButtonLabel: 'Editar VALOR PH',
        allowImages: true,
    },
    RASGADO: {
        title: 'ASTM D2261 – RESISTENCIA AL RASGADO',
        routeSection: 'RASGADO',
        startButtonLabel: 'Capturar RASGADO',
        pendingMessage: 'Pendiente de capturar datos RASGADO',
        editButtonLabel: 'Editar RASGADO',
        allowImages: true,
    },
    SOLIDEZ: {
        title: 'AATCC 61 – SOLIDEZ DEL COLOR AL LAVADO',
        routeSection: 'SOLIDEZ',
        startButtonLabel: 'Capturar SOLIDEZ',
        pendingMessage: 'Pendiente de capturar datos SOLIDEZ',
        editButtonLabel: 'Editar SOLIDEZ',
        allowImages: true,
        onlyImages: true,
    },
    'TORSION 207': {
        title: 'AATCC 207 – TORSION 207',
        routeSection: 'TORSION 207',
        startButtonLabel: 'Capturar TORSION 207',
        pendingMessage: 'Pendiente de capturar datos TORSION 207',
        editButtonLabel: 'Editar TORSION 207',
        allowImages: true,
    },
};
