import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  currentUser: any;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
login(){}
rememberMe(){}
guestLogin(){}
showForgotPassword(){}
onSubmit(){}
}
