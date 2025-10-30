import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private showToast(message: string, icon: 'success' | 'error' | 'warning' | 'info') {

    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#1f2937',
      color: '#fff',
      customClass: {
        popup: 'rounded-lg shadow-lg'
      }
    });
    
  }

  success(message: string) {
    this.showToast(message, 'success');
  }

  error(message: string) {
    this.showToast(message, 'error');
  }

  warning(message: string) {
    this.showToast(message, 'warning');
  }

  info(message: string) {
    this.showToast(message, 'info');
  }
}
