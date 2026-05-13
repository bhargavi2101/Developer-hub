import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private announcements: string[] = [];
  private announcementDelay = 1000;

  constructor() {
    this.initAccessibility();
  }

  private initAccessibility() {
    // Skip to main content functionality
    this.setupSkipLinks();

    // Focus management
    this.setupFocusTraps();

    // Announce page changes
    this.setupPageAnnouncements();

    // Manage focus after navigation
    this.manageFocusAfterNavigation();
  }

  private setupSkipLinks() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '1');

    // Skip link styles
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--accent-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
      }

      .skip-link:focus {
        top: 0;
      }
    `;

    document.head.appendChild(style);
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  private setupFocusTraps() {
    // Focus trap for modals and dialogs
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
          this.trapFocus(event, modal);
        }
      }

      // Close modals with Escape key
      if (event.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
          const closeButton = modal.querySelector('.modal-close') as HTMLElement;
          closeButton?.click();
        }
      }

      // Handle focus in menus
      if (event.key === 'Escape') {
        const openMenu = document.querySelector('[aria-expanded="true"]');
        if (openMenu) {
          openMenu.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  private trapFocus(event: KeyboardEvent, container: Element) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private setupPageAnnouncements() {
    // Announce page changes to screen readers
    window.addEventListener('hashchange', () => {
      this.announcePageChange();
    });

    // Announce AJAX content updates
    this.setupAjaxAnnouncements();
  }

  private setupAjaxAnnouncements() {
    // Monitor dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector('[data-announce]')) {
                const announcement = element.querySelector('[data-announce]');
                if (announcement) {
                  this.announce(announcement.textContent || '');
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private manageFocusAfterNavigation() {
    // Manage focus when routes change
    const mainContent = document.querySelector('#main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
    }
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, this.announcementDelay);
  }

  announcePageChange() {
    const title = document.querySelector('h1')?.textContent || document.title;
    this.announce(`Navigated to ${title}`);
  }

  setFocus(element: ElementRef | HTMLElement) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.focus();
  }

  setFocusWithDelay(element: ElementRef | HTMLElement, delay: number = 100) {
    setTimeout(() => {
      this.setFocus(element);
    }, delay);
  }

  addAriaLabel(element: ElementRef | HTMLElement, label: string) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-label', label);
  }

  addAriaDescribedBy(element: ElementRef | HTMLElement, describedBy: string) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-describedby', describedBy);
  }

  addAriaExpanded(element: ElementRef | HTMLElement, expanded: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-expanded', String(expanded));
  }

  addAriaHidden(element: ElementRef | HTMLElement, hidden: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-hidden', String(hidden));
  }

  addAriaInvalid(element: ElementRef | HTMLElement, invalid: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-invalid', String(invalid));

    if (invalid) {
      htmlElement.setAttribute('aria-describedby', `${htmlElement.id}-error`);
    }
  }

  addRole(element: ElementRef | HTMLElement, role: string) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('role', role);
  }

  addAriaLiveRegion(element: ElementRef | HTMLElement, level: 'polite' | 'assertive' = 'polite') {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-live', level);
  }

  addAriaAtomic(element: ElementRef | HTMLElement, atomic: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-atomic', String(atomic));
  }

  addAriaControls(element: ElementRef | HTMLElement, controls: string) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-controls', controls);
  }

  addAriaHasPopup(element: ElementRef | HTMLElement, hasPopup: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-haspopup', String(hasPopup));
  }

  addAriaPressed(element: ElementRef | HTMLElement, pressed: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-pressed', String(pressed));
  }

  addAriaSelected(element: ElementRef | HTMLElement, selected: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-selected', String(selected));
  }

  addAriaChecked(element: ElementRef | HTMLElement, checked: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-checked', String(checked));
  }

  addAriaDisabled(element: ElementRef | HTMLElement, disabled: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-disabled', String(disabled));
  }

  addAriaRequired(element: ElementRef | HTMLElement, required: boolean) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-required', String(required));
  }

  addAriaOrientation(element: ElementRef | HTMLElement, orientation: 'horizontal' | 'vertical') {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-orientation', orientation);
  }

  addAriaValuenow(element: ElementRef | HTMLElement, value: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-valuenow', String(value));
  }

  addAriaValuemin(element: ElementRef | HTMLElement, min: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-valuemin', String(min));
  }

  addAriaValuemax(element: ElementRef | HTMLElement, max: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-valuemax', String(max));
  }

  addAriaLevel(element: ElementRef | HTMLElement, level: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-level', String(level));
  }

  addAriaSetsize(element: ElementRef | HTMLElement, size: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-setsize', String(size));
  }

  addAriaPosinset(element: ElementRef | HTMLElement, position: number) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    htmlElement.setAttribute('aria-posinset', String(position));
  }

  // Keyboard navigation helpers
  handleKeyboardNavigation(
    event: KeyboardEvent,
    actions: {
      enter?: () => void;
      space?: () => void;
      escape?: () => void;
      arrowUp?: () => void;
      arrowDown?: () => void;
      arrowLeft?: () => void;
      arrowRight?: () => void;
      home?: () => void;
      end?: () => void;
      tab?: () => void;
    }
  ) {
    switch (event.key) {
      case 'Enter':
        if (actions.enter) {
          event.preventDefault();
          actions.enter();
        }
        break;
      case ' ':
        if (actions.space) {
          event.preventDefault();
          actions.space();
        }
        break;
      case 'Escape':
        if (actions.escape) {
          event.preventDefault();
          actions.escape();
        }
        break;
      case 'ArrowUp':
        if (actions.arrowUp) {
          event.preventDefault();
          actions.arrowUp();
        }
        break;
      case 'ArrowDown':
        if (actions.arrowDown) {
          event.preventDefault();
          actions.arrowDown();
        }
        break;
      case 'ArrowLeft':
        if (actions.arrowLeft) {
          event.preventDefault();
          actions.arrowLeft();
        }
        break;
      case 'ArrowRight':
        if (actions.arrowRight) {
          event.preventDefault();
          actions.arrowRight();
        }
        break;
      case 'Home':
        if (actions.home) {
          event.preventDefault();
          actions.home();
        }
        break;
      case 'End':
        if (actions.end) {
          event.preventDefault();
          actions.end();
        }
        break;
    }
  }

  // Screen reader only content
  addScreenReaderOnlyText(element: ElementRef | HTMLElement, text: string) {
    const htmlElement = element instanceof ElementRef ? element.nativeElement : element;
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = text;
    htmlElement.appendChild(srText);
  }
}
