import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface wishListResp {
  wishList?: {
    items?: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistUrl = environment.apiUrl + '/wishlists';

  private wishlistCountSub = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSub.asObservable();

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
    return this.http.post(`${this.wishlistUrl}/add`, data, this.getAuthHeaders()).pipe(
      tap(() => this.refreshWishlist())
    );
  }


  getWishlist(): Observable<any> {
    return this.http.get<wishListResp>(`${this.wishlistUrl}`, this.getAuthHeaders()).pipe(
      tap(res => {
        const count = res?.wishList?.items?.length || 0;
        this.wishlistCountSub.next(count);
      })
    );
  }


  removeWishlist(productId: string): Observable<any> {
    return this.http.request('delete', `${this.wishlistUrl}/remove`, {
      body: { productId },
      ...this.getAuthHeaders()
    }).pipe(
      tap(() => this.refreshWishlist())
    );
  }

  private refreshWishlist() {
    this.getWishlist().subscribe();
  }

}
