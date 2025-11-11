import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import PocketBase from 'pocketbase';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const pb = new PocketBase('https://db.buckapi.site:8020');

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  showPwd = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePassword() {
    this.showPwd = !this.showPwd;
  }

  showPassword() {
    return this.showPwd;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const { company, email, password } = this.form.value;

    try {
      // 1️⃣ Buscar o crear empresa
      let companyRecord;
      const existing = await pb.collection('companies').getList(1, 1, {
        filter: `name="${company}"`,
      });

      if (existing.items.length > 0) {
        companyRecord = existing.items[0];
      } else {
        companyRecord = await pb.collection('companies').create({
          name: company,
          plan: 'free',
          active: true,
        });
      }

      // 2️⃣ Crear usuario vinculado a la empresa
      const userRecord = await pb.collection('users').create({
        email,
        emailVisibility: true,
        password,
        passwordConfirm: password,
        role: 'admin',
        companyId: companyRecord.id, // 👈 Relación automática
        status: true,
      });

      // 3️⃣ Autenticar inmediatamente
      await pb.collection('users').authWithPassword(email, password);

      // 4️⃣ Guardar info local
      localStorage.setItem('token', pb.authStore.token);
      localStorage.setItem('companyId', companyRecord.id);
      localStorage.setItem('role', userRecord['role']);
      localStorage.setItem('user', JSON.stringify(userRecord));

      // 5️⃣ Redirigir
      this.router.navigate(['/home']);
    } catch (err: any) {
      console.error('Error en registro:', err);
      this.errorMsg = err?.data?.message || 'Error en el registro. Intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
