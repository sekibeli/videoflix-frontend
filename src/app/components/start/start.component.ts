import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  signUpEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
   
  });


  onSubmit(){}
}
