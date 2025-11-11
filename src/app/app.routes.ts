import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
          import('./page/login/login.component').then(c => c.LoginComponent),
        title: 'Login | CRM',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'CRM | MANTENIMIENTO INDUSTRIAL',
        data: {
          description: 'Sistema de inventario y facturación conectado con SIIGO',
          canonical: '/',
        },
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./page/register/register.component').then(c => c.RegisterComponent),
        title: 'Register | CRM',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'login' },
    
   
];
