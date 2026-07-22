import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { GlossaryTerm } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

interface GlossaryPage {
  title: string;
  terms: GlossaryTerm[];
}

@Component({
  selector: 'app-glossary',
  imports: [FormsModule, PageHeader],
  templateUrl: './glossary.html',
  styleUrl: './glossary.scss',
})
export class Glossary {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  readonly page = toSignal(this.content.getPage<GlossaryPage>('glossary'));

  // Site search links to a specific term via ?q=<term>, so the filter
  // starts pre-filled instead of landing on the unfiltered full list.
  readonly query = signal(this.route.snapshot.queryParamMap.get('q') ?? '');

  readonly filteredTerms = computed(() => {
    const terms = this.page()?.terms ?? [];
    const q = this.query().trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
    );
  });
}
