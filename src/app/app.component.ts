import { Component } from '@angular/core';
import { LoginComponent } from './page/login/login.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ConfigMobileService } from './core/config-mobile.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HorizontalSidebarComponent } from './components/horizontal-sidebar/horizontal-sidebar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

declare const iconsax: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HeaderComponent,
    HorizontalSidebarComponent,
    SidebarComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pos';

  hideHeader = false;
  
  constructor(public router: Router,private cfg: ConfigMobileService) {
    this.cfg.load();
// app.component.ts


    this.router.events.subscribe(() => {
      this.hideHeader = this.router.url === '/register';
    });
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        if (typeof iconsax?.replace === 'function') iconsax.replace();
      });
    });
  }
}
