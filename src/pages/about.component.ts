import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen px-4 md:px-8 py-12 bg-neutral-950">
      <div class="max-w-3xl mx-auto animate-fade-in">
        
        <h1 class="text-4xl font-bold text-white mb-2">About The Project</h1>
        <p class="text-neutral-400 text-lg mb-12">Academic implementation of AI-driven text analysis.</p>

        <!-- Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Project Objective</h2>
          <p class="text-neutral-300 leading-relaxed mb-4">
            Resume Review helps a resume owner inspect document content and plan edits. It converts a PDF or image into model-generated feedback. It does not make hiring decisions, measure actual skill proficiency or demonstrate reduced bias.
          </p>
        </div>

        <!-- Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">System Workflow</h2>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h3 class="text-white font-semibold mb-1">Input Processing</h3>
                <p class="text-neutral-400 text-sm">User uploads a resume in PDF or Image format. The client-side logic converts this binary data into a Base64 stream suitable for API transmission.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h3 class="text-white font-semibold mb-1">Document review (Gemini)</h3>
                <p class="text-neutral-400 text-sm">A server-side route sends the document to Gemini and validates the returned JSON. The API key stays on the server. Scores and role matches are subjective estimates.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h3 class="text-white font-semibold mb-1">Structured Output</h3>
                <p class="text-neutral-400 text-sm">The raw JSON response is parsed and rendered into a visual dashboard. A print-friendly stylesheet allows the browser's native print engine to generate a high-quality PDF report.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech Stack -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Technology Stack</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <div class="text-xs text-neutral-500 uppercase">Framework</div>
              <div class="text-white font-semibold">Angular 21</div>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <div class="text-xs text-neutral-500 uppercase">AI Model</div>
              <div class="text-white font-semibold">Gemini 2.5 Flash</div>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <div class="text-xs text-neutral-500 uppercase">Styling</div>
              <div class="text-white font-semibold">Tailwind CSS</div>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <div class="text-xs text-neutral-500 uppercase">State</div>
              <div class="text-white font-semibold">Signals</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent {}