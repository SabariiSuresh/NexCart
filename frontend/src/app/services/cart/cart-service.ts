import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = 'http://localhost:3000/carts';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }


  getCart(): Observable<any> {
    return this.http.get(`${this.cartUrl}/`, { headers: this.getAuthHeaders() });
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.cartUrl}/add`, { productId, quantity }, { headers: this.getAuthHeaders() });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/remove/${productId}`, {headers : this.getAuthHeaders()});
  }

  
  clearCart(): Observable<any> {
    return this.http.delete(`${this.cartUrl}/clear`, { headers: this.getAuthHeaders() });
  }

}
