import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { GlossaryTerm } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

interface GlossaryPage {
  title: string;
  terms: GlossaryTerm[];
}

@Component({
  selector: 'app-glossary',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './glossary.html',
  styleUrl: './glossary.scss',
})
export class Glossary {
  private readonly content = inject(ContentService);
  readonly page$ = this.content.getPage<GlossaryPage>('glossary');
}
