import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoginOTPComponent } from './login-otp/login-otp.component';
import { TimerPipe } from 'src/app/shared/pipes/timer.pipe';
import { provideNgxMask } from 'ngx-mask';
import { MaskitoDirective } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    TimerPipe,
    MaskitoDirective
  ],
  declarations: [LoginPage, LoginOTPComponent],
  providers: [provideNgxMask()],
})
export class LoginPageModule { }
