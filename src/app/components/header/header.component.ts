import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.buckapi.site:8020');
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  companyName = '';
  userName = '';
  avatarUrl = 'assets/img/profiles/avatar-01.jpg';
  searchTerm = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    const companyId = localStorage.getItem('companyId');
    const role = localStorage.getItem('role');
    const user = pb.authStore.model;

    if (user) {
      this.userName = user['name'] || 'Usuario';
      if (user['avatar']) {
        this.avatarUrl = `https://db.buckapi.site:8020/api/files/_pb_users_auth_/${user.id}/${user['avatar']}`;
      }
    }

    if (companyId) {
      const company = await pb.collection('companies').getOne(companyId);
      this.companyName = company['name'];
    }
  }

  async searchGlobal() {
    const term = this.searchTerm.trim();
    if (!term) return;

    // podrías enviar a una vista /search?q=term
    this.router.navigate(['/search'], { queryParams: { q: term } });
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    pb.authStore.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
