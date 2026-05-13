import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: false
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad: string = ''; // URL to load when element comes into view
  @Input() placeholder: string = ''; // Placeholder while loading
  @Input() rootMargin: string = '50px'; // Margin for intersection observer
  @Input() threshold: number = 0.01; // Threshold for intersection

  private observer: IntersectionObserver | null = null;
  private hasLoaded = false;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    // Set initial placeholder
    if (this.placeholder) {
      this.element.nativeElement.src = this.placeholder;
    }

    // Create intersection observer
    this.createIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private createIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.hasLoaded && this.appLazyLoad) {
              this.loadImage();
            }
          });
        },
        {
          rootMargin: this.rootMargin,
          threshold: this.threshold
        }
      );

      this.observer.observe(this.element.nativeElement);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage();
    }
  }

  private loadImage(): void {
    if (this.hasLoaded || !this.appLazyLoad) {
      return;
    }

    const img = this.element.nativeElement as HTMLImageElement;

    // Preload image
    const tempImg = new Image();
    tempImg.src = this.appLazyLoad;

    tempImg.onload = () => {
      img.src = this.appLazyLoad;
      img.onload = () => {
        // Add fade-in effect
        img.style.opacity = '0';
        requestAnimationFrame(() => {
          img.style.transition = 'opacity 0.3s ease-in';
          img.style.opacity = '1';
        });
      };
      this.hasLoaded = true;
    };

    tempImg.onerror = () => {
      console.error('Failed to load image:', this.appLazyLoad);
      // Set error state
      img.classList.add('lazy-error');
    };
  }
}
