import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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
      localStorage.removeItem('token');
      const formData = this.loginForm.value;
      let resp: any = await this.authService.login(formData);
      this.authService.token$.next(resp['token']);
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


  async onGuestLogin() {
    try {
      localStorage.removeItem('token');
      const resp: any = await this.authService.guestLogin();
      this.authService.token$.next(resp['token']);
      this.router.navigateByUrl('/home/surprise');
    } catch (err) {
      this.isEmailPasswordInvalid = true;
      setTimeout(() => {
        this.isEmailPasswordInvalid = false;
      }, 3000);
    }
  }

}
