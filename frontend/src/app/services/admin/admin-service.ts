import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any>{

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization : `Bearer ${token}`
    });

    return this.http.get(`${this.adminUrl}/` , {headers})
  }

}
