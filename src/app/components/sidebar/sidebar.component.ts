import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuService, MenuSection } from '../../services/menu.service';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  menuSections: MenuSection[] = [];
  userName = '';
  userRole = '';
  avatarUrl = 'assets/img/customer/customer15.jpg';
  menuItems: MenuItem[] = [];

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || 'cliente';
    this.userName = localStorage.getItem('userName') || 'Usuario';
    const avatar = localStorage.getItem('avatar');
    if (avatar) this.avatarUrl = avatar;

    this.menuSections = this.menuService.getMenu(this.userRole);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
