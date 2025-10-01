// src/app/services/auth-pocketbase.service.ts
import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';

export type UserType = 'cajero' | 'admin';

export interface RegisterMinimalPayload {
  username: string;
  email: string;
  phone: string;
  type: UserType;
  dni?: string;
  avatar?: string | Blob;              // File extiende de Blob
}

@Injectable({ providedIn: 'root' })
export class AuthPocketbaseService {
  public pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://db.donreparador.com:8090');
  }

  private randomPassword(len = 18): string {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=';
    return Array.from(bytes, b => chars[b % chars.length]).join('');
  }

  isLoggedIn(): boolean {
    return this.pb.authStore.isValid && !!this.pb.authStore.model;
  }

  currentUser(): RecordModel | null {
    return this.pb.authStore.model;
  }

  fileUrl(record: RecordModel | null | undefined, fileName?: string, thumb?: string): string | null {
    if (!record || !fileName) return null;
    return this.pb.files.getUrl(record, fileName, thumb ? { thumb } : undefined);
  }

  async registerMinimal(payload: RegisterMinimalPayload): Promise<RecordModel> {
    const password = this.randomPassword();

    const rolwMap: Record<UserType, 'cashier' | 'admin'> = {
      cajero: 'cashier',
      admin: 'admin',
    };
    const rolwValue = rolwMap[payload.type];
    const isActive = payload.type === 'cajero';

    const data: Record<string, any> = {
      email: payload.email,
      emailVisibility: true,
      password,
      passwordConfirm: password,
      username: payload.username,
      name: payload.username,
      phone: payload.phone,
      dni: payload.dni ?? '',
      type: payload.type,
      rolw: rolwValue,
      status: isActive,
    };

    if (payload.avatar instanceof Blob) data['avatar'] = payload.avatar;

    const record = await this.pb.collection('users').create(data);

    if (isActive) {
      await this.pb.collection('users').authWithPassword(payload.email, password);
    }

    try {
      const userId = this.pb.authStore.model?.id ?? record.id;
      if (userId) {
        if (payload.type === 'admin') {
          await this.pb.collection('admines').create({ user: userId, estado: 'incompleto' });
        } else {
          await this.pb.collection('cajeros').create({ user: userId });
        }
      }
    } catch (e) {
      console.warn('Perfil post-registro no creado:', e);
    }

    return record;
  }

  async login(email: string, password: string) {
    const res = await this.pb.collection('users').authWithPassword(email, password);
    return res.record;
  }

  async requestPasswordReset(email: string) {
    await this.pb.collection('users').requestPasswordReset(email);
  }

  logout() {
    this.pb.authStore.clear();
  }
  getCurrentUserId(): string | null {
    return this.pb.authStore.model?.id ?? null;
  }
  async updateMyFields(patch: Partial<RecordModel>): Promise<RecordModel> {
    const id = this.getCurrentUserId();
    if (!id) throw new Error('No hay usuario autenticado.');
    const rec = await this.pb.collection('users').update(id, patch);
    this.pb.authStore.save(this.pb.authStore.token, rec as any);
    return rec;
  }

  async updateMyLocation(lat: number, long: number): Promise<RecordModel> {
    return this.updateMyFields({ lat, long });
  }
}
