import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import PocketBase from 'pocketbase';
import { Chart } from 'chart.js';

const pb = new PocketBase('https://db.buckapi.site:8020');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  companyName = '';
  stats = {
    clients: 0,
    projects: 0,
    tasks: 0,
    revenue: 0,
  };
  recentClients: any[] = [];
  activities: any[] = [];

  async ngOnInit() {
    const companyId = localStorage.getItem('companyId');

    if (!companyId) return;

    // Cargar nombre de la empresa
    const company = await pb.collection('companies').getOne(companyId);
    this.companyName = company['name'];

    // Cargar métricas base
    const clients = await pb.collection('clients').getFullList({ filter: `companyId="${companyId}"` });
    const projects = await pb.collection('projects').getFullList({ filter: `companyId="${companyId}"` });
    const tasks = await pb.collection('tasks').getFullList({ filter: `companyId="${companyId}"` });

    this.stats.clients = clients.length;
    this.stats.projects = projects.length;
    this.stats.tasks = tasks.filter(t => !t['completed']).length;
    this.stats.revenue = projects.reduce((acc, p) => acc + (p['total'] || 0), 0);

    // Clientes recientes
    this.recentClients = clients.slice(-4).reverse();

    // Actividades recientes
    const logs = await pb.collection('activities').getList(1, 5, {
      sort: '-created',
      filter: `companyId="${companyId}"`,
    });
    this.activities = logs.items;
  }

  ngAfterViewInit() {
  new Chart('crmChart', {
    type: 'bar',
    data: {
      labels: ['Clientes', 'Proyectos', 'Tareas'],
      datasets: [{
        label: 'Totales actuales',
        data: [this.stats.clients, this.stats.projects, this.stats.tasks],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}
}
