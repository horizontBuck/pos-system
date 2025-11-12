import { Component, AfterViewInit } from '@angular/core';
import { LoginComponent } from './page/login/login.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ConfigMobileService } from './core/config-mobile.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from './services/script-loader.service';
import { AuthPocketbaseService } from './services/auth-pocketbase.service';

declare const iconsax: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'pos';
  isLoginRoute = false;
  hideHeader = false;
  
  constructor(
    public router: Router,
    private cfg: ConfigMobileService,
    private scriptLoaderService: ScriptLoaderService,
    public auth: AuthPocketbaseService
  ) {
    this.cfg.load();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = ['/login', '/register'].includes(this.router.url);
        this.hideHeader = this.router.url === '/register';
      }
    });
  }

  ngOnInit() {
    // Revalidar sesión persistida en PocketBase
    if (this.auth.pb.authStore.isValid) {
      console.log('Sesión válida detectada.');
    } else {
      console.log('Sin sesión activa, redirigiendo a login...');
      this.router.navigate(['/login']);
    }
  }
  async ngAfterViewInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        if (typeof iconsax?.replace === 'function') iconsax.replace();
      });
    });

    try {
      await this.scriptLoaderService.loadAll([
        { src: 'assets/js/jquery-3.7.1.min.js', attr: { defer: 'true' } },
        { src: 'assets/js/feather.min.js', attr: { defer: 'true' } },
        { src: 'assets/js/jquery.slimscroll.min.js', attr: { defer: 'true' } },
        { src: 'assets/js/bootstrap.bundle.min.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/apexchart/apexcharts.min.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/apexchart/chart-data.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/chartjs/chart.min.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/chartjs/chart-data.js', attr: { defer: 'true' } },
        { src: 'assets/js/moment.min.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/daterangepicker/daterangepicker.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/select2/js/select2.min.js', attr: { defer: 'true' } },
        { src: 'assets/plugins/@simonwep/pickr/pickr.es5.min.js', attr: { defer: 'true' } },
        { src: 'assets/js/theme-colorpicker.js', attr: { defer: 'true' } },
        { src: 'assets/js/script.js', attr: { defer: 'true' } }
      ]);

      // Inicialización de código que depende de los scripts cargados
      (window as any).SVGInject?.(document.querySelectorAll("img.injectable"));
    } catch (err) {
      console.error('Error cargando scripts', err);
    }
  }
}
