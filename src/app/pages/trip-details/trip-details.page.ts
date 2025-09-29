import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
  standalone: false
})
export class TripDetailsPage implements OnInit {
  @Input()
  bookingInfo: any = {}

  userInfo: any = {}

  constructor(public modalCtrl: ModalController, public api: ApiService, public alertController: AlertController) { }

  ngOnInit() {
    this.userInfo = this.api.currentUser;
  }


  cancel() {
    this.modalCtrl.dismiss(true)
  }


  async cancelTrip() {
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
              id: this.bookingInfo.id,
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


  async startTrip() {
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
              id: this.bookingInfo.id,
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

  updateBookingStatus(params: any) {
    this.api.updateBookingStatus(params).subscribe((resp: any) => {
      if (resp) {
        this.cancel()
      }
    })
  }


  async endTrip() {
    const alert = await this.alertController.create({
      header: 'End Trip',
      message: 'Are you sure end trip?',
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
              id: this.bookingInfo.id,
              type: 'end',
            }
            this.updateBookingStatus(params);
          }
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();


  }

}
