import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = 'http://localhost:3000/payments';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getMyPayments(): Observable<any> {
    return this.http.get(`${this.paymentUrl}/my`, this.getAuthHeaders());
  }

  getAllPayments(): Observable<any> {
    return this.http.get(`${this.paymentUrl}`, this.getAuthHeaders());
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.paymentUrl}`, payment, this.getAuthHeaders());
  }

  updatePaymentStatus(id: string, status: any): Observable<any> {
    return this.http.put(`${this.paymentUrl}/${id}/status`, { status }, this.getAuthHeaders());
  }

  deletePayment(id: string): Observable<any> {
    return this.http.delete(`${this.paymentUrl}/${id}`, this.getAuthHeaders());
  }

}
