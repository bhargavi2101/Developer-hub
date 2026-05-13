import { Directive, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appVirtualScroll]',
  standalone: false
})
export class VirtualScrollDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() itemHeight: number = 50;
  @Input() bufferSize: number = 5;
  @Output() renderStart = new EventEmitter<{start: number, end: number}>();
  @Output() renderEnd = new EventEmitter<{start: number, end: number}>();

  @ViewChild('container') container!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  private scrollTop = 0;
  private viewHeight = 0;
  private startIndex = 0;
  private endIndex = 0;

  get visibleItems() {
    return Math.ceil(this.viewHeight / this.itemHeight);
  }

  ngOnInit(): void {
    // Initial calculation
    this.viewHeight = window.innerHeight;
    this.updateVisibleRange();
  }

  ngAfterViewInit(): void {
    // Add scroll listener
    this.container.nativeElement.addEventListener('scroll', this.onScroll, { passive: true });

    // Add resize listener
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    // Clean up listeners
    this.container.nativeElement.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  private onScroll = (): void => {
    this.scrollTop = this.container.nativeElement.scrollTop;
    this.updateVisibleRange();
  }

  private onResize = (): void => {
    this.viewHeight = this.container.nativeElement.clientHeight;
    this.updateVisibleRange();
  }

  private updateVisibleRange(): void {
    const newStartIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
    const newEndIndex = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.viewHeight) / this.itemHeight) + this.bufferSize
    );

    if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
      this.startIndex = newStartIndex;
      this.endIndex = newEndIndex;
      this.render();
    }
  }

  private render(): void {
    this.renderStart.emit({ start: this.startIndex, end: this.endIndex });

    const visibleItems = this.items.slice(this.startIndex, this.endIndex);

    // Calculate container height
    const totalHeight = this.items.length * this.itemHeight;

    // Set container height
    this.container.nativeElement.style.height = `${totalHeight}px`;

    // Set content position
    this.content.nativeElement.style.transform = `translateY(${this.startIndex * this.itemHeight}px)`;

    // Render items
    this.renderItems(visibleItems);

    this.renderEnd.emit({ start: this.startIndex, end: this.endIndex });
  }

  private renderItems(items: any[]): void {
    // This would be implemented by the parent component
    // For now, we'll emit the visible items
    // The parent component is responsible for actual rendering
  }

  scrollToIndex(index: number): void {
    const targetScrollTop = index * this.itemHeight;
    this.container.nativeElement.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }

  scrollToEnd(): void {
    const targetScrollTop = (this.items.length - 1) * this.itemHeight;
    this.container.nativeElement.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }
}
