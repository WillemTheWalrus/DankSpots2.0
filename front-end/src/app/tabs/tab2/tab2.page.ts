import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, latLng, tileLayer , marker } from 'leaflet';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpotsService } from './spots.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: Map;
  user: CognitoUser;
  userLocation: latLng;
  spotsData: any;

  constructor(public modalController: ModalController, private spotsService: SpotsService, private geolocation: Geolocation) {}

  ionViewDidEnter() {
    this.leafletMap();
    this.getGeoLocation();
    this.getSpots();
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
      component: AddSpotModalModalPage
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
    .addTo(this.map).bindPopup('New Dank Spot').openPopup().on('dragend', event => {
      modal.present();
      modal.onDidDismiss().then((dataReturned: any) => {
        if (dataReturned !== null) {
          // do something
        }
      });
    });
  }

  getGeoLocation() {
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
  }

  getSpots() {
    this.spotsService.getSpots().subscribe((data: any) => {
      this.spotsData = data;
      const spots = data.Items.map(item => {
        return {...item, point: JSON.parse(item.geoJson) };
      });
      spots.forEach(spot => {
        marker(spot.point.coordinates, {dragable: true})
        .addTo(this.map);
      });
    },
      (error) => {console.log(error); }
    );
  }

}
