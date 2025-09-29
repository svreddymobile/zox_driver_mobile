import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(public http: HttpClient, private toastController: ToastController) { }

  get currentUser() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('otpToken');
    if (!token) {
      return null;
    }

    return this.jwtHelper.decodeToken(token);
  }

  async alerts(title: any) {
    const toast = await this.toastController.create({
      message: title,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }




  onlineResendOTP() {
    return this.http
      .get(environment.url + "user/onlineResendOTP")
      .pipe(catchError(this.handleError));
  }



  onlineLoginCheck(params: any) {
    return this.http
      .post(environment.url + "driver/checkDriverLogin", params)
      .pipe(catchError(this.handleError));
  }

  onlineLogin(params: any) {
    return this.http
      .post(environment.url + "driver/verifyDriverUser", params)
      .pipe(catchError(this.handleError));
  }

  getUserProfile() {
    return this.http
      .get(environment.url + "driver/getUserProfile")
      .pipe(catchError(this.handleError));
  }

  getBookings(params: any) {
    return this.http
      .post(environment.url + "driver/getBookings", params)
      .pipe(catchError(this.handleError));
  }

  updateBookingStatus(params: any) {
    return this.http
      .post(environment.url + "driver/updateBookingStatus", params)
      .pipe(catchError(this.handleError));
  }


  getCounts(params: any) {
    return this.http
      .post(environment.url + "driver/getCounts", params)
      .pipe(catchError(this.handleError));
  }


  handleError(error: Response | any) {
    return throwError(error.error);
  }




}
