import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: content
  },
  {
    path: 'auth/login-page',
    component: LoginPageComponent
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'auth/register-page',
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
