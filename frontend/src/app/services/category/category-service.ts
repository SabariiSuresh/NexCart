import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryUrl = 'http://localhost:3000/categories';

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

  getPublicCategories(): Observable<any> {
    return this.http.get(`${this.categoryUrl}/public`, this.getAuthHeaders());
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.categoryUrl}/nested`, this.getAuthHeaders());
  }

  getCategoriesById(id: string): Observable<any> {
    return this.http.get(`${this.categoryUrl}/${id}`, this.getAuthHeaders());
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.categoryUrl}`, data, this.getAuthHeaders())
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.categoryUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.categoryUrl}/${id}`, this.getAuthHeaders());
  }

}
