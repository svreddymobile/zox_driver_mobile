import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss'],
  standalone: false
})
export class LoginOTPComponent implements OnInit {

  value: any;

  timeLeft: number = 180; // seconds
  private interval: any;

  resendOtp = false


  errorMessage = null;
  userObj: any = {}
  phoneNumber: any = null;
  constructor(private router: Router, public api: ApiService, public route: ActivatedRoute) { }



  ngOnInit(): void {
    this.startCountdown();
    this.userObj = this.api.currentUser;
    if (this.userObj.body.phone_number) {
      this.phoneNumber = atob(this.userObj.body.phone_number)
    }
  }

  startCountdown(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        // Optionally handle countdown complete
        console.log('timer done')
        this.resendOtp = true
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  directPage(): void {
    this.api.onlineLogin({ otp: this.value }).subscribe((resp: any) => {
      if (resp) {
        localStorage.clear()
        localStorage.setItem('authToken', resp.token)
        if (this.route.snapshot.queryParams['redirect']) {
          this.router.navigate([this.route.snapshot.queryParams['redirect']], {
            queryParamsHandling: 'merge'
          })
        } else {
          this.router.navigate(['/home'])
        }
      }
    }, err => {
      console.log(err)
    })
  }


  resetotp(): void {
    this.value = null;
    this.api.onlineResendOTP().subscribe((resp: any) => {
      if (resp) {
        localStorage.setItem('authToken', resp.token);
        this.api.alerts('OTP Sent Successfully')
        this.resendOtp = false
      }
    })
  }

  goToHome() {
    this.router.navigate(['/home'])
  }

  enterOTP(event: any) {
    if ((event.keyCode == 13 || event.key?.toLowerCase() == 'enter') && this.value.length == 4) {
      this.directPage()
    }
  }

}
