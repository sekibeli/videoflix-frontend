import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailComponent } from './components/detail/detail.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { StartComponent } from './components/start/start.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmailVerifyComponent } from './components/email-verify/email-verify.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MyvideosComponent } from './components/myvideos/myvideos.component';
import { SurpriseComponent } from './components/surprise/surprise.component';
import { PopularComponent } from './components/popular/popular.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    OverviewComponent,
    DetailComponent,
    DatenschutzComponent,
    ImpressumComponent,
    StartComponent,
    HeaderComponent,
    EmailVerifyComponent,
    EditUserComponent,
    MyvideosComponent,
    SurpriseComponent,
    PopularComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
