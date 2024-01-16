import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isEmailPasswordInvalid = false;
  loginForm!: FormGroup;
  notVerifiedMessage = false;
  message!: string;


  constructor(
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.initFormGroup();
    this.messageService.currentMessage.subscribe(message => this.message = message);
  }


  initFormGroup() {
    // const savedUsername = localStorage.getItem('username');

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      // rememberMe: [!!savedUsername],
    });
  }


  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    await this.performLogin();
  }


  async performLogin() {
    try {
      const formData = this.loginForm.value;
      let resp: any = await this.authService.login(formData);
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/home/surprise');
    } catch (err: any) {
      if (err.status === 401) {
        this.handleSpecificError(err.error?.error);
      }
    }
  }


  handleSpecificError(errorMessage: string) {
    switch (errorMessage) {
      case 'Please verify your email first.':
        this.handleEmailNotVerifiedError();
        this.isEmailPasswordInvalid = false;
        break;
      case 'Invalid login data':
        this.handleInvalidLoginDataError();
        this.notVerifiedMessage = false;
        break;
    }
  }


  handleEmailNotVerifiedError() {
    this.notVerifiedMessage = true;
    setTimeout(() => {
      this.notVerifiedMessage = false;
    }, 3000);
  }


  handleInvalidLoginDataError() {
    this.isEmailPasswordInvalid = true;
    setTimeout(() => {
      this.isEmailPasswordInvalid = false;
    }, 3000);
  }


  // checkRememberMe(formData: LoginData) {
  //   const username = formData.username;
  //   if (formData.rememberMe) {
  //     localStorage.setItem('username', username);
  //   } else {
  //     localStorage.removeItem('username');
  //   }
  // }


  guestLogin() { }
  showForgotPassword() { }
}
