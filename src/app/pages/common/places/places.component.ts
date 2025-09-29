import { Component, Input, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { debounceTime, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MapsComponent } from '../maps/maps.component';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class PlacesComponent implements OnInit {

  @Input()
  city: any;

  searchControl = new FormControl('');
  filteredOptions: any = [];

  constructor(public modalCtrl: ModalController, public api: ApiService) { }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(700),
      switchMap(value => this.api.getSearchPlaces(value, this.city))
    ).subscribe((options: any) => {
      this.filteredOptions = []
      if (options) {
        this.filteredOptions = options?.data;
      }

    });
  }

  cancel() {
    this.modalCtrl.dismiss()
  }

  async selectPlace(place: any) {
    // this.modalCtrl.dismiss(place, 'confirm')
    // return
    console.log(place)

    const modals = await this.modalCtrl.create({
      component: MapsComponent,
      id: 'maps',
      componentProps: {
        place: place
      }
    });
    modals.present();

    const { data, role } = await modals.onWillDismiss();

    if (role === 'confirm') {
      console.log(data)
      setTimeout(() => {
        console.log('close')
        this.modalCtrl.dismiss(data, 'confirm')
      }, 800);

    }
  }



}
