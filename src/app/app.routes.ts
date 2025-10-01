import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
          import('./page/login/login.component').then(c => c.LoginComponent),
        title: 'Login | POS',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'POS | SISTEMA DE INVENTARIO',
        data: {
          description: 'Sistema de inventario y facturación conectado con SIIGO',
          canonical: '/',
        },
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'login' },
    
    /* {
        path: '',
        component: HomeComponent,
        title: 'POS | SISTEMA DE INVESTARIO',
        data: {
          description: 'Sistema de inventario y facturación conectado con SIIGO',
          canonical: '/',
        },
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./page/login/login.component').then(c => c.LoginComponent),
        title: 'Login | POS',
      },      
      { path: '**', redirectTo: '' }, */
];
