import { AuthService } from './../../auth/auth.service';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, latLng, tileLayer , marker } from 'leaflet';
import { ExampleModalPage } from './example-modal/example-modal.page';
import { CognitoUser , CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  map: Map;
  user: CognitoUser;
  attrs: Array<CognitoUserAttribute> = [];
  userLocation: latLng;

  constructor(public modalController: ModalController, private authService: AuthService, private geolocation: Geolocation) {}
  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = latLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setView(this.userLocation, 10);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.userLocation = latLng(data.coords.latitude, data.coords.longitude);
    });
    this.leafletMap();
  }

  /** Remove map when we have multiple map objects */
  ionViewWillLeave() {
    this.map.remove();
  }

  leafletMap() {
    // Initialize Leaflet map
    this.map = new Map('mapId').setView(latLng(32.7157, -117.1611), 10); // default to San Diego
    tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    // Bind map press event for dropping a pin
    this.map.on('contextmenu', e => {
      this.addADankSpot(e.latlng);
  });
  }

  async addADankSpot(pressedLocation) {
    const modal = await this.modalController.create({
      component: ExampleModalPage
    });

    // If dropping a pin, use press location.  Otherwise default to current map's center
    const spotLocation = pressedLocation ? pressedLocation : this.map.getCenter();

    // Function to handle marker click event. Launches modal.
    const markerOnClick = () => {
      modal.present();
      modal.onDidDismiss().then((dataReturned: any) => {
        if (dataReturned !== null) {
          // do something
        }
      });
    };

    // Create marker and add to the map
    marker(spotLocation, {draggable: true}).on('click', markerOnClick)
    .addTo(this.map).bindPopup('New Dank Spot').openPopup();
  }

}
