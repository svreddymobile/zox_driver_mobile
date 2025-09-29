import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginDetails: any = {};
  errorMessage = null;

  readonly cardMask: MaskitoOptions = {
    mask: [
      ...Array(3).fill(/\d/),
      '-',
      ...Array(3).fill(/\d/),
      '-',
      ...Array(4).fill(/\d/)
    ],
  };

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();


  constructor(public router: Router, public api: ApiService) { }

  ngOnInit() {
    this.redirectPage()
  }

  redirectPage() {
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/home']);
    }
  }

  goToPage(page: any) {
    this.router.navigate([page])
  }

  directIndex(): void {
    this.errorMessage = null;
    // this.loginDetails.phone_number = this.loginDetails.phone_number.replace(/-/g, '');
    let params = {
      phone_number: this.loginDetails.phone_number.replace(/-/g, '')
    }
    this.api.onlineLoginCheck(params).subscribe((resp: any) => {
      this.errorMessage = null;
      if (resp) {
        this.api.alerts('OTP Sent to Phone Number')
        localStorage.setItem('otpToken', resp.token)
        this.router.navigate(['/login/otp'], {
          queryParamsHandling: 'merge'
        })
      }
    }, err => {
      console.log(err)
      this.errorMessage = err?.message
    })
  }

}
