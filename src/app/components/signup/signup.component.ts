import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userAlreadyExists!: boolean;
  signUpForm!: FormGroup;
  submitted!: boolean;
  signedUpInfo!: boolean;
  isButtonDisabled!: boolean;


  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords } as AbstractControlOptions);
  }


  checkPasswords(group: FormGroup): ValidationErrors | null {
    if (!group) {
      return null;
    }

    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }


  async onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }
    await this.performSignup();
  }


  async performSignup() {
    try {
      const formData = this.signUpForm.value;
      let resp: any = await this.authService.signup(formData);
      localStorage.setItem('token', resp.token);
      this.signedUpInfo = true;
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 3000);
    } catch (err) {
      this.handlySignUpError();
    }
  }


  handlySignUpError() {
    this.userAlreadyExists = true;
    setTimeout(() => {
      this.userAlreadyExists = false;
    }, 3000);
  }

}
