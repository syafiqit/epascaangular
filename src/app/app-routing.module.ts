import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { LoginFirstTimeComponent } from './auth/login-page/login-first-time/login-first-time.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'muka-halaman',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentComponent,
    children: content
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'login-first-time',
    component: LoginFirstTimeComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'register-page',
    component: RegisterPageComponent
  },
];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
