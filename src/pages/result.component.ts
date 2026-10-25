import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyzerService } from '../services/analyzer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (analyzer.result(); as result) {
      <div class="min-h-screen pb-20 px-4 md:px-8 bg-transparent print:bg-white print:text-black">
        <div class="max-w-5xl mx-auto pt-8">
          
          <!-- Header / Actions -->
          <div class="flex flex-col md:flex-row justify-between items-center mb-10 no-print animate-fade-in gap-4">
            <h2 class="text-2xl font-bold text-white tracking-tight">Analysis Report</h2>
            <div class="flex gap-4">
              <button 
                (click)="downloadPDF()" 
                [disabled]="isGeneratingPdf()"
                class="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-neutral-200 transition-all disabled:opacity-70 disabled:cursor-wait shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95"
              >
                @if (isGeneratingPdf()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>Download Report</span>
                }
              </button>
            </div>
          </div>

          <!-- Main Report Content -->
          <div id="report-content" class="glass-card print:border-none print:shadow-none print:bg-white rounded-3xl p-8 md:p-12 animate-slide-up">
            
            <!-- Top Section: Score & Summary -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 border-b border-neutral-800/50 print:border-gray-200 pb-16">
              
              <!-- Circular Score Indicator -->
              <div class="col-span-1 md:col-span-4 flex flex-col items-center justify-center relative">
                <div class="relative w-56 h-56 flex items-center justify-center mb-4">
                  <!-- Outer Glow based on score -->
                  <div class="absolute inset-0 rounded-full blur-3xl opacity-10 no-print"
                       [class.bg-white]="result.resume_score >= 80"
                       [class.bg-neutral-500]="result.resume_score < 80"></div>
                  
                  <!-- SVG Circle -->
                  <svg class="w-full h-full transform -rotate-90 drop-shadow-2xl overflow-visible">
                    <!-- Background Track -->
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" stroke-width="8" fill="transparent" class="text-neutral-900 print:text-gray-100" />
                    <!-- Progress Arc -->
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" stroke-width="8" fill="transparent" 
                      class="transition-all duration-1500 ease-out"
                      [class.text-white]="result.resume_score >= 80"
                      [class.text-neutral-400]="result.resume_score >= 50 && result.resume_score < 80"
                      [class.text-neutral-600]="result.resume_score < 50"
                      [class.print:text-black]="true"
                      stroke-linecap="round"
                      [style.stroke-dasharray]="circumference" 
                      [style.stroke-dashoffset]="strokeDashoffset(result.resume_score)" 
                    />
                  </svg>
                  
                  <div class="absolute flex flex-col items-center">
                    <span class="text-7xl font-mono font-bold tracking-tighter"
                          [class.text-white]="result.resume_score >= 80"
                          [class.text-neutral-300]="result.resume_score < 80"
                          [class.print:text-black]="true">
                      {{ result.resume_score }}
                    </span>
                    <span class="text-xs text-neutral-500 uppercase tracking-widest mt-2 font-bold">Estimated Score</span>
                  </div>
                </div>
                
                <div class="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-medium print:hidden">
                  Subjective document review
                </div>
              </div>

              <!-- Summary & Job Match Indicators -->
              <div class="col-span-1 md:col-span-8 flex flex-col justify-center pl-0 md:pl-8">
                <div class="mb-10">
                  <h3 class="text-xl font-bold text-white print:text-black mb-4 tracking-tight">Executive Summary</h3>
                  <p class="text-neutral-300 print:text-gray-700 leading-relaxed text-base font-light text-justify border-l-2 border-neutral-800 pl-4">
                    {{ result.summary }}
                  </p>
                </div>
                
                <div>
                  <h4 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span class="w-2 h-2 bg-neutral-700 rounded-full"></span>
                    Target Role Match
                  </h4>
                  <div class="space-y-6">
                    @for (job of result.suitable_job_roles; track job.role) {
                      <div class="relative group">
                        <div class="flex justify-between text-sm mb-2">
                          <span class="text-white print:text-black font-semibold tracking-wide">{{ job.role }}</span>
                          <span class="font-mono text-neutral-400 text-xs bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 print:border-gray-300">{{ job.match }}% Match</span>
                        </div>
                        <!-- Progress Bar Container -->
                        <div class="w-full bg-neutral-900 print-bg-gray h-3 rounded-full overflow-hidden border border-neutral-800/50 print:border-none relative">
                          <!-- Grid lines for visual reference -->
                          <div class="absolute inset-0 flex justify-between px-2">
                            <div class="w-px h-full bg-neutral-800/50"></div>
                            <div class="w-px h-full bg-neutral-800/50"></div>
                            <div class="w-px h-full bg-neutral-800/50"></div>
                          </div>
                          <!-- Progress Bar Fill -->
                          <div class="h-full rounded-full transition-all duration-1000 ease-out print-bg-black relative z-10"
                               [style.width.%]="job.match"
                               [class.bg-white]="job.match >= 80"
                               [class.bg-neutral-400]="job.match >= 60 && job.match < 80"
                               [class.bg-neutral-600]="job.match < 60">
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills Visualization -->
            <div class="mb-16">
              <h3 class="text-xl font-bold text-white print:text-black mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Skill Proficiency Profile
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                <!-- Technical Skills -->
                <div>
                  <h4 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 border-b border-neutral-800 pb-2">Technical Competencies</h4>
                  <div class="space-y-5">
                    @for (skill of result.technical_skills; track skill.name) {
                      <div class="group">
                        <div class="flex justify-between text-xs mb-2">
                          <span class="text-neutral-200 print:text-black font-medium group-hover:text-white transition-colors">{{ skill.name }}</span>
                          <span class="text-neutral-500 print:text-gray-500 text-[10px]">{{ getSkillLabel(skill.level) }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-grow bg-neutral-900 print-bg-gray h-2 rounded-sm overflow-hidden border border-neutral-800/30">
                            <div class="h-full rounded-sm transition-all duration-700 ease-out print-bg-black" 
                                 [style.width.%]="skill.level"
                                 [class.bg-neutral-200]="skill.level >= 85"
                                 [class.bg-neutral-400]="skill.level >= 70 && skill.level < 85"
                                 [class.bg-neutral-600]="skill.level < 70">
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                
                <!-- Soft Skills -->
                <div>
                  <h4 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 border-b border-neutral-800 pb-2">Professional Attributes</h4>
                  <div class="space-y-5">
                    @for (skill of result.soft_skills; track skill.name) {
                      <div class="group">
                        <div class="flex justify-between text-xs mb-2">
                          <span class="text-neutral-200 print:text-black font-medium group-hover:text-white transition-colors">{{ skill.name }}</span>
                          <span class="text-neutral-500 print:text-gray-500 text-[10px]">{{ getSkillLabel(skill.level) }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-grow bg-neutral-900 print-bg-gray h-2 rounded-sm overflow-hidden border border-neutral-800/30">
                            <div class="h-full rounded-sm transition-all duration-700 ease-out print-bg-black" 
                                 [style.width.%]="skill.level"
                                 [class.bg-neutral-300]="skill.level >= 80"
                                 [class.bg-neutral-500]="skill.level < 80">
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Strengths vs Weaknesses (Two Column Layout) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <!-- Strengths -->
              <div class="bg-gradient-to-br from-neutral-900/50 to-transparent print-bg-gray rounded-3xl p-8 border border-neutral-800 print:border-transparent relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <h3 class="text-lg font-bold text-white print:text-black mb-6 flex items-center gap-3">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-sm font-bold shadow-lg print:border print:border-black">+</div>
                  Key Strengths
                </h3>
                <ul class="space-y-4">
                  @for (str of result.strengths; track str) {
                    <li class="flex gap-4 text-sm text-neutral-300 print:text-black font-normal items-start group">
                      <svg class="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ str }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Weaknesses -->
              <div class="bg-gradient-to-br from-neutral-900/50 to-transparent print-bg-gray rounded-3xl p-8 border border-neutral-800 print:border-transparent relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-neutral-800/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <h3 class="text-lg font-bold text-white print:text-black mb-6 flex items-center gap-3">
                   <div class="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-950 text-neutral-400 text-sm font-bold border border-neutral-800 shadow-lg print:border-black print:text-black print:bg-transparent">-</div>
                  Areas for Growth
                </h3>
                <ul class="space-y-4">
                  @for (weak of result.weaknesses; track weak) {
                    <li class="flex gap-4 text-sm text-neutral-400 print:text-black font-normal items-start group">
                      <svg class="w-5 h-5 text-neutral-600 group-hover:text-neutral-300 transition-colors mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {{ weak }}
                    </li>
                  }
                </ul>
              </div>
            </div>

            <!-- Improvements -->
            <div class="pt-12 border-t border-neutral-800 print:border-gray-200">
              <h3 class="text-xl font-bold text-white print:text-black mb-8">Action Plan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (imp of result.improvements; track imp; let i = $index) {
                  <div class="flex gap-4 items-start p-5 bg-neutral-900/30 print:bg-transparent rounded-2xl border border-neutral-800/50 print:border-gray-100 hover:border-neutral-600 hover:bg-neutral-900/50 transition-all group">
                    <div class="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0 text-neutral-500 group-hover:text-white transition-colors border border-neutral-800 font-mono text-xs">
                      {{ i + 1 }}
                    </div>
                    <p class="text-sm text-neutral-300 print:text-black font-light leading-relaxed pt-1.5">{{ imp }}</p>
                  </div>
                }
              </div>
            </div>

          </div>

          <div class="mt-16 text-center no-print pb-24">
            <button (click)="goBack()" class="text-neutral-500 hover:text-white transition-colors text-sm font-medium border-b border-transparent hover:border-white pb-0.5">
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ResultComponent implements OnInit {
  analyzer = inject(AnalyzerService);
  router = inject(Router);
  
  // Use a slightly larger radius for high-res screens
  // r=45% of 100% width.
  // We calculate circumference roughly for animation based on 100px reference
  circumference = 2 * Math.PI * 45; 
  isGeneratingPdf = signal(false);

  ngOnInit() {
    if (!this.analyzer.result()) {
      this.router.navigate(['/analyze']);
    }
  }

  strokeDashoffset(score: number): number {
    // We are using a dasharray based on percentage of the SVG viewBox space
    // If r=45, C = ~282.7
    const progress = score / 100;
    return this.circumference * (1 - progress);
  }

  getSkillLabel(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    return 'Fundamental';
  }

  downloadPDF() {
    this.isGeneratingPdf.set(true);
    
    // Simulate server-side generation (2s delay)
    setTimeout(() => {
      window.print();
      
      // Keep loading state briefly after print dialog opens so it feels like a process
      setTimeout(() => {
        this.isGeneratingPdf.set(false);
      }, 500);
    }, 1500);
  }

  goBack() {
    this.analyzer.reset();
    this.router.navigate(['/analyze']);
  }
}