import { Component } from '@angular/core';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare const bootstrap: any;
@Component({
  selector: 'app-cases',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss'
})
export class CasesComponent {
cases: any[] = [];
  clients: any[] = [];
  editMode = false;
  currentId: string | null = null;
previewCode = '';

  form: any = {
    client: '',
    equipment_type: '',
    reported_issues: '',
    priority: 'Normal',
    status: 'Pendiente'
  };

  newClient: any = {
    contact_name: '',
    phone: '',
    email: ''
  };

  constructor(private auth: AuthPocketbaseService) {}

  async ngOnInit() {
    await this.loadCases();
    await this.loadClients();
  }

  async loadCases() {
    try {
      const companyId = this.auth.companyId;
      this.cases = await this.auth.pb.collection('equipment_cases').getFullList({
        filter: `company="${companyId}"`,
        expand: 'client',
        sort: '-created'
      });
    } catch (error) {
      console.error('Error cargando casos:', error);
    }
  }

  async loadClients() {
    try {
      const companyId = this.auth.companyId;
      this.clients = await this.auth.pb.collection('clients').getFullList({
        filter: `company="${companyId}" && active=true`,
        sort: 'contact_name'
      });
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }



  editCase(c: any) {
    this.editMode = true;
    this.currentId = c.id;
    this.form = {
      client: c.client,
      equipment_type: c.equipment_type,
      reported_issues: c.reported_issues,
      priority: c.priority,
      status: c.status
    };
  }


newCase() {
  this.editMode = false;
  this.currentId = null;
  this.previewCode = 'CASE-' + (Math.floor(Math.random() * 90000) + 10000);
  this.form = {
    client: '',
    equipment_type: '',
    reported_issues: '',
    priority: 'Normal',
    status: 'Pendiente'
  };
}

async saveCase() {
  const companyId = this.auth.companyId;
  const userId = this.auth.getCurrentUserId();

  if (!this.form.client) {
    alert('Por favor selecciona un cliente antes de registrar el caso.');
    return;
  }

  const code = this.previewCode || 'CASE-' + (Math.floor(Math.random() * 90000) + 10000);

  const data = {
    company: companyId,
    client: this.form.client,
    contact_name: this.getClientName(this.form.client),
    equipment_type: this.form.equipment_type,
    reported_issues: this.form.reported_issues,
    priority: this.form.priority || 'Normal',
    status: this.form.status || 'Pendiente',
    internal_code: code,
    received_by: userId,
    reception_date: new Date().toISOString(),
  };

  try {
    if (this.editMode && this.currentId) {
      await this.auth.pb.collection('equipment_cases').update(this.currentId, data);
    } else {
      await this.auth.pb.collection('equipment_cases').create(data);
    }
    await this.loadCases();
    this.closeModal('add-case');
  } catch (err) {
    console.error('Error guardando caso:', err);
  }
}



// helper para buscar el nombre del cliente
getClientName(clientId: string): string {
  const cl = this.clients.find(c => c.id === clientId);
  return cl ? cl.contact_name : '';
}


  async deleteCase(c: any) {
    if (!confirm(`¿Eliminar caso ${c.internal_code || c.id}?`)) return;
    await this.auth.pb.collection('equipment_cases').delete(c.id);
    await this.loadCases();
  }

  openClientModal() {
    const modal = new bootstrap.Modal(document.getElementById('add-client'));
    modal.show();
  }

  async saveNewClient() {
    try {
      const companyId = this.auth.companyId;
      const code = 'CU' + (Math.floor(Math.random() * 9000) + 1000);

      const newClientRecord = await this.auth.pb.collection('clients').create({
        ...this.newClient,
        company: companyId,
        code,
        active: true
      });

      // Refrescar lista y asignar cliente al formulario del caso
      await this.loadClients();
      this.form.client = newClientRecord.id;

      this.closeModal('add-client');
    } catch (error) {
      console.error('Error creando cliente:', error);
    }
  }

  closeModal(id: string) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }
}