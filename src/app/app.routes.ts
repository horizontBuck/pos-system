import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./page/login/login.component').then(c => c.LoginComponent),
    title: 'Login | CRM',
      canActivate: [guestGuard],

  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'CRM | MANTENIMIENTO INDUSTRIAL',
    data: {
      description: 'Sistema de inventario y facturación conectado con SIIGO',
      canonical: '/',
       canActivate: [authGuard],
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./page/register/register.component').then(c => c.RegisterComponent),
    title: 'Register | CRM',
    canActivate: [authGuard],

  },
  {
  path: 'cases',
  loadComponent: () => 
    import('./page/cases/cases.component').then(c => c.CasesComponent),
  title: 'Casos | CRM',
   canActivate: [authGuard],
},
  {
  path: 'clients',
  loadComponent: () => 
    import('./page/clients/clients.component').then(c => c.ClientsComponent),
  title: 'Gestion de clientes | CRM',
   canActivate: [authGuard],
  },
  {
  path: 'technicians',
  loadComponent: () => 
    import('./page/technicians/technicians.component').then(c => c.TechniciansComponent),
  title: 'Técnicos | CRM',
  canActivate: [authGuard]
  },
  {
  path: 'admin',
  children: [
    {
      path: 'companies',
      loadComponent: () => 
        import('./page/admin/companies/companies.component').then(c => c.CompaniesComponent),
      title: 'Administrar Empresas | CRM',
       canActivate: [authGuard],
    }
  ]
},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];
