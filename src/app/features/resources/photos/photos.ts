import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { PhotoItem } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

interface PhotosPage {
  title: string;
  images: PhotoItem[];
}

@Component({
  selector: 'app-photos',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  private readonly content = inject(ContentService);
  readonly page$ = this.content.getPage<PhotosPage>('photos');
}
