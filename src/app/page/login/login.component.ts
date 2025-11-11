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

  loading = signal(false);
  submitted = signal(false);
  errorMsg = signal<string | null>(null);
  showPassword = signal(false);
  companies: any[] = []; // 👈 Añadimos la propiedad companies

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    companyId: ['', Validators.required],
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

 /*  async onSubmit() {
    this.submitted.set(true);
    this.errorMsg.set(null);
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const email = this.form.value.email!;
      const password = this.form.value.password!;

      const user = await this.auth.login(email, password); // 👈 PB authWithPassword

      // Lógica de post-login según rol/estado
      const rolw = (user as any)?.rolw as ('client'|'provider'|undefined);
      const status = (user as any)?.status as boolean | undefined; // true=activo

      if (rolw === 'provider' && status === false) {
        await Swal.fire({
          icon: 'info',
          title: 'Cuenta en revisión',
          text: 'Tu cuenta de proveedor será revisada por el equipo antes de activarse.',
          confirmButtonText: 'Entendido'
        });
        // Redirige a perfil para completar docs, por ejemplo:
        await this.router.navigate(['/profile']);
        return;
      }

      // Cliente o proveedor activo
      await this.router.navigate(['/home']);

    }  finally {
      this.loading.set(false);
    }
  } */
 async onSubmit() {
  this.submitted.set(true);
  this.errorMsg.set(null);
  if (this.form.invalid) return;

  this.loading.set(true);

  try {
    const { email, password, companyId } = this.form.value;
    const data = await this.auth.login(email!, password!);

    // Validar empresa seleccionada
    const storedCompany = localStorage.getItem('companyId');
    if (storedCompany !== companyId) {
      throw new Error('El usuario no pertenece a la empresa seleccionada');
    }

    // Mostrar logs solo para ver
    console.log('Empresa:', storedCompany);
    console.log('Rol:', localStorage.getItem('role'));

    // Redirigir al home
    await this.router.navigate(['/home']);
  } catch (err: any) {
    console.error('Error de login:', err);
    this.errorMsg.set(err.message || 'Credenciales incorrectas');
  } finally {
    this.loading.set(false);
  }
}


}
