import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnInit {

  isLogin = true;
  showDialog = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;


  constructor(private authService: AuthService, private messageService: MessageService, private form: FormBuilder, private router: Router , private notify : NotificationService) { }

  ngOnInit(): void {

    this.loginForm = this.form.group({

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])

    });

    this.registerForm = this.form.group({

      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,}')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])

    });

    this.authService.authDialog$.subscribe(show => {
      this.showDialog = show;
    });

  }

  toggleMode() {

    this.isLogin = !this.isLogin;

  }


  onLogin() {

    if (this.loginForm.valid) {

      this.authService.login(this.loginForm.value).subscribe({

        next: (res: any) => {
          this.authService.setToken(res.token);

          this.notify.success('Login successfull');
          this.showDialog = false;
          const role = this.authService.getRole();

          if (role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {

            const lastRoute = sessionStorage.getItem('redirectAfterLogin');

            if (lastRoute) {

              this.router.navigateByUrl(lastRoute);
              sessionStorage.removeItem('redirectAfterLogin');
            } 
            else {

              this.router.navigate(['/home']);
            }

          }

        }, error: err => {

          this.notify.error('Login Failed');
          this.loginForm.reset();
          console.error('Login error', err);

        }
      })
    }
  }



  onRegister() {

    if (this.registerForm.valid) {

      this.authService.register(this.registerForm.value).subscribe({

        next: () => {
          this.notify.success('Registered successfully');
          this.toggleMode();
        }, error: err => {

          this.notify.error(err.error?.message || 'failed to register');
          this.registerForm.reset();
          console.error('register error', err);

        }
      })
    }
  }


}
