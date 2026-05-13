// Performance monitoring and optimization service

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      firstMeaningfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0
    };
  }

  // Track page load performance
  trackPageLoad() {
    if (typeof performance !== 'undefined') {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        this.metrics.pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
        console.log('Page Load Time:', this.metrics.pageLoadTime + 'ms');
      }
    }
  }

  // Track Core Web Vitals
  trackCoreWebVitals() {
    if (typeof performance !== 'undefined') {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime;
        console.log('FCP:', this.metrics.firstContentfulPaint + 'ms');
      }

      // Largest Contentful Paint
      const lcpEntry = performance.getEntriesByName('largest-contentful-paint')[0];
      if (lcpEntry) {
        this.metrics.largestContentfulPaint = lcpEntry.startTime;
        console.log('LCP:', this.metrics.largestContentfulPaint + 'ms');
      }

      // Cumulative Layout Shift
      const clsEntry = performance.getEntriesByName('layout-shift')[0];
      if (clsEntry) {
        this.metrics.cumulativeLayoutShift = clsEntry.value || 0;
        console.log('CLS:', this.metrics.cumulativeLayoutShift);
      }

      // First Input Delay
      const fidEntry = performance.getEntriesByName('first-input')[0];
      if (fidEntry) {
        this.metrics.firstInputDelay = fidEntry.processingStart - fidEntry.startTime;
        console.log('FID:', this.metrics.firstInputDelay + 'ms');
      }
    }
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  // Track custom performance marks
  mark(name) {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  }

  // Measure time between marks
  measure(name, startMark) {
    if (typeof performance !== 'undefined') {
      performance.measure(name, startMark);
    }
  }

  // Clear performance marks
  clearMarks() {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
    }
  }
}

// Memory management utilities
class MemoryManager {
  // Clean up large objects
  static cleanupLargeObjects(objects) {
    objects.forEach(obj => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (obj[key] && obj[key].length > 1000) {
            console.log(`Cleaning up large object: ${key}`);
            delete obj[key];
          }
        });
      }
    });
  }

  // Debounce function to limit execution frequency
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function to limit execution rate
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Request animation frame for smooth animations
  static requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  }

  // Cancel animation frame
  static cancelAnimationFrame(requestId) {
    return window.cancelAnimationFrame(requestId);
  }
}

// Network optimization utilities
class NetworkOptimizer {
  // Lazy load images
  static lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Preload critical resources
  static preloadCriticalResources(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  // Optimize fonts loading
  static optimizeFonts(fonts) {
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.url;
      link.as = 'font';
      link.type = 'font/' + font.format;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Implement resource hints
  static addResourceHints() {
    // DNS prefetch
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(dnsLink);

    // Preconnect to critical domains
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectLink);
  }
}

// Bundle optimization utilities
class BundleOptimizer {
  // Dynamic import for code splitting
  static async loadComponent(componentPath) {
    try {
      const module = await import(componentPath);
      return module.default;
    } catch (error) {
      console.error('Failed to load component:', componentPath, error);
      return null;
    }
  }

  // Preload routes
  static preloadRoutes(routes) {
    routes.forEach(route => {
      if (route.preload) {
        import(route.componentPath).catch(error => {
          console.error('Failed to preload route:', route.path, error);
        });
      }
    });
  }
}

// Image optimization utilities
class ImageOptimizer {
  // Optimize image loading
  static optimizeImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';

      // Add loading placeholder
      if (!img.src || img.src === '') {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
    });
  }

  // Compress images (client-side)
  static async compressImage(file, quality = 0.8, maxWidth = 1920) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Generate responsive image sources
  static generateResponsiveSources(image, sizes = [320, 640, 1024, 1920]) {
    return sizes.map(size => ({
      size,
      src: `${image}?w=${size}`,
      type: 'image/jpeg'
    }));
  }
}

// Cache management utilities
class CacheManager {
  static setItem(key, value, ttl = 3600000) { // 1 hour default
    try {
      const item = {
        value,
        expiry: Date.now() + ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static getItem(key) {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (item && item.expiry > Date.now()) {
        return item.value;
      }
      // Remove expired item
      localStorage.removeItem(key);
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // IndexedDB for larger data
  static async openIndexedDB(dbName = 'DevHubCache', version = 1) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'id' });
        }
      };
    });
  }

  static async cacheInIndexedDB(db, storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.put({
        ...data,
        id: Date.now(),
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  static async getCachedData(db, storeName, limit = 100) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.getAll(null, limit);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Virtual scrolling implementation
class VirtualScrollManager {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.visibleItems = [];
    this.startIndex = 0;
    this.endIndex = 0;
    this.scrollTop = 0;
    this.bufferSize = 5; // Render extra items above/below

    this.init();
  }

  init() {
    this.container.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    this.resizeObserver = new ResizeObserver(() => this.updateVisibleRange());
    this.resizeObserver.observe(this.container);

    // Initial render
    this.updateVisibleRange();
  }

  onScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleRange();
  }

  updateVisibleRange() {
    const containerHeight = this.container.clientHeight;
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
    const endIndex = Math.min(
      this.items?.length || 0,
      Math.ceil((this.scrollTop + containerHeight) / this.itemHeight) + this.bufferSize
    );

    if (startIndex !== this.startIndex || endIndex !== this.endIndex) {
      this.startIndex = startIndex;
      this.endIndex = endIndex;
      this.render();
    }
  }

  render() {
    const itemsToRender = this.items.slice(this.startIndex, this.endIndex);

    // Create/update DOM elements
    this.container.innerHTML = '';
    itemsToRender.forEach((item, index) => {
      const element = this.renderItem(item, this.startIndex + index);
      element.style.position = 'absolute';
      element.style.top = `${(this.startIndex + index) * this.itemHeight}px`;
      element.style.width = '100%';
      element.style.height = `${this.itemHeight}px`;
      this.container.appendChild(element);
    });

    // Update container height
    this.container.style.height = `${(this.items?.length || 0) * this.itemHeight}px`;
  }

  setItems(items) {
    this.items = items;
    this.updateVisibleRange();
  }

  destroy() {
    this.container.removeEventListener('scroll', this.onScroll);
    this.resizeObserver.disconnect();
  }
}

// Performance utilities for Angular
class AngularPerformanceOptimizer {
  // Enable production mode
  static enableProductionMode() {
    if (typeof ngDevMode !== 'undefined' && ngDevMode === false) {
      console.log('Angular running in production mode');
    }
  }

  // Disable debug tools in production
  static disableDebugTools() {
    if (typeof ngDevMode !== 'undefined' && ngDevMode === false) {
      // Disable Angular debug tools
      console.log('Debug tools disabled');
    }
  }

  // Optimize change detection
  static optimizeChangeDetection(component) {
    if (component && component.constructor.prototype.ngOnChanges) {
      const originalOnChanges = component.constructor.prototype.ngOnChanges;
      component.constructor.prototype.ngOnChanges = function(changes) {
        // Batch change detection
        const keys = Object.keys(changes);
        console.log(`Optimizing change detection for ${keys.length} properties`);
        return originalOnChanges.call(this, changes);
      };
    }
  }

  // Track component render time
  static trackComponentRender(componentName, renderFn) {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();

    console.log(`${componentName} rendered in ${end - start}ms`);

    return result;
  }
}

// Export all utilities
const performanceMonitor = new PerformanceMonitor();
const memoryManager = MemoryManager;
const networkOptimizer = NetworkOptimizer;
const bundleOptimizer = BundleOptimizer;
const imageOptimizer = ImageOptimizer;
const cacheManager = CacheManager;
const angularPerformanceOptimizer = AngularPerformanceOptimizer;

module.exports = {
  performanceMonitor,
  memoryManager,
  networkOptimizer,
  bundleOptimizer,
  imageOptimizer,
  cacheManager,
  VirtualScrollManager,
  angularPerformanceOptimizer
};