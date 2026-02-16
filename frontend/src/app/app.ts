import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { LoaderService } from './services/loader/loader-service';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  loading = false;

  lottieOptions: AnimationOptions = {
    path: '/assets/Loading.json',
    autoplay: true,
    loop: true
  }

  constructor(private loaderService: LoaderService, private change: ChangeDetectorRef) {
    this.loaderService.isLoading.subscribe((res) => {
      this.loading = res;
      this.change.markForCheck();
    });
  }

}
