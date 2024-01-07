import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  signUpEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
   
  });

  constructor(private route:Router){}

  onSubmit(){
    console.log();
    this.route.navigateByUrl('/signup');
  }
}
