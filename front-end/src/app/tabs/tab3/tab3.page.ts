import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { ExampleModalPage } from './example-modal/example-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  map: Map;
  dataReturned: any;

  constructor(public modalController: ModalController) {}
  ionViewDidEnter() {
    this.leafletMap(); }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

  leafletMap() {
    // In setView add latLng and zoom
    this.map = new Map('mapId').setView([32, -117], 10);
    tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © ionic LeafLet',
    }).addTo(this.map);


    marker([32, -117]).addTo(this.map)
      .bindPopup('Ionic 4 <br> Leaflet.')
      .openPopup();
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
      this.map.setView([this.dataReturned.lat, this.dataReturned.long], 10);
    });

    return await modal.present();
  }


}
