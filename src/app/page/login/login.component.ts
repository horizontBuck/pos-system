import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthPocketbaseService);
  private router = inject(Router);
  isSuperAdmin = false;

  loading = signal(false);
  submitted = signal(false);
  errorMsg = signal<string | null>(null);
  showPassword = signal(false);
  companies: any[] = []; // 👈 Añadimos la propiedad companies
role = localStorage.getItem('role') || null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    companyId: [''], // sin validación

  });
async ngOnInit() {
    try {
      // Cargar la lista de empresas al iniciar el componente
      const result = await this.auth.pb.collection('companies').getList(1, 50, {
        sort: 'name',
      });
      this.companies = result.items;
    } catch (error) {
      console.error('Error cargando empresas:', error);
      this.errorMsg.set('Error al cargar la lista de empresas');
    }
  }

  get f() { return this.form.controls; }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

/* async onSubmit() {
  this.submitted.set(true);
  this.errorMsg.set(null);
  if (this.form.invalid) return;

  this.loading.set(true);

  try {
    const { email, password, companyId } = this.form.value;
    const data = await this.auth.login(email!, password!);

    const role = localStorage.getItem('role');
    const storedCompany = localStorage.getItem('companyId');

    // 🧠 Si es superadmin, puede entrar sin empresa
    if (role === 'superadmin') {
      await this.router.navigate(['/admin/companies']); // 👈 vista para superadmin
      return;
    }

    // 🚫 Validar empresa seleccionada para usuarios normales
    if (!storedCompany || storedCompany !== companyId) {
      throw new Error('El usuario no pertenece a la empresa seleccionada.');
    }
    this.isSuperAdmin = localStorage.getItem('role') === 'superadmin';

    // ✅ Si todo ok → ir al home de la empresa
    await this.router.navigate(['/home']);
  } catch (err: any) {
    console.error('Error de login:', err);
    this.errorMsg.set(err.message || 'Credenciales incorrectas');
  } finally {
    this.loading.set(false);
  }
} */
/* async onSubmit() {
  this.submitted.set(true);
  this.errorMsg.set(null);
  if (this.form.invalid) return;

  this.loading.set(true);

  try {
    const { email, password, companyId } = this.form.value;

    const data = await this.auth.login(email!, password!);

    const role = localStorage.getItem('role');
    const storedCompany = localStorage.getItem('companyId');

    // 🧠 SUPERADMIN: tiene acceso global sin empresa
    if (role === 'superadmin') {
      await this.router.navigate(['/admin/companies']);
      return;
    }

    // 🏢 VALIDACIÓN DE EMPRESA PARA TODOS LOS DEMÁS ROLES
    if (!storedCompany || storedCompany !== companyId) {
      throw new Error('El usuario no pertenece a la empresa seleccionada.');
    }

  
    const rolesRoutes: Record<string, string> = {
      admin: '/home',
      technician: '/tecnico/dashboard',
      cashier: '/caja',
      finance: '/finance',
      qa: '/qa',
      client: '/client/home'
    };

    // Si existe una ruta configurada → redirigir
    if (rolesRoutes[role!]) {
      await this.router.navigate([rolesRoutes[role!]]);
      return;
    }

    // Si el rol no está definido en la tabla, llevar al home
    await this.router.navigate(['/home']);

  } catch (err: any) {
    console.error('Error de login:', err);
    this.errorMsg.set(err.message || 'Credenciales incorrectas');
  } finally {
    this.loading.set(false);
  }
} */


async onSubmit() {
  this.submitted.set(true);
  this.errorMsg.set(null);
  if (this.form.invalid) return;

  this.loading.set(true);

  try {
    const { email, password } = this.form.value;

    const data = await this.auth.login(email!, password!);

    const role = localStorage.getItem('role');
    const companyId = localStorage.getItem('companyId');

    // 🧠 SUPERADMIN → va al panel de empresas
    if (role === 'superadmin') {
      await this.router.navigate(['/admin/companies']);
      return;
    }

    // 🧠 TÉCNICO → va a su dashboard
    if (role === 'technician') {
      await this.router.navigate(['/technician/dashboard']);
      return;
    }

    // 🧠 OTROS ROLES (admin, financiero, etc)
    await this.router.navigate(['/home']);

  } catch (err: any) {
    console.error('Error de login:', err);
    this.errorMsg.set('Credenciales incorrectas');
  } finally {
    this.loading.set(false);
  }
}


}
