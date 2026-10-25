import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed top-0 w-full z-50 glass border-b border-neutral-800 no-print">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-black font-bold text-lg group-hover:scale-105 transition-transform">
            RR
          </div>
          <span class="font-semibold text-lg tracking-tight">Resume Review</span>
        </a>

        <div class="flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-white" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</a>
          <a routerLink="/analyze" routerLinkActive="text-white" class="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Analyze</a>
          <a routerLink="/about" routerLinkActive="text-white" class="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}