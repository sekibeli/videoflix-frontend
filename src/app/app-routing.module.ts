import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailComponent } from './components/detail/detail.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { StartComponent } from './components/start/start.component';
import { EmailVerifyComponent } from './components/email-verify/email-verify.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { MyvideosComponent } from './components/myvideos/myvideos.component';
import { SurpriseComponent } from './components/surprise/surprise.component';
import { PopularComponent } from './components/popular/popular.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { EditVideoComponent } from './components/edit-video/edit-video.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify/:token', component: EmailVerifyComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: 'search', component: SearchResultsComponent },
      { path: 'surprise', component: SurpriseComponent },
      { path: 'allvideos', component: OverviewComponent },
      { path: 'myvideos', component: MyvideosComponent },
      { path: 'popular', component: PopularComponent },
      { path: 'detail/:id', component: VideoDetailComponent },
      { path: 'edit-video/:id', component: EditVideoComponent },
      { path: 'edit-user', component: EditUserComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// { enableTracing: true }