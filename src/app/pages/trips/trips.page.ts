import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { TripDetailsPage } from '../trip-details/trip-details.page';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
  standalone: false
})
export class TripsPage implements OnInit {

  title = 'New Trips';
  typeId = 1;
  trips: any = [];
  pageNumber = 0;
  records = 100;

  totalRecords = 0;
  constructor(public router: Router, public route: ActivatedRoute, public api: ApiService,
    public modalCtrl: ModalController, public alertController: AlertController) {
    this.route.params.subscribe((params: any) => {
      this.typeId = +params.id;
      if (params.id == 1) {
        this.title = 'Assigned Trips'
      } else if (params.id == 2) {
        this.title = 'Upcoming Trips'
      } else if (params.id == 3) {
        this.title = 'Completed Trips'
      } else if (params.id == 4) {
        this.title = 'Cancelled Trips'
      }
      this.getBookings();
    });

  }

  ngOnInit() {
    // this.getBookings();
  }

  back() {
    this.router.navigate(['/home'], {
    })
  }

  getBookings() {
    let params = {
      pageNumber: this.pageNumber,
      records: this.records,
      typeId: this.typeId
    }

    this.api.getBookings(params).subscribe((res: any) => {
      if (res) {
        this.totalRecords = res.data.count;
        this.trips = res.data.data;
      }

    }, err => {
      this.api.alerts('Something went wrong, try again later');
    })
  }



  async openDetails(itemInfo: any) {
    const modal = await this.modalCtrl.create({
      component: TripDetailsPage,
      componentProps: {
        bookingInfo: itemInfo
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.getBookings()
    }

  }

  async cancelTrip(item: any) {
    const alert = await this.alertController.create({
      header: 'Cancel Trip',
      message: 'Are you sure you want to cancel this trip?',
      inputs: [
        {
          type: 'textarea',
          placeholder: 'your comments',
          name: 'comments',
          attributes: {
            minlength: 5,
          },
        },
      ],
      buttons: [
        {
          text: 'Close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'Save',
          htmlAttributes: {
            'aria-label': 'save',
          },
          handler: (data) => {
            let params = {
              id: item.id,
              type: 'cancel',
              comments: data.comments
            }
            this.updateBookingStatus(params);
          }
        },
      ],
      backdropDismiss: false,
    });

    alert.present();

    // 👇 Find the Save button in the shadow DOM
    const saveBtn = alert.querySelector<HTMLButtonElement>(
      'button.alert-button:nth-child(2)' // or use :last-child depending on your button order
    );
    if (saveBtn) {
      saveBtn.disabled = true; // disable initially
    }

    // 👇 Find textarea input
    const textarea = alert.querySelector('textarea');
    textarea?.addEventListener('input', (ev: any) => {
      if (saveBtn) {
        saveBtn.disabled = !ev.target.value.trim();
      }
    });
  }


  async startTrip(item: any) {
    const alert = await this.alertController.create({
      header: 'Start Trip',
      message: 'Enter OTP',
      inputs: [
        {
          type: 'number',
          placeholder: 'Your OTP',
          name: 'otp',
          attributes: {
            maxlength: 4 // 👈 restrict to 4 digits
          }
        },
      ],
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'Start',
          htmlAttributes: {
            'aria-label': 'save',
          },
          handler: (data) => {
            let params = {
              id: item.id,
              type: 'confirm',
              otp: data.otp
            }
            this.updateBookingStatus(params);
          }
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();

    // 👇 Find the "Start" button
    const startBtn = alert.querySelector<HTMLButtonElement>(
      '.alert-button:last-child'
    );
    if (startBtn) {
      startBtn.disabled = true; // disable initially
    }

    // 👇 Find the number input
    const numberInput = alert.querySelector<HTMLInputElement>('input[type="number"]');
    numberInput?.addEventListener('input', (ev: any) => {
      if (startBtn) {
        const value = ev.target.value.trim();
        startBtn.disabled = value.length !== 4; // 👈 only enable if 4 digits entered
      }
    });
  }




  async endTrip(item: any) {
    const alert = await this.alertController.create({
      header: 'End Trip',
      message: 'Are you sure you want to end this trip?',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
        {
          text: 'End',
          htmlAttributes: {
            'aria-label': 'save',
          },
          handler: (data) => {
            let params = {
              id: item.id,
              type: 'end'
            }
            this.updateBookingStatus(params);
          }
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();

    // 👇 Find the "Start" button
    const startBtn = alert.querySelector<HTMLButtonElement>(
      '.alert-button:last-child'
    );
    if (startBtn) {
      startBtn.disabled = true; // disable initially
    }

    // 👇 Find the number input
    const numberInput = alert.querySelector<HTMLInputElement>('input[type="number"]');
    numberInput?.addEventListener('input', (ev: any) => {
      if (startBtn) {
        const value = ev.target.value.trim();
        startBtn.disabled = value.length !== 4; // 👈 only enable if 4 digits entered
      }
    });
  }

  updateBookingStatus(params: any) {
    this.api.updateBookingStatus(params).subscribe((resp: any) => {
      if (resp) {
        this.getBookings()
      }
    })
  }


}
