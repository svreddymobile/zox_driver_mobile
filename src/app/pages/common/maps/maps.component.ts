import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
declare let google: any; // Only if you want to bypass type checking

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class MapsComponent implements OnInit, AfterViewInit {


  @ViewChild('mapElement', { static: false }) mapElementRef!: ElementRef;

  map: any;
  marker: any;

  @Input()
  place: any = {}

  placeInfo: any = {};

  selectedCoords: any = {}


  constructor(public modalCtrl: ModalController, public api: ApiService) { }

  ngOnInit() {
    console.log(this.place)
    if (this.place.placeId) {
      this.loadPlaceDetails()
    }
  }

  ngAfterViewInit() {
    // this.loadMap()
  }



  loadPlaceDetails() {
    console.log('start')
    let param = 'placeId=' + this.place.placeId
    this.api.getPlaceDetails(param).subscribe((resp: any) => {
      if (resp) {
        this.placeInfo = resp?.data?.result;
        this.loadMap();
      }
    })
  }


  cancel() {
    this.modalCtrl.dismiss(null, '', 'maps')
  }


  loadMap() {
    console.log(this.placeInfo)
    const initialCoords = {
      lat: this.placeInfo?.geometry?.location?.lat, lng: this.placeInfo?.geometry?.location?.lng
    }; // Default to Bangalore
    console.log(initialCoords)
    this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
      center: initialCoords,
      zoom: 18,
      disableDefaultUI: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
      // styles: [
      //   {
      //     elementType: 'geometry',
      //     stylers: [{ color: '#f5f5f5' }]
      //   },
      //   {
      //     elementType: 'labels.icon',
      //     stylers: [{ visibility: 'off' }]
      //   },
      //   {
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#616161' }]
      //   },
      //   {
      //     elementType: 'labels.text.stroke',
      //     stylers: [{ color: '#f5f5f5' }]
      //   },
      //   {
      //     featureType: 'administrative.land_parcel',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#bdbdbd' }]
      //   },
      //   {
      //     featureType: 'poi',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#eeeeee' }]
      //   },
      //   {
      //     featureType: 'poi',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#757575' }]
      //   },
      //   {
      //     featureType: 'poi.park',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#e5e5e5' }]
      //   },
      //   {
      //     featureType: 'poi.park',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#9e9e9e' }]
      //   },
      //   {
      //     featureType: 'road',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#ffffff' }]
      //   },
      //   {
      //     featureType: 'road.arterial',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#757575' }]
      //   },
      //   {
      //     featureType: 'road.highway',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#dadada' }]
      //   },
      //   {
      //     featureType: 'road.highway',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#616161' }]
      //   },
      //   {
      //     featureType: 'road.local',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#9e9e9e' }]
      //   },
      //   {
      //     featureType: 'transit.line',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#e5e5e5' }]
      //   },
      //   {
      //     featureType: 'transit.station',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#eeeeee' }]
      //   },
      //   {
      //     featureType: 'water',
      //     elementType: 'geometry',
      //     stylers: [{ color: '#c9c9c9' }]
      //   },
      //   {
      //     featureType: 'water',
      //     elementType: 'labels.text.fill',
      //     stylers: [{ color: '#9e9e9e' }]
      //   }
      // ]
    });

    // Optional: initial location
    this.selectedCoords = initialCoords;

    // When map stops moving
    this.map.addListener('idle', () => {
      const center = this.map.getCenter();
      if (center) {
        this.selectedCoords = {
          lat: center.lat(),
          lng: center.lng(),
        };
        console.log('Map Center Changed:', this.selectedCoords);
      }
    });
  }


  confirmLocation() {
    console.log('Map Center Changed:', this.selectedCoords);
    let params = 'latlng=' + this.selectedCoords.lat + ',' + this.selectedCoords.lng;
    this.api.getAddressObj(params).subscribe((resp: any) => {
      if (resp && resp.data) {
        console.log(resp)
        this.modalCtrl.dismiss(resp.data, 'confirm')
      }
    })
  }


}
