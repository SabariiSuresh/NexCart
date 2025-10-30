import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any>{

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization : `Bearer ${token}`
    });

    return this.http.get(`${this.adminUrl}/` , {headers})
  }

}
