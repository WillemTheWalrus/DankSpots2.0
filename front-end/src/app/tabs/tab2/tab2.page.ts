import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, latLng, tileLayer , marker, icon } from 'leaflet';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpotsService } from './spots.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: Map;
  user: CognitoUser;
  userLocation: latLng;
  icon: any;
  // ToDo: make a spots and spot DTO
  spotsData: any;

  constructor(private modalController: ModalController, private spotsService: SpotsService,
              private geolocation: Geolocation) {
  }

  ionViewDidEnter() {
    this.leafletMap();
    this.getGeoLocation();
    this.getSpots();
  }

  // Remove map when we have multiple map objects
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

    // If dropping a pin, use press location.  Otherwise default to current map's center
    const spotLocation = pressedLocation ? pressedLocation : this.map.getCenter();

    // Create marker and add to the map
    marker(spotLocation, {draggable: true, icon: iconDefault})
    .addTo(this.map).bindPopup('New Dank Spot').openPopup()
    .on('click dragend', ev => {
      this.presentModal();
    });
  }

  getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation = latLng(resp.coords.latitude, resp.coords.longitude);
      // this.map.setView(this.userLocation, 10);
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
        return { ...item, point: JSON.parse(item.geoJson) };
      });
      spots.forEach(spot => {
        const markerOptions =  { dragable: true, icon: iconDefault, ...spot };
        const myMarker = marker([spot.point.coordinates[1], spot.point.coordinates[0]], markerOptions );
        myMarker.addTo(this.map).bindPopup(spot.spotName).on('click', ev => {
           const clickedSpot = ev.target.options.spot;
           // set pop up content for the popover
        });
      });
    },
      (error) => {console.log(error); }
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({component: AddSpotModalModalPage});
    return await modal.present();
  }

}
