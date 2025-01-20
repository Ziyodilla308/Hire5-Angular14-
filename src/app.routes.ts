import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthGuard } from './app/pages/auth/auth.guard';
import { Product } from './app/pages/products/product';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],

        children: [

            { path: '', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '', redirectTo: '/products', pathMatch: 'full' }
];
