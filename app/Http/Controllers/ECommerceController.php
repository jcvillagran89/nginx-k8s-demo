<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ECommerceController extends Controller
{
    public function categories()
    {
        return Inertia::render('e-commerce/categories/index');
    }

    public function customers()
    {
        return Inertia::render('e-commerce/customers/index');
    }

    public function orders()
    {
        return Inertia::render('e-commerce/orders/index');
    }

    public function ordersDetails()
    {
        return Inertia::render('e-commerce/order-details/index');
    }

    public function products()
    {
        return Inertia::render('e-commerce/products/index');
    }

    public function productsAdd()
    {
        return Inertia::render('e-commerce/add-products/index');
    }

    public function productsDetails()
    {
        return Inertia::render('e-commerce/product-details/index');
    }

    public function productsGrid()
    {
        return Inertia::render('e-commerce/products-grid/index');
    }

    public function sellers()
    {
        return Inertia::render('e-commerce/sellers/index');
    }
}
