import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface cartResp {
  cart?: {
    items?: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl = environment.apiUrl + '/carts';

  private cartCountSub = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSub.asObservable();

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }


  getCart(): Observable<any> {
    return this.http.get<cartResp>(`${this.cartUrl}/`, { headers: this.getAuthHeaders() }).pipe(
      tap(res => {
        const count = res?.cart?.items?.length || 0;
        this.cartCountSub.next(count);
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.cartUrl}/add`, { productId, quantity }, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.refreshcart())
    );
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/remove/${productId}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.refreshcart())
    );
  }


  clearCart(): Observable<any> {
    return this.http.delete(`${this.cartUrl}/clear`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.refreshcart())
    );
  }

  private refreshcart() {
    this.getCart().subscribe();
  }

}
