import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit, OnDestroy {
  emailVerificationSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) { }


  ngOnInit(): void {
    this.getToken();
  }


  getToken() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.emailVerificationSubscription = this.verifyEmail(token).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.log(error, 'Error to verify your email.');
        }
      });
    }
  }


  verifyEmail(token: string) {
    return this.http.get(environment.baseUrl + `/verify/${token}`);
  }


  ngOnDestroy(): void {
    if (this.emailVerificationSubscription) {
      this.emailVerificationSubscription.unsubscribe();
    }
  }

}
