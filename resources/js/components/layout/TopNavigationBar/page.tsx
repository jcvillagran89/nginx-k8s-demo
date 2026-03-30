import FallbackLoading from '@/components/FallbackLoading';
import LogoBox from '@/components/LogoBox';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { router } from '@inertiajs/react';
import { Modal } from 'react-bootstrap';
import { Suspense, useEffect, useRef, useState } from 'react';
import Apps from './components/Apps';
import Country from './components/Country';
import HorizontalToggle from './components/HorizontalToggle';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import Notifications from './components/Notifications';
import ProfileDropdown from './components/ProfileDropdown';

const TopNavigationBarPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const topbarSearchRef = useRef<HTMLInputElement | null>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const getDefaultDateRange = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);

        return `${formatDate(start)} a ${formatDate(end)}`;
    };

    const handleSearch = (value?: string) => {
        const query = (value ?? searchTerm).trim();
        if (!query) return;

        router.get(
            route('test.request.index'),
            {
                q: query,
                status: 6,
                date_range: getDefaultDateRange(),
                page: 1,
                per_page: 10,
            },
            { preserveState: false, preserveScroll: true }
        );

        setIsSearchOpen(false);
    };

    const expandTopbarSearch = () => {
        if (!isSearchExpanded) {
            setIsSearchExpanded(true);
        }

        topbarSearchRef.current?.focus();
    };

    const handleTopbarBlur = () => {
        if (!searchTerm.trim()) {
            setIsSearchExpanded(false);
        }
    };

    useEffect(() => {
        if (!isSearchOpen) return;

        const id = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);

        return () => window.clearTimeout(id);
    }, [isSearchOpen]);

    return (
        <header className="app-topbar">
            <div className="page-container topbar-menu">
                <div className="d-flex align-items-center gap-2">
                    <LogoBox />
                    <LeftSideBarToggle />
                    <HorizontalToggle />
                    <div
                        className={`topbar-search text-muted d-none d-xl-flex gap-2 align-items-center ${isSearchExpanded ? 'is-expanded' : ''}`}
                        onClick={expandTopbarSearch}
                    >
                        <button
                            type="button"
                            className="btn p-0 border-0 bg-transparent text-muted"
                            onClick={(event) => {
                                event.stopPropagation();
                                if (searchTerm.trim()) {
                                    handleSearch();
                                } else {
                                    expandTopbarSearch();
                                }
                            }}
                            aria-label="Buscar"
                        >
                            <IconifyIcon icon="tabler:search" className="fs-18" />
                        </button>
                        <input
                            type="search"
                            ref={topbarSearchRef}
                            className="form-control border-0 bg-transparent p-0 flex-grow-1 topbar-search-input"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchExpanded(true)}
                            onBlur={handleTopbarBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <span className="ms-auto fw-medium d-none d-xxl-inline">⌘K</span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="topbar-item d-flex d-xl-none">
                        <button className="topbar-link" type="button" onClick={() => setIsSearchOpen(true)}>
                            <IconifyIcon icon="tabler:search" className="fs-22" />
                        </button>
                    </div>
                    <Suspense fallback={<FallbackLoading />}>
                        <Notifications />
                    </Suspense>
                    <ProfileDropdown />
                </div>
            </div>

            <Modal
                show={isSearchOpen}
                onHide={() => setIsSearchOpen(false)}
                centered
                size="lg"
                aria-labelledby="topbar-search-modal-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="topbar-search-modal-title">Buscar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center bg-body-tertiary rounded-4 px-3 py-2">
                        <IconifyIcon icon="tabler:search" className="me-2 text-muted fs-4" />
                        <input
                            ref={searchInputRef}
                            type="search"
                            className="form-control border-0 bg-transparent p-0"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                    </div>
                    <div className="text-muted small mt-2">
                        Se buscaran solicitudes con un rango de 30 dias por defecto.
                    </div>
                </Modal.Body>
            </Modal>
        </header>
    );
};

export default TopNavigationBarPage;
