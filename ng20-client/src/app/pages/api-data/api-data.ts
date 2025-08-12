import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ApiService, User } from '../../core/api.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  template: `
    <h2>API Data</h2>
   

    <button (click)="reload()">Reload</button>

    <p *ngIf="loading()">Loading…</p>
    <p class="err" *ngIf="error()">{{ error() }}</p>

    <ng-container *ngIf="users$ | async as users">
      <div *ngFor="let u of users" class="card">
        <h3>#{{ u.id }} — {{ u.name }}</h3>
        <p><strong>Username:</strong> {{ u.username }}</p>
        <p><strong>Email:</strong> {{ u.email }}</p>
      </div>
      <p *ngIf="!users.length">No data available.</p>
    </ng-container>
  `,
  styles: [`
    .card { padding:1rem; border:1px solid #eee; border-radius:12px; margin:.5rem 0; }
    .err { color:#b00020; }
    button { margin:.5rem 0; }
  `]
})
export class ApiDataComponent implements OnInit {
  private api = inject(ApiService);

  users$!: Observable<User[]>;
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.users$ = this.api.getUsers();
    this.users$.subscribe({
      next: () => this.loading.set(false),
      error: (e) => {
        this.loading.set(false);
        this.error.set(e.message ?? 'Error');
      }
    });
  }

  reload() { this.load(); }
}
