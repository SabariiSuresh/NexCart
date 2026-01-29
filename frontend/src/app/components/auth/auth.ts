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
  styleUrl: './auth.css',
})
export class Auth implements OnInit {

  isLogin = true;
  showDialog = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  googleDisabled = false;

  constructor(private authService: AuthService, private messageService: MessageService, private form: FormBuilder, private router: Router, private notify: NotificationService) { }

  ngOnInit(): void {

    this.loginForm = this.form.group({

      email: new FormControl('sabari@gmail.com', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,}')]),
      password: new FormControl('12345', [Validators.required])

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

    if (this.loginForm.invalid) return;

    this.showDialog = false;

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
          this.router.navigateByUrl(lastRoute || '/home');
          sessionStorage.removeItem('redirectAfterLogin');
        }

      }, error: (err) => {

        setTimeout(() => {
          this.showDialog = true;
        });

        this.notify.error(err.error?.message || 'Login Failed');
        this.loginForm.reset();
        console.error('Login error', err);

      }
    })
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

  googleLogin() {

    if (this.googleDisabled) return;

    this.googleDisabled = true;
    this.notify.info('Google sign-in is under development. Stay tuned!');

    setTimeout(() => this.googleDisabled = false, 2000);

  }

}
