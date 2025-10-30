import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile/profile-service';
import { NotificationService } from '../../services/notification/notification-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../services/auth/auth-service';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profileForm!: FormGroup;
  user: any;
  isEditing = false;

  constructor(private form: FormBuilder, private profileService: ProfileService, private auth : AuthService , private notify: NotificationService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    this.profileForm = this.form.group({
      name: ['', Validators.required],
      email: [''],
      phoneNumber: [''],
      alternateNumber: [''],

      address: this.form.group({
        fullName: [''],
        address: [''],
        city: [''],
        state: [''],
        country: [''],
        postalCode: ['']
      })

    });
  }


  ngOnInit(): void {

    this.loadProfile();

  }


  loadProfile() {

    this.profileService.getMyProfile().subscribe({

      next: (res) => {
        this.user = res.user;
        this.profileForm.patchValue(this.user);
      },
      error: (err) => {
        this.notify.error('failed to load Profile');
        console.error(err);
      }
    });

  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateProfile() {

    if (this.profileForm.invalid) return;

    this.profileService.updateMyProfile(this.profileForm.getRawValue()).subscribe({

      next: (res) => {
        this.user = res.user;
        this.notify.success('Profile updated');
        this.isEditing = false
        this.ref.close();
      },
      error: (err) => {
        this.notify.error('failed to update Profile');
        console.error(err);
        this.ref.close(false);
      }
    })
  }

  close() {
    this.ref.close();
  }

  logged(){
    this.auth.getRole();
  }

}
