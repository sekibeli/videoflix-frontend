import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { LoginData, SignupData } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }


  signup(formData: SignupData) {
    const url = environment.baseUrl + '/signup/';
    return lastValueFrom(this.http.post(url, formData));
  }


  login(formData: LoginData) {
    const url = environment.baseUrl + '/login/';
    return lastValueFrom(this.http.post(url, formData));
  }


  getLoggedUserData() {
    const url = environment.baseUrl + '/user-info/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<SignupData>(url, { headers: headers }));
  }


  // isLoggedIn(): boolean {
  //   const token = localStorage.getItem('token');
  //   return !!token;
  // }


  signout() {
    const url = environment.baseUrl + '/logout/';
    const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
    return lastValueFrom(this.http.post(url, {}, { headers: headers }));
  }


}
