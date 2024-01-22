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


const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: StartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify/:token', component: EmailVerifyComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },
  {
    path: 'home', component: HomeComponent,

    children: [
      { path: 'surprise', component: SurpriseComponent},
      { path: 'allvideos', component: OverviewComponent },
      { path: 'myvideos', component: MyvideosComponent},
      { path: 'edit-user', component: EditUserComponent },
      // { path: 'detail', component: DetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
