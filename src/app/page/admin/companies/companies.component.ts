import { Component } from '@angular/core';
import { AuthPocketbaseService } from '../../../services/auth-pocketbase.service';
import { CommonModule } from '@angular/common';
declare const bootstrap: any;
@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
 companies: any[] = [];
  loading = false;
  selectedCompany: any = null;

  constructor(private auth: AuthPocketbaseService) {}

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {
    this.loading = true;
    try {
      this.companies = await this.auth.pb.collection('companies').getFullList({
        sort: '-created',
      });
    } catch (err) {
      console.error('Error cargando empresas:', err);
    } finally {
      this.loading = false;
    }
  }

  // Mostrar detalles de empresa
  viewCompanyDetails(c: any) {
    this.selectedCompany = c;
    const modalEl = document.getElementById('view-company');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // Construir URL del logo
  getLogoUrl(c: any): string | null {
    if (!c.logo) return null;
    return this.auth.pb.files.getUrl(c, c.logo, { thumb: '100x100' });
  }
}
