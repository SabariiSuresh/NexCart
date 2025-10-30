import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl = 'http://localhost:3000/orders';

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

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.orderUrl}`, order, this.getAuthHeaders());
  }

  getMyOrder(): Observable<any> {
    return this.http.get(`${this.orderUrl}/my`, this.getAuthHeaders());
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.orderUrl}/${id}`, this.getAuthHeaders());
  }

  cancellOrder(id: string): Observable<any> {
    return this.http.post(`${this.orderUrl}/${id}/cancel`, {}, this.getAuthHeaders());
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.orderUrl}/${id}/delete`, this.getAuthHeaders());
  }


  getAllOrder(): Observable<any> {
    return this.http.get(`${this.orderUrl}`, this.getAuthHeaders());
  }

  updateStatus(id: string, status: any): Observable<any> {
    return this.http.put(`${this.orderUrl}/${id}/status`, { status }, this.getAuthHeaders());
  }

  updateOrderDeliverd(id: string, status: any): Observable<any> {
    return this.http.put(`${this.orderUrl}/${id}/deliver`, { status }, this.getAuthHeaders());
  }


  getLastAddress(): Observable<any> {
    return this.http.get(`${this.orderUrl}/last-address`, this.getAuthHeaders());
  }


}
