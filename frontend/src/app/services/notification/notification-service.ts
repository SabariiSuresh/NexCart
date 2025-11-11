import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private showToast(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info'
  ) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,

      background: 'rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      iconColor: this.getIconColor(icon),

      padding: '14px 20px',
      customClass: { popup: 'premium-toast' },

      showClass: { popup: 'premium-toast-in' },
      hideClass: { popup: 'premium-toast-out' }
    });
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
