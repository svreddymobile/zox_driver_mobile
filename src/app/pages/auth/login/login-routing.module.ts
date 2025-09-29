import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { LoginOTPComponent } from './login-otp/login-otp.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'otp',
    component: LoginOTPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule { }
