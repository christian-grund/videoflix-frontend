import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StartpageComponent } from './startpage/startpage.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { VideoofferComponent } from './videooffer/videooffer.component';
import { ImprintComponent } from './textsites/imprint/imprint.component';
import { DataprivacyComponent } from './textsites/dataprivacy/dataprivacy.component';
import { ActivateComponent } from './auth/activate/activate.component';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    StartpageComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    VideoofferComponent,
    ActivateComponent,
    ImprintComponent,
    DataprivacyComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'videoflix';

  constructor(private authService: AuthService) {
    this.authService.checkAuthStatus(); // Authentifizierungsstatus beim App-Start prüfen
  }
}
