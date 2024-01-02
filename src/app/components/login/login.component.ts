import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  currentUser: any;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
login(){}
rememberMe(){}
guestLogin(){}
showForgotPassword(){}
}
