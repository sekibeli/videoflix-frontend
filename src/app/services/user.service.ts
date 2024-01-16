import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.class';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([])
  public users$ = this.usersSubject.asObservable();
  constructor(private http: HttpClient) { }


  getUserData() {
    const url = environment.baseUrl + `/user/`;
    this.http.get<User[]>(url).subscribe(
      users => {
        this.usersSubject.next(users);
      },
      error => {
        console.error('Fehler beim Laden der Benutzer:', error)
      }
    );
  }
}
