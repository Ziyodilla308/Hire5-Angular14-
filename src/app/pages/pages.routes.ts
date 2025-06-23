import { Routes } from '@angular/router';
import { Product } from './products/product';
import { AuthGuard } from './auth/auth.guard';
import { CreateProductComponent } from './products/components/create-product';
import { ProductDetails } from './products/components/product-details';


export default [
    {
        path: 'products',
        component: Product,
        canActivate: [AuthGuard],
    },
    {
        path: 'create',
        component: CreateProductComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productDetails',
        component: ProductDetails,
        canActivate: [AuthGuard]
    }

] as Routes;
