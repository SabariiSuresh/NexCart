import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }


  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }

  getAllProducts(params?: any): Observable<any> {
    return this.http.get(`${this.productUrl}`, { params, headers: this.getAuthHeaders() });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<{ product: any, recomended: any }>(`${this.productUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getProductByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.productUrl}/category/${categoryId}`, { headers: this.getAuthHeaders() });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.productUrl}`, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.productUrl}/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.productUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  searchProduct(query: string, page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.productUrl}/search`, {
      params: { q: query, page, limit },
      headers: this.getAuthHeaders()
    });
  }


  quickSearch(query: string) {
    const q = encodeURIComponent(query || '');
    return this.http.get<{ products: any[] }>(`${this.productUrl}/quick-search/?q=${q}`);
  }

  getSections(limit = 8): Observable<any> {
    return this.http.get(`${this.productUrl}/selections?limit=${limit}`);
  }


  getRecommended(limit = 8): Observable<any> {
    return this.http.get(`${this.productUrl}/selections?limit=${limit}`, { headers: this.getAuthHeaders() });
  }

}
