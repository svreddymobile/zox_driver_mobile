import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
  standalone: true,
  imports: [RouterModule, IonicModule, HeaderComponent, FooterComponent, CommonModule]
})
export class BlankComponent implements OnInit {

  login = false;
  userObj: any = {}
  version = environment.version;
  constructor(public api: ApiService, public router: Router, public alertController: AlertController, public platform: Platform) { }

  ngOnInit() {
    if (localStorage.getItem('authToken')) {
      this.login = true
      this.getProfile()
    }
  }

  onMenuOpen() {
    if (localStorage.getItem('authToken')) {
      this.login = true
      this.getProfile()
    }
  }

  openPage(page: any) {
    this.router.navigate([page])
  }


  getProfile() {
    this.api.getUserProfile().subscribe((resp: any) => {
      if (resp) {
        this.userObj = resp.data;
      }
    })
  }


  async logout(title: any, subTitle: any) {

    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure, you want to in-active account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Okay',
          role: 'confirm',
          handler: () => {
            localStorage.clear()
            this.login = false;
            this.userObj = {}
            this.router.navigate(['/login'])
          },
        },
      ],
    });

    await alert.present();


  }



}
