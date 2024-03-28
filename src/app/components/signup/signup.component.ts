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
  // userAlreadyExists!: boolean;
  errorMessage: string | null = null;
  signUpForm!: FormGroup;
  submitted!: boolean;
  signedUpInfo!: boolean;
  isButtonDisabled!: boolean;
  passwordInputFocused: boolean = false;



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
      password: ['', [Validators.required, Validators.minLength(8)]],
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
      console.error('Could not signup.', err);
      this.handlySignUpError(err);
    }
  }


  handlySignUpError(err: any) {
    // Überprüfen Sie, ob es sich um eine Fehlerantwort mit Status 400 handelt
    if (err.status === 400 && err.error) {
      // Nehmen Sie an, dass der Fehler im ersten Schlüssel des Fehlerobjekts liegt.
      const errors = err.error[Object.keys(err.error)[0]];
      // Wenn errors ein Array ist, zeigen Sie die erste Fehlermeldung an.
      if (Array.isArray(errors)) {
        this.errorMessage = errors[0];
      }
    } else {
      // Wenn es kein bekannter Fehler ist, zeigen Sie eine allgemeine Fehlermeldung an.
      this.errorMessage = "An error occurred during signup. Please try again.";
    }
  
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
  

  onPasswordFocus() {
    this.passwordInputFocused = true;
  }
  
  onPasswordBlur() {
    this.passwordInputFocused = false;
  }

}
