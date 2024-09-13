import { Routes } from '@angular/router';
import { StartpageComponent } from './startpage/startpage.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ImprintComponent } from './textsites/imprint/imprint.component';
import { DataprivacyComponent } from './textsites/dataprivacy/dataprivacy.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { VideoofferComponent } from './videooffer/videooffer.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: StartpageComponent },
  { path: 'home', component: StartpageComponent },
  { path: 'videos', component: VideoofferComponent, canActivate: [authGuard] },
  { path: 'videos/watch/:videoname', component: VideoplayerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'dataprivacy', component: DataprivacyComponent },
];
