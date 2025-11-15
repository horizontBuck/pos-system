import { Injectable } from '@angular/core';

/** 🧩 Estructura de un ítem de menú */
export interface MenuItem {
  label: string;
  icon?: string; // ✅ opcional para evitar el error anterior
  route?: string;
  children?: MenuItem[];
}

/** 🧱 Estructura de cada sección del menú lateral */
export interface MenuSection {
  title: string;
  items: MenuItem[];
}

/** 🚀 Servicio de menús por rol */
@Injectable({ providedIn: 'root' })
export class MenuService {
  private menuByRole: Record<string, MenuSection[]> = {
    admin: [
      {
        title: 'ADMINISTRADOR',
        items: [
          { label: 'Dashboard', icon: 'ti ti-layout-grid', route: '/home' },
          {
            label: 'Usuarios',
            icon: 'ti ti-user-edit',
            children: [
              { label: 'Clientes', icon: 'ti ti-building', route: '/clients' },
              { label: 'Tecnicos', icon: 'ti ti-user', route: '/technicians' }
            ]
          },
          { label: 'Casos de mantenimiento', icon: 'ti ti-puzzle', route: '/cases' },
          {
            label: 'Configuración',
            icon: 'ti ti-settings',
            children: [
              { label: 'General', icon: 'ti ti-adjustments', route: '/settings/general' },
              { label: 'Seguridad', icon: 'ti ti-lock', route: '/settings/security' }
            ]
          }
        ]
      },
      {
        title: 'REPORTES',
        items: [
          { label: 'Finanzas', icon: 'ti ti-report-money', route: '/reports/finance' },
          { label: 'Actividades', icon: 'ti ti-chart-bar', route: '/reports/activity' }
        ]
      }
    ],

    gestor: [
      {
        title: 'GESTOR',
        items: [
          { label: 'Dashboard', icon: 'ti ti-layout-dashboard', route: '/home' },
          { label: 'Proyectos', icon: 'ti ti-briefcase', route: '/projects' },
          { label: 'Tareas', icon: 'ti ti-list-check', route: '/tasks' },
          {
            label: 'Reportes',
            icon: 'ti ti-report-analytics',
            children: [
              { label: 'Rendimiento', icon: 'ti ti-activity', route: '/reports/performance' },
              { label: 'Actividad', icon: 'ti ti-timeline', route: '/reports/activity' }
            ]
          }
        ]
      }
    ],

    empleado: [
      {
        title: 'EMPLEADO',
        items: [
          { label: 'Mis tareas', icon: 'ti ti-list', route: '/tasks' },
          { label: 'Mi perfil', icon: 'ti ti-user', route: '/profile' },
          { label: 'Soporte', icon: 'ti ti-help', route: '/support' }
        ]
      }
    ],

    cliente: [
      {
        title: 'CLIENTE',
        items: [
          { label: 'Inicio', icon: 'ti ti-home', route: '/client/home' },
          { label: 'Mis solicitudes', icon: 'ti ti-folder', route: '/client/requests' },
          { label: 'Soporte', icon: 'ti ti-help', route: '/support' }
        ]
      }
    ]
  };

  getMenu(role: string): MenuSection[] {
    return this.menuByRole[role] || [];
  }
}
