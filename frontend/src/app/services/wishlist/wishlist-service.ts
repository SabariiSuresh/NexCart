import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistUrl = 'http://localhost:3000/wishlists';

  constructor(private http: HttpClient) { }


  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      return {};
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }


  addWishlist(data: any): Observable<any> {
    return this.http.post(`${this.wishlistUrl}/add`, data, this.getAuthHeaders());
  }


  getWishlist(): Observable<any> {
    return this.http.get(`${this.wishlistUrl}`, this.getAuthHeaders());
  }


  removeWishlist(productId: string): Observable<any> {
    return this.http.request('delete', `${this.wishlistUrl}/remove`, {
      body: { productId },
      ...this.getAuthHeaders()
    });
  }



}
