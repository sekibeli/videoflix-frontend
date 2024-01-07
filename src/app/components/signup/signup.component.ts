import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required)
  });

constructor(private route: Router){}

  onSubmit(){
   // todo Verifizierung
  
    console.log();
    this.route.navigateByUrl('/home');
  
  }
}
