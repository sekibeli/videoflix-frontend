import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchTerm: string = '';


  constructor(
    public authService: AuthService,
    private router: Router) { }


    filterVideos() {
      
    }


  async onLogout() {
    try {
      await this.authService.signout();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
    }
  }

}
