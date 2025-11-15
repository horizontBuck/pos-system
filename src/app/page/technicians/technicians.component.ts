import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
declare const bootstrap: any;

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technicians.component.html',
  styleUrl: './technicians.component.scss'
})
export class TechniciansComponent {technicians: any[] = [];
  editMode = false;
  currentId: string | null = null;

  form: any = {
    name: '',
    email: '',
    phone: '',
    specialty: '',
    active: true,
  };
generatedPassword: string | null = null;

  constructor(private auth: AuthPocketbaseService) {}

  async ngOnInit() {
    await this.loadTechnicians();
  }

  async loadTechnicians() {
    try {
      const companyId = this.auth.companyId;
      this.technicians = await this.auth.pb.collection('technicians').getFullList({
        filter: `company="${companyId}"`,
        sort: 'name',
      });
    } catch (error) {
      console.error('Error cargando técnicos:', error);
    }
  }

  newTechnician() {
    this.editMode = false;
    this.currentId = null;
    this.form = {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      active: true,
    };
  }

  editTechnician(t: any) {
    this.editMode = true;
    this.currentId = t.id;
    this.form = { ...t };
  }

  /* async saveTechnician() {
    const companyId = this.auth.companyId;
    const code = 'TEC-' + (Math.floor(Math.random() * 9000) + 1000);

    const data = {
      ...this.form,
      company: companyId,
      code,
    };

    try {
      if (this.editMode && this.currentId) {
        await this.auth.pb.collection('technicians').update(this.currentId, data);
      } else {
        await this.auth.pb.collection('technicians').create(data);
      }
      await this.loadTechnicians();
      this.closeModal();
    } catch (err) {
      console.error('Error guardando técnico:', err);
    }
  } */
/*   async saveTechnician() {
  const companyId = this.auth.companyId;
  const code = 'TEC-' + (Math.floor(Math.random() * 9000) + 1000);

  try {
    // Si estamos editando, no tocamos nada del usuario
    if (this.editMode && this.currentId) {

      const data = {
        ...this.form,
        company: companyId
      };

      await this.auth.pb.collection('technicians').update(this.currentId, data);
      await this.loadTechnicians();
      this.closeModal();
      return;
    }

    // ------------------------------
    // 1️⃣ CREAR USUARIO PARA LOGIN
    // ------------------------------
    const randomPass = 'Tec-' + Math.floor(Math.random() * 900000 + 100000);

    const userPayload = {
      email: this.form.email,
      password: randomPass,
      passwordConfirm: randomPass,
      role: 'technician',      // 👈 EL ROL IMPORTANTE
      companyId: companyId     // 👈 RELACIÓN CON EMPRESA
    };
this.generatedPassword = randomPass;

    const userRecord = await this.auth.pb
      .collection('users')
      .create(userPayload);

    console.log("Usuario técnico creado con contraseña:", randomPass);

    // ------------------------------
    // 2️⃣ CREAR EL TÉCNICO CON VÍNCULO AL USER
    // ------------------------------
    const technicianData = {
      ...this.form,
      code,
      company: companyId,
      user: userRecord.id      // 👈 AQUÍ SE VINCULAN
    };

    await this.auth.pb.collection('technicians').create(technicianData);

    // Recargar lista
    await this.loadTechnicians();

    this.closeModal();

  } catch (err) {
    console.error('❌ Error creando técnico:', err);
  }
} */


async saveTechnician() {
  const companyId = this.auth.companyId;
  const code = 'TEC-' + (Math.floor(Math.random() * 9000) + 1000);

  try {
    let userId = null;
    let password = null;

    // solo si es nuevo técnico
    if (!this.editMode) {
      password = 'Tec-' + (Math.floor(Math.random() * 9000) + 1000);

      const user = await this.auth.pb.collection('users').create({
        email: this.form.email,
        password,
        passwordConfirm: password,
        username: this.form.email.split('@')[0],
        role: "technician",
        companyId
      });

      userId = user.id;
      this.generatedPassword = password;
    }

    const data = {
      ...this.form,
      company: companyId,
      code,
      user: userId || this.form.user || null
    };

    if (this.editMode && this.currentId) {
      await this.auth.pb.collection('technicians').update(this.currentId, data);
    } else {
      await this.auth.pb.collection('technicians').create(data);
    }

    await this.loadTechnicians();
    this.closeModal();

  } catch (err) {
    console.error("ERROR COMPLETO =>", err);
  }
}



  async deleteTechnician(t: any) {
    if (!confirm(`¿Eliminar técnico ${t.name}?`)) return;
    await this.auth.pb.collection('technicians').delete(t.id);
    await this.loadTechnicians();
  }

  closeModal() {
    const modalEl = document.getElementById('add-technician');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }
}
