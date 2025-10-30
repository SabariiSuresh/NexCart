import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileUrl = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) { }


  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }


  getMyProfile(): Observable<any> {
    return this.http.get(`${this.profileUrl}/me`, { headers :  this.getAuthHeaders()});
  }


  updateMyProfile(data: any): Observable<any> {
    return this.http.put(`${this.profileUrl}/me`, data, { headers :  this.getAuthHeaders()});
  }


  getAllusers(): Observable<any> {
    return this.http.get(`${this.profileUrl}`, { headers :  this.getAuthHeaders()});
  }


  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.profileUrl}/${id}`, { headers :  this.getAuthHeaders()});
  }


  updateUser(data: any, id: string): Observable<any> {
    return this.http.put(`${this.profileUrl}/${id}`, data, { headers :  this.getAuthHeaders()});
  }


  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.profileUrl}/${id}`, { headers :  this.getAuthHeaders()});
  }


}
