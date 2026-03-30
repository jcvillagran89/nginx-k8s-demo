<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppsController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\ECommerceController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\UIController;
use App\Http\Controllers\ExtendedUIController;
use App\Http\Controllers\IconsController;
use App\Http\Controllers\ChartsController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\TablesController;
use App\Http\Controllers\MapsController;
use App\Http\Controllers\LayoutsController;
use App\Http\Controllers\MicrosoftAuthController;
use Inertia\Inertia;

require __DIR__ . '/auth.php';

Route::get('/microsoft/callback', [MicrosoftAuthController::class, 'callback'])->name('microsoft.callback');
Route::get('/microsoft/check-share-access', [MicrosoftAuthController::class, 'checkShareAccess'])->name('microsoft.check-share-access');

Route::get('/health', function () {
    return response('ok', 200);
})->withoutMiddleware([
    \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
]);

Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/', [DashboardController::class, 'sales'])->name('dashboard');
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/clinic', [DashboardController::class, 'clinic']);
    Route::get('/dashboard/wallet', [DashboardController::class, 'wallet']);


    Route::get('/apps/calendar', [AppsController::class, 'calendar']);
    Route::get('/apps/chat', [AppsController::class, 'chat']);
    Route::get('/apps/email', [AppsController::class, 'email']);
    Route::get('/apps/file-manager', [AppsController::class, 'fileManager']);


    Route::get('/invoices', [InvoiceController::class, 'invoice']);
    Route::get('/invoices/add', [InvoiceController::class, 'invoiceAdd']);
    Route::get('/invoices/details', [InvoiceController::class, 'invoiceDetails']);


    Route::get('/hospital/appointments', [HospitalController::class, 'appointments']);
    Route::get('/hospital/contacts', [HospitalController::class, 'contacts']);
    Route::get('/hospital/departments', [HospitalController::class, 'departments']);
    Route::get('/hospital/doctors', [HospitalController::class, 'doctors']);
    Route::get('/hospital/doctors/add', [HospitalController::class, 'doctorsAdd']);
    Route::get('/hospital/doctors/details', [HospitalController::class, 'doctorsDetails']);
    Route::get('/hospital/patients', [HospitalController::class, 'patients']);
    Route::get('/hospital/patients/add', [HospitalController::class, 'patientsAdd']);
    Route::get('/hospital/patients/details', [HospitalController::class, 'patientsDetails']);
    Route::get('/hospital/payments', [HospitalController::class, 'payments']);
    Route::get('/hospital/reviews', [HospitalController::class, 'reviews']);
    Route::get('/hospital/staffs', [HospitalController::class, 'staffs']);


    Route::get('/e-commerce/categories', [ECommerceController::class, 'categories']);
    Route::get('/e-commerce/customers', [ECommerceController::class, 'customers']);
    Route::get('/e-commerce/orders', [ECommerceController::class, 'orders']);
    Route::get('/e-commerce/orders/details', [ECommerceController::class, 'ordersDetails']);
    Route::get('/e-commerce/products', [ECommerceController::class, 'products']);
    Route::get('/e-commerce/products/add', [ECommerceController::class, 'productsAdd']);
    Route::get('/e-commerce/products/details', [ECommerceController::class, 'productsDetails']);
    Route::get('/e-commerce/products-grid', [ECommerceController::class, 'productsGrid']);
    Route::get('/e-commerce/sellers', [ECommerceController::class, 'sellers']);


    Route::get('/pages/email-templates/activation', [PagesController::class, 'emailActivation']);
    Route::get('/pages/email-templates/basic', [PagesController::class, 'emailBasic']);
    Route::get('/pages/email-templates/invoice', [PagesController::class, 'emailInvoice']);
    Route::get('/pages/faq', [PagesController::class, 'faq']);
    Route::get('/pages/pricing-1', [PagesController::class, 'pricing1']);
    Route::get('/pages/pricing-2', [PagesController::class, 'pricing2']);
    Route::get('/pages/coming-soon', [PagesController::class, 'comingSoon']);
    Route::get('/pages/maintenance', [PagesController::class, 'maintenance']);
    Route::get('/pages/starter', [PagesController::class, 'starter']);
    Route::get('/pages/terms-conditions', [PagesController::class, 'termsConditions']);
    Route::get('/pages/timeline', [PagesController::class, 'timeline']);


    Route::get('/error/400', [ErrorController::class, 'error400']);
    Route::get('/error/401', [ErrorController::class, 'error401']);
    Route::get('/error/403', [ErrorController::class, 'error403']);
    Route::get('/error/404', [ErrorController::class, 'error404']);
    Route::get('/error/404-alt', [ErrorController::class, 'error404Alt']);
    Route::get('/error/408', [ErrorController::class, 'error408']);
    Route::get('/error/500', [ErrorController::class, 'error500']);
    Route::get('/error/501', [ErrorController::class, 'error501']);
    Route::get('/error/502', [ErrorController::class, 'error502']);
    Route::get('/error/503', [ErrorController::class, 'error503']);


    Route::get('/ui/accordions', [UIController::class, 'accordions']);
    Route::get('/ui/alerts', [UIController::class, 'alerts']);
    Route::get('/ui/avatars', [UIController::class, 'avatars']);
    Route::get('/ui/badges', [UIController::class, 'badges']);
    Route::get('/ui/breadcrumb', [UIController::class, 'breadcrumb']);
    Route::get('/ui/buttons', [UIController::class, 'buttons']);
    Route::get('/ui/cards', [UIController::class, 'cards']);
    Route::get('/ui/carousel', [UIController::class, 'carousel']);
    Route::get('/ui/collapse', [UIController::class, 'collapse']);
    Route::get('/ui/dropdowns', [UIController::class, 'dropdowns']);
    Route::get('/ui/ratio', [UIController::class, 'ratios']);
    Route::get('/ui/grid', [UIController::class, 'grid']);
    Route::get('/ui/links', [UIController::class, 'links']);
    Route::get('/ui/list-group', [UIController::class, 'listGroup']);
    Route::get('/ui/modals', [UIController::class, 'modals']);
    Route::get('/ui/notifications', [UIController::class, 'notifications']);
    Route::get('/ui/offcanvas', [UIController::class, 'offcanvas']);
    Route::get('/ui/placeholders', [UIController::class, 'placeholders']);
    Route::get('/ui/pagination', [UIController::class, 'pagination']);
    Route::get('/ui/popovers', [UIController::class, 'popovers']);
    Route::get('/ui/progress', [UIController::class, 'progress']);
    Route::get('/ui/spinners', [UIController::class, 'spinners']);
    Route::get('/ui/tabs', [UIController::class, 'tabs']);
    Route::get('/ui/tooltips', [UIController::class, 'tooltips']);
    Route::get('/ui/typography', [UIController::class, 'typography']);
    Route::get('/ui/utilities', [UIController::class, 'utilities']);


    Route::get('/extended/dragula', [ExtendedUIController::class, 'dragula']);
    Route::get('/extended/sweet-alert', [ExtendedUIController::class, 'sweetalerts']);
    Route::get('/extended/ratings', [ExtendedUIController::class, 'ratings']);
    Route::get('/extended/scrollbar', [ExtendedUIController::class, 'scrollbar']);


    Route::get('/icons/tabler', [IconsController::class, 'tabler']);
    Route::get('/icons/solar', [IconsController::class, 'solar']);


    Route::get('/charts/area', [ChartsController::class, 'area']);
    Route::get('/charts/bar', [ChartsController::class, 'bar']);
    Route::get('/charts/bubble', [ChartsController::class, 'bubble']);
    Route::get('/charts/candlestick', [ChartsController::class, 'candlestick']);
    Route::get('/charts/column', [ChartsController::class, 'column']);
    Route::get('/charts/heatmap', [ChartsController::class, 'heatmap']);
    Route::get('/charts/line', [ChartsController::class, 'line']);
    Route::get('/charts/mixed', [ChartsController::class, 'mixed']);
    Route::get('/charts/timeline', [ChartsController::class, 'timeline']);
    Route::get('/charts/boxplot', [ChartsController::class, 'boxplot']);
    Route::get('/charts/treemap', [ChartsController::class, 'treemap']);
    Route::get('/charts/pie', [ChartsController::class, 'pie']);
    Route::get('/charts/radar', [ChartsController::class, 'radar']);
    Route::get('/charts/radialbar', [ChartsController::class, 'radialbar']);
    Route::get('/charts/scatter', [ChartsController::class, 'scatter']);
    Route::get('/charts/polar', [ChartsController::class, 'polar']);
    Route::get('/charts/sparklines', [ChartsController::class, 'sparklines']);


    Route::get('/forms/basic', [FormsController::class, 'basic']);
    Route::get('/forms/inputmask', [FormsController::class, 'inputMask']);
    Route::get('/forms/picker', [FormsController::class, 'picker']);
    Route::get('/forms/select', [FormsController::class, 'select']);
    Route::get('/forms/slider', [FormsController::class, 'slider']);
    Route::get('/forms/validation', [FormsController::class, 'validation']);
    Route::get('/forms/wizard', [FormsController::class, 'wizard']);
    Route::get('/forms/file-uploads', [FormsController::class, 'fileUploads']);
    Route::get('/forms/editors', [FormsController::class, 'editors']);
    Route::get('/forms/layouts', [FormsController::class, 'layouts']);


    Route::get('/tables/basic', [TablesController::class, 'basic']);
    Route::get('/tables/gridjs', [TablesController::class, 'gridjs']);


    Route::get('/maps/vector', [MapsController::class, 'vector']);
    Route::get('/maps/leaflet', [MapsController::class, 'leaflet']);


    Route::get('/layouts/horizontal', [LayoutsController::class, 'horizontal']);
    Route::get('/layouts/compact', [LayoutsController::class, 'compact']);
    Route::get('/layouts/detached', [LayoutsController::class, 'detached']);
    Route::get('/layouts/full', [LayoutsController::class, 'full']);
    Route::get('/layouts/fullscreen', [LayoutsController::class, 'fullscreen']);
    Route::get('/layouts/hover', [LayoutsController::class, 'hoverMenu']);
    Route::get('/layouts/icon-view', [LayoutsController::class, 'iconView']);
    Route::get('/layouts/dark', [LayoutsController::class, 'dark']);
});


// These routes are only for demo purpose, remove them in production. For authentication, use routes define in auth.php

Route::get('/auth/login', function () {
    return Inertia::render('auth/login/index');
});

Route::get('/auth/register', function () {
    return Inertia::render('auth/register/index');
});

Route::get('/auth/logout', function () {
    return Inertia::render('auth/logout/index');
});

Route::get('/auth/forgot-password', function () {
    return Inertia::render('auth/forgot-password/index');
});

Route::get('/auth/reset-password', function () {
    return Inertia::render('auth/reset-password/index');
});

Route::get('/auth/verify-email', function () {
    return Inertia::render('auth/verify-email/index');
});

Route::get('/auth/confirm-password', function () {
    return Inertia::render('auth/confirm-password/index');
});

Route::get('/auth/lock-screen', function () {
    return Inertia::render('auth/lock-screen/index');
});

Route::get('/auth/confirm-mail', function () {
    return Inertia::render('auth/confirm-mail/index');
});

Route::get('/auth/login-pin', function () {
    return Inertia::render('auth/login-pin/index');
});

Route::get('/auth/two-factor', function () {
    return Inertia::render('auth/two-factor/index');
});

Route::get('/auth/account-deactivation', function () {
    return Inertia::render('auth/account-deactivation/index');
});

/*********************************---ROUTES TEXTILE LAB---*********************************/
Route::middleware(['auth','verified'])->group(function () {

    /*
    | SUPERADMIN
    */
    Route::middleware('role:superadmin')->group(function () {
        require base_path('routes/admin/admin.php');
        require base_path('routes/provider/provider.php');
    });

    /*
    | ADMIN + SUPERADMIN
    */
    Route::middleware('role:superadmin|admin')->group(function () {
        require base_path('routes/test/test.php');
        require base_path('routes/item/item.php');
        require base_path('routes/supervision/supervision.php');
        require base_path('routes/committee/committee.php');
        require base_path('routes/reports/report.php');
    });

    /*
    | TODOS LOS ROLES QUE PUEDEN VER RESULTADOS
    */
    Route::middleware('role:superadmin|admin|lab_technician')->group(function () {
        require base_path('routes/test-results/test-results.php');
    });

});

Route::get('/debug/oci', function () {
    return [
        'php_version' => PHP_VERSION,
        'extension_loaded_oci8' => extension_loaded('oci8'),
        'defined_OCI_DEFAULT' => defined('OCI_DEFAULT'),
    ];
});
