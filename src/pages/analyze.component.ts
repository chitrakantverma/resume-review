import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyzerService } from '../services/analyzer.service';

@Component({
  selector: 'app-analyze',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen pt-12 pb-20 px-4 flex items-center justify-center bg-neutral-950">
      
      <div class="w-full max-w-xl animate-fade-in">
        <h2 class="text-3xl font-bold text-center text-white mb-2">Upload Resume</h2>
        <p class="text-neutral-400 text-center mb-8">Supported formats: PDF, PNG, JPG (Max 2MB)</p>

        <div class="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
          
          <!-- Loading Overlay -->
           @if (analyzer.isLoading()) {
            <div class="absolute inset-0 z-10 bg-neutral-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div class="w-16 h-16 border-4 border-neutral-700 border-t-white rounded-full animate-spin mb-6"></div>
              <h3 class="text-xl font-medium text-white mb-2">Analyzing Resume...</h3>
              <p class="text-neutral-400 animate-pulse">Extracting skills & scoring content</p>
            </div>
           }

          <!-- Upload Area -->
          <div 
            class="border-2 border-dashed border-neutral-700 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:border-neutral-500 hover:bg-neutral-800/30 cursor-pointer"
            [class.border-red-500]="error()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept=".pdf,.png,.jpg,.jpeg">
            
            <div class="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-neutral-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <p class="text-lg font-medium text-white mb-2">
              @if (fileName()) {
                {{ fileName() }}
              } @else {
                Drag & drop or click to upload
              }
            </p>
            <p class="text-sm text-neutral-500">
              PDF or Images only. 
            </p>
          </div>

          <!-- Error Message -->
          @if (error() || analyzer.error()) {
            <div class="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm text-center">
              {{ error() || analyzer.error() }}
            </div>
          }

          <button type="button" (click)="showSample()" [disabled]="analyzer.isLoading()" class="mt-6 text-sm underline text-neutral-300">View fictional sample report</button>
          <!-- Action Button -->
          <div class="mt-8">
            <button 
              (click)="startAnalysis()" 
              [disabled]="!fileBase64() || analyzer.isLoading()"
              class="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Analyze Resume
            </button>
          </div>

        </div>
        
        <p class="text-center text-neutral-600 text-xs mt-6 max-w-md mx-auto">
          Live analysis sends your resume to the server and Google Gemini. Remove personal contact details first. This app does not implement persistent document storage; provider handling follows your configured Google account terms.
        </p>
      </div>

    </div>
  `
})
export class AnalyzeComponent {
  private readId = 0;
  analyzer = inject(AnalyzerService);
  router = inject(Router);

  fileName = signal<string>('');
  fileBase64 = signal<string | null>(null);
  fileMimeType = signal<string>('');
  error = signal<string | null>(null);

  constructor() {
    this.analyzer.reset();
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    this.error.set(null);
    this.fileBase64.set(null);
    this.fileName.set('');
    this.fileMimeType.set('');
    const readId = ++this.readId;
    
    // Validate size (5MB)
    if (file.size > 2 * 1024 * 1024) {
      this.error.set('File is too large. Max limit is 2MB.');
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      this.error.set('Invalid format. Please upload PDF, JPG, or PNG.');
      return;
    }

    this.fileName.set(file.name);
    this.fileMimeType.set(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      if (readId !== this.readId) return;
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/png;base64,")
      const base64Data = result.split(',')[1];
      this.fileBase64.set(base64Data);
    };
    reader.onerror = () => {
      if (readId !== this.readId) return;
      this.error.set('Failed to read file.');
    };
    reader.readAsDataURL(file);
  }

  showSample() {
    this.analyzer.loadSample();
    this.router.navigate(['/result']);
  }

  async startAnalysis() {
    if (!this.fileBase64()) return;
    
    await this.analyzer.analyzeResume(this.fileBase64()!, this.fileMimeType());

    if (this.analyzer.result()) {
      this.router.navigate(['/result']);
    }
  }
}