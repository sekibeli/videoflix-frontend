import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LoginData, SignupData } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token = "";
  token$ = new BehaviorSubject<string>(this.storageToken);

  constructor(private http: HttpClient) {
    this.token$.subscribe((token) => {
      this.token = token;
      this.storageToken = token;
    });
  }


  set storageToken(token: string) {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      this.token = token;
    }
  }

  get storageToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (error) {
      return this.token;
    }
  }


  signup(formData: SignupData) {
    const url = environment.baseUrl + '/signup/';
    return lastValueFrom(this.http.post(url, formData));
  }


  login(formData: LoginData) {
    const url = environment.baseUrl + '/login/';
    return lastValueFrom(this.http.post(url, formData)).
      catch(err => Promise.reject(err));
  }


  getLoggedUserData() {
    const url = environment.baseUrl + '/edit-user/';
    return lastValueFrom(this.http.get<SignupData>(url));
  }


  updateUserProfile(updateUserProfile: SignupData) {
    console.log('Run method updateUserProfile');
    const url = environment.baseUrl + '/edit-user/';
    return lastValueFrom(this.http.patch<SignupData>(url, updateUserProfile));
  }


  // isLoggedIn(): boolean {
  //   const token = localStorage.getItem('token');
  //   return !!token;
  // }


  signout() {
    const url = environment.baseUrl + '/logout/';
    return lastValueFrom(this.http.post(url, {}));
  }

  deleteUserAccount() {
    const url = environment.baseUrl + '/delete-user/';
    return lastValueFrom(this.http.delete(url));
  }

  forgotPassword(email: string) {
    const url = environment.baseUrl + '/api/password_reset/';
    return lastValueFrom(this.http.post(url, { email: email }));
  }

  resetPassword(token: string, password: string) {
    const url = environment.baseUrl + '/api/password_reset/confirm/';
    return lastValueFrom(this.http.post(url, { token: token, password: password }));
  }

  validateToken(token: string) {
    const url = environment.baseUrl + '/api/password_reset/validate_token/';
    return lastValueFrom(this.http.post(url, { token: token }));
  }


  guestLogin() {
    const url = environment.baseUrl + '/guest-login/';
    return lastValueFrom(this.http.post(url, {}));
  }

}
