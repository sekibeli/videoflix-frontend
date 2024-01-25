import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SignupData } from 'src/app/services/user-interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userProfile!: SignupData;
  editUserForm!: FormGroup;
  submitted = false;
  currentUsername!: string;


  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location) { }

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
        // adress: userProfile.adress,
      })
      this.currentUsername = userProfile.username;
    } catch (err) {
      console.error('Could not load user data', err);
    }
  }


  initFormGroup() {
    this.editUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      // adress: ['', [Validators.required]],
    })
  }


  async onSubmit() {
    this.submitted = true;
    if (this.editUserForm.invalid) {
      return
    }
    try {
      const formData: SignupData = this.editUserForm.value;
      await this.authService.updateUserProfile(formData);
      this.location.back(); 
    } catch (err) {
      console.error('Could not save user profile chanegs.', err);
    }
  }
  

  async deleteAccount() {
    try {
      await this.authService.deleteUserAccount();
      this.router.navigateByUrl('/login');
      this.messageService.changeMessage('Account successfully deleted');
    } catch (err) {
      console.error('Could not delete user-account', err);
    }
  }

  
  goBack(): void {      
    this.location.back(); 
  }

}
