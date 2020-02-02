import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { map, latLng, tileLayer, marker } from 'leaflet';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpotsService } from './spots.service';
import { SpotModalPage } from './spot-modal/spot-modal.page';
import { ActivatedRoute } from '@angular/router';
import { Spot } from 'src/app/shared/dtos/spot';
import { iconDefault, greenIcon, redIcon  } from 'src/app/shared/constants/spotConstants';
import { SpotUtilities } from '../../shared/utils/spotUtils';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  map: any;
  user: CognitoUser;
  userLocation: any;
  userLocationMarker: any;
  spots: Array<Spot>;
  markers: any;

  constructor(private modalController: ModalController,
              private spotsService: SpotsService,
              private geolocation: Geolocation,
              private toastController: ToastController,
              private ar: ActivatedRoute
    ) {
      this.markers = L.markerClusterGroup();
  }

  ngOnInit() {
    this.ar.params.subscribe(() => {
      this.getSpots();
    });
  }

  ionViewDidEnter() {
    this.leafletMap();
    this.getGeoLocation();
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  leafletMap() {
    // Initialize Leaflet map
    this.map = map('mapId').setView(latLng(32.7157, -117.1611), 10); // default to San Diego
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);
    this.map.addLayer(this.markers);

    // Bind map press event for dropping a pin
    this.map.on('click', ev => {
      this.addADankSpot(ev.latlng);
    });
  }

  getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = latLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setView(this.userLocation, 10);
      this.userLocationMarker = marker(this.userLocation, { icon: iconDefault } ).bindPopup('this is your location');
      this.map.addLayer(this.userLocationMarker);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getSpots() {
    this.spotsService.getSpots().subscribe((spots: Array<Spot>) => {
      this.spots = spots;
      this.spots.forEach(spot => {
        const markerOptions =  { dragable: true, keepInView: true	, icon: greenIcon, spot };
        const newMarker = marker(spot.point.coordinates, markerOptions );
        newMarker.on('click', ev => {
              // prop data
              const clickedSpot = ev.target.options.spot;
              const originCoords = [this.userLocation.lat, this.userLocation.lng];
              const destinationCoords = clickedSpot.point.coordinates;
              const distanceTo = SpotUtilities.toMiles(SpotUtilities.getDistance(originCoords, destinationCoords));
              this.presentSpotModal(clickedSpot, distanceTo);
        });
        this.markers.addLayer(newMarker);
      });
    },
      (error) => {console.log(error); }
    );
  }

  async addADankSpot(pressedLocation) {
    this.presentAddDankSpotModal(pressedLocation ? pressedLocation : this.map.getCenter());
  }

  async presentSpotModal(clickedSpot, distanceTo) {
    const modal = await this.modalController.create(
      {
        component: SpotModalPage,
        componentProps: {
          clickedSpot,
          distanceTo,
          userLocation: this.userLocation,
        }
      }
    );
    modal.onDidDismiss().then((data: any) => {});
    return await modal.present();
  }


  async presentAddDankSpotModal(newSpotLocation: any) {
    const modal = await this.modalController.create(
      {
        component: AddSpotModalModalPage,
        componentProps: {
          newSpotLocation
        }
      }
    );
    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned.data) {
        const addedMarker = marker(dataReturned.data.newSpotLocation, { icon: redIcon });
        addedMarker.on('click', (ev: any) => {
          const originCoords = [ev.latlng.lat, ev.latlng.lng];
          const destinationCoords = [this.userLocation.lat, this.userLocation.lng];
          const distanceTo = SpotUtilities.toMiles(SpotUtilities.getDistance(originCoords, destinationCoords));
          this.presentSpotModal({}, distanceTo);
        });
        this.markers.addLayer(addedMarker);
        this.presentToast();
      }
    });
    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Spot Added',
      color: 'success',
      showCloseButton: true,
      duration: 5000
    });
    toast.present();
  }

}
