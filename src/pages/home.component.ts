import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AmbientBackgroundComponent } from '../components/ambient-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AmbientBackgroundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 overflow-hidden">
      
      <!-- New Ambient Background Layer -->
      <app-ambient-background />

      <!-- Hero Section -->
      <div class="relative z-10 text-center max-w-3xl animate-fade-in">
        <div class="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wide text-neutral-400 uppercase border border-neutral-800 rounded-full bg-neutral-900/50 backdrop-blur-sm">
          Resume editing assistant
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold tracking-wide text-white mb-6">
          Resume Review <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-600">Clearer applications</span>
        </h1>
        
        <p class="text-lg md:text-xl text-neutral-400 mb-4 leading-relaxed max-w-2xl mx-auto">
          Review the skills, project descriptions and missing details in your resume. Get suggestions you can check and use in your next edit.
        </p>

        <p class="text-sm text-neutral-500 font-mono mb-10">
          Live analysis uses Google Gemini. A fictional sample is available without uploading a file.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/analyze" class="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Start Resume Analysis
          </a>
          <a routerLink="/about" class="px-8 py-4 bg-transparent border border-neutral-800 text-neutral-300 font-medium rounded-lg hover:bg-neutral-900 transition-colors">
            How it Works
          </a>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full animate-slide-up">
        <!-- Feature 1 -->
        <div class="glass-card p-6 rounded-xl hover:bg-neutral-900/40 transition-colors group">
          <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Document feedback</h3>
          <p class="text-neutral-400 text-sm leading-relaxed">Review model-generated feedback. Scores are subjective suggestions and have not been validated against applicant tracking systems.</p>
        </div>

        <!-- Feature 2 -->
        <div class="glass-card p-6 rounded-xl hover:bg-neutral-900/40 transition-colors group">
          <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Deep Analysis</h3>
          <p class="text-neutral-400 text-sm leading-relaxed">Inspect extracted skills and suggested edits against your original document. Check the output before using it.</p>
        </div>

        <!-- Feature 3 -->
        <div class="glass-card p-6 rounded-xl hover:bg-neutral-900/40 transition-colors group">
          <div class="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-neutral-700 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">PDF Report</h3>
          <p class="text-neutral-400 text-sm leading-relaxed">Keep your progress. Download a clean, professional report of your analysis to guide your editing process whenever you're ready.</p>
        </div>
      </div>

      <div class="relative z-10 mt-16 text-center animate-fade-in opacity-50 hover:opacity-100 transition-opacity">
        <p class="text-neutral-600 text-xs">Built as an academic AI project using modern web technologies.</p>
      </div>
    </div>
  `
})
export class HomeComponent {}