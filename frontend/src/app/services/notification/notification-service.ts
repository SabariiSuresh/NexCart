import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private isMobile(): boolean {
    return window.innerWidth <= 640;
  }

  private showToast(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info'
  ) {

    const mobile = this.isMobile();

    Swal.fire({
      toast: true,
      position: mobile ? 'bottom' : 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      background: mobile ? 'rgba(12,12,12,0.65)' : 'rgba(255, 255, 255, 0.15)',
      color: '#fff',
      iconColor: this.getIconColor(icon),

      width: mobile ? '90%' : 'auto',
      padding: mobile ? '18px 22px' : '14px 20px',

      customClass: { popup: mobile ? 'mobile-toast' : 'premium-toast' },

      showClass: {
        popup: mobile ? 'toast-slide-up' : 'premium-toast-in'
      },
      hideClass: {
        popup: mobile ? 'toast-slide-down' : 'premium-toast-out'
      }
    });

    if (mobile && navigator.vibrate) {
      navigator.vibrate(40);
    }
  }

  private getIconColor(type: string): string {
    switch (type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'warning': return '#eab308';
      case 'info': return '#3b82f6';
      default: return '#fff';
    }
  }

  success(message: string) { this.showToast(message, 'success'); }
  error(message: string) { this.showToast(message, 'error'); }
  warning(message: string) { this.showToast(message, 'warning'); }
  info(message: string) { this.showToast(message, 'info'); }

}
