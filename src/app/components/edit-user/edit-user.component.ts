import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userProfile!: SignupData;
  editUserForm!: FormGroup;
  submitted = false;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.showUserData();
    this.initFormGroup();
  }


  async showUserData() {
    try {
      const userProfile = await this.authService.getLoggedUserData();
      this.userProfile = userProfile;
      this.editUserForm.patchValue({
        email: userProfile.email,
        username: userProfile.username,
        phone: userProfile.phone,
        adress: userProfile.adress,
      })
    } catch (err) {
      console.error('Could not load user data', err);
    }
  }


  initFormGroup() {
    this.editUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      adress: ['', [Validators.required]],
    })
  }


  async onSubmit() {
    this.submitted = true;
    if (this.editUserForm.invalid) {
      return
    }
    try {
      const formData: SignupData = this.editUserForm.value;
      await this.authService.updateContact(formData);
      this.router.navigateByUrl('/home');
    } catch (err) {
      console.error('Could not save user profile chanegs.', err);
    }
  }

}
