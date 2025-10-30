import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:3000/auth';

  private authDialogeState = new BehaviorSubject<boolean>(false);
  authDialog$ = this.authDialogeState.asObservable();

  private usernameSub = new BehaviorSubject<string>('');
  userName$ = this.usernameSub.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.isLoggedIn()) {
      this.updateUserName()
    }
  }

  login(userData: any) {
    return this.http.post(`${this.authUrl}/login`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token);
          this.updateUserName();
        }
      })
    );
  }


  register(userData: any) {
    return this.http.post(`${this.authUrl}/register`, userData);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getUserId(): string | null {

    const token = localStorage.getItem('token');

    if (!token || token.split('.').length !== 3) {
      return null;
    }

    try {

      const decode: any = jwtDecode(token);

      return decode.userId;

    } catch (err) {

      console.error('Invalid token', err);

      return null;

    }
  }


  getRole() {

    const token = localStorage.getItem('token');

    if (!token) return '';

    try {

      const decode: any = jwtDecode(token);

      return decode.role || '';

    } catch (err) {
      console.error('Invalid token role', err);
      return '';
    }
  }


  getUserName() {

    const token = localStorage.getItem('token');

    if (!token) return '';

    try {

      const decode: any = jwtDecode(token);
      return decode.name ||'';


    } catch (err) {
      console.error('Invalid token role', err);
      return '';
    }
  }

  updateUserName() {
    this.usernameSub.next(this.getUserName());
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
    this.updateUserName();
    window.location.reload();
  }


  openAuthDialoge() {
    this.authDialogeState.next(true);
  }

  closeAuthDialoge() {
    this.authDialogeState.next(false);
  }

}
