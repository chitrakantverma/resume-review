import { Injectable, signal } from '@angular/core';

export interface Skill {
  name: string;
  level: number; // 0-100 score for visualization
}

export interface JobRole {
  role: string;
  match: number; // 0-100 match percentage
}

export interface AnalysisResult {
  resume_score: number;
  technical_skills: Skill[];
  soft_skills: Skill[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  suitable_job_roles: JobRole[];
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyzerService {
  private resultSignal = signal<AnalysisResult | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly result = this.resultSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async analyzeResume(fileBase64: string, mimeType: string) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.resultSignal.set(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: fileBase64, mimeType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed. Please try again.');
      // Sort skills by level desc for better visualization
      data.technical_skills = data.technical_skills.sort((a, b) => b.level - a.level).slice(0, 8);
      data.soft_skills = data.soft_skills.sort((a, b) => b.level - a.level).slice(0, 6);
      data.suitable_job_roles = data.suitable_job_roles.sort((a, b) => b.match - a.match).slice(0, 3);
      
      this.resultSignal.set(data);

    } catch (e: any) {
      console.error('Analysis failed', e);
      this.errorSignal.set(e.message || 'Failed to analyze resume. Please try again.');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  loadSample() {
    this.reset();
    this.resultSignal.set({
      resume_score: 65, technical_skills: [{name: 'Python (fictional example)', level: 60}], soft_skills: [],
      strengths: ['Example: the fictional resume includes a small data project.'],
      weaknesses: ['Example: the project description omits its evaluation method.'],
      improvements: ['Describe the actual dataset, your role, and the metric you measured.'],
      suitable_job_roles: [{role: 'Data intern (illustrative)', match: 60}],
      summary: 'FICTIONAL SAMPLE REPORT. No resume was uploaded or analyzed. Numbers demonstrate the interface and are not validated ATS or hiring scores.',
    });
  }

  reset() {
    this.resultSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }
}