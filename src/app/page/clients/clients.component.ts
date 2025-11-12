import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
declare const bootstrap: any;
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  form: any = {};
  editMode = false;
  currentId: string | null = null;

  constructor(private auth: AuthPocketbaseService) {}

  async ngOnInit() {
    await this.loadClients();
  }

  async loadClients() {
    try {
      const companyId = this.auth.companyId;
      this.clients = await this.auth.pb.collection('clients').getFullList({
        filter: `company="${companyId}"`,
        sort: '-created'
      });
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  newClient() {
    this.editMode = false;
    this.currentId = null;
    this.form = {
      contact_name: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      active: true
    };
  }

  editClient(c: any) {
    this.editMode = true;
    this.currentId = c.id;
    this.form = { ...c };
  }

  async saveClient() {
  try {
    const companyId = this.auth.companyId;

    // ✅ Generar código automático solo al crear
    if (!this.editMode) {
      this.form.code = 'CU' + (Math.floor(Math.random() * 9000) + 1000);
    }

    const data = {
      ...this.form,
      company: companyId
    };

    if (this.editMode && this.currentId) {
      // 🔄 Actualizar cliente existente
      await this.auth.pb.collection('clients').update(this.currentId, data);
    } else {
      // 🆕 Crear cliente nuevo con código generado
      await this.auth.pb.collection('clients').create(data);
    }

    await this.loadClients();
    this.closeModal();
  } catch (err) {
    console.error('Error guardando cliente:', err);
  }
}


  async deleteClient(c: any) {
    if (!confirm(`¿Eliminar cliente ${c.contact_name}?`)) return;
    await this.auth.pb.collection('clients').delete(c.id);
    await this.loadClients();
  }

  closeModal() {
    const modalEl = document.getElementById('add-customer');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }
}
