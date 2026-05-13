import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  deferredPrompt: any;
  isOnline: boolean = navigator.onLine;
  installPromptShown: boolean = false;

  constructor(
    private swUpdate: SwUpdate
  ) {
    this.initPwa();
    this.initNetworkListeners();
  }

  private initPwa() {
    // Check for service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_DETECTED') {
          console.log('Downloading new app version...');
          this.swUpdate.activateUpdate().then(() => {
            console.log('New app version ready');
            this.showUpdateSnackbar();
          });
        }

        if (event.type === 'VERSION_READY') {
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(`New app version ready for load: ${event.latestVersion.hash}`);
        }
      });

      // Check for updates every hour
      setInterval(() => {
        this.checkForUpdates();
      }, 60 * 60 * 1000);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
      this.installPromptShown = false;
      this.showInstalledSnackbar();
    });
  }

  private initNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('Network connection restored');
      this.isOnline = true;
      this.showOnlineSnackbar();
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost');
      this.isOnline = false;
      this.showOfflineSnackbar();
    });
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then(() => {
        console.log('Checked for updates');
      }).catch(err => {
        console.error('Error checking for updates:', err);
      });
    }
  }

  async activateUpdate() {
    if (this.swUpdate.isEnabled) {
      try {
        await this.swUpdate.activateUpdate();
        window.location.reload();
      } catch (error) {
        console.error('Error activating update:', error);
      }
    }
  }

  canInstallPwa(): boolean {
    return !!this.deferredPrompt && !this.installPromptShown;
  }

  async installPwa(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(`User response to install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        this.deferredPrompt = null;
        this.installPromptShown = true;
        return true;
      }

      this.deferredPrompt = null;
      return false;
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }

  private showUpdateSnackbar() {
    console.log('A new version is available!');
    // You could add a custom UI notification here
  }

  private showInstalledSnackbar() {
    console.log('App installed successfully!');
  }

  private showOnlineSnackbar() {
    console.log('You are back online');
  }

  private showOfflineSnackbar() {
    console.log('You are offline. Some features may be limited.');
  }

  requestNotificationPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission();
  }

  async showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/icon-96x96.png',
          ...options
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  async registerForPushNotifications(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          '' // Use empty string as default, or configure properly
        ) as any
      } as any);

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray as any; // Type assertion to fix compatibility issue
  }

  async shareContent(data: ShareData): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing content:', error);
        return false;
      }
    }
    return false;
  }

  addToHomeScreen(): boolean {
    return this.canInstallPwa();
  }
}
