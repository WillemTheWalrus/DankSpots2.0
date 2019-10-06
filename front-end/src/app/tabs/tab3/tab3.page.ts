import { AuthService } from './../../auth/auth.service';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
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
  dataReturned: any;
  user: CognitoUser;
  attrs: Array<CognitoUserAttribute> = [];
  userLocation: latLng;

  constructor(public modalController: ModalController, private authService: AuthService, private geolocation: Geolocation) {}
  ionViewDidEnter() {
    console.log(this.authService.cognitoUser);
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

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

  leafletMap() {
    // In setView add latLng and zoom
    this.map = new Map('mapId').setView(latLng(32.7157, 117.1611), 10); // default to San Diego
    tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      // attribution: 'edupala.com © ionic LeafLet',
    }).addTo(this.map);
  }

  async addADankSpot() {
    const modal = await this.modalController.create({
      component: ExampleModalPage
    });

    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        marker([this.dataReturned.lat, this.dataReturned.long]).addTo(this.map)
        .bindPopup('Look! A new Dank Spot!')
        .openPopup();
      }
      this.map.setView([this.dataReturned.lat, this.dataReturned.long], 7);
    });

    return await modal.present();
  }

}
