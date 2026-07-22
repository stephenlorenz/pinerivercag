import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../../core/services/content.service';
import { PhotoItem } from '../../../shared/models/content.model';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

interface PhotosPage {
  title: string;
  images: PhotoItem[];
}

@Component({
  selector: 'app-photos',
  imports: [PageHeader],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  private readonly content = inject(ContentService);
  readonly page = toSignal(this.content.getPage<PhotosPage>('photos'));

  // Only photos with an uploaded image are viewable in the lightbox — the
  // "pending upload" placeholders in the grid have nothing to zoom into.
  readonly viewablePhotos = computed(() => (this.page()?.images ?? []).filter((p) => p.image));

  readonly activeIndex = signal<number | null>(null);

  readonly active = computed(() => {
    const i = this.activeIndex();
    return i === null ? null : this.viewablePhotos()[i];
  });

  open(photo: PhotoItem) {
    if (!photo.image) return;
    const idx = this.viewablePhotos().indexOf(photo);
    if (idx >= 0) {
      this.activeIndex.set(idx);
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    this.activeIndex.set(null);
    document.body.style.overflow = '';
  }

  next() {
    const total = this.viewablePhotos().length;
    this.activeIndex.update((i) => (i === null ? null : (i + 1) % total));
  }

  prev() {
    const total = this.viewablePhotos().length;
    this.activeIndex.update((i) => (i === null ? null : (i - 1 + total) % total));
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.activeIndex() === null) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }
}
