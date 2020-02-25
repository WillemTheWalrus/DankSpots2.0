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
  spotMarkers: L.MarkerClusterGroup;
  plugMarkers: L.MarkerClusterGroup;
  munchyMarkers: L.MarkerClusterGroup;
  hideSpots: boolean;
  hidePlugs: boolean;
  hideMunchies: boolean;
  hideFilters: boolean;

  constructor(private modalController: ModalController,
              private spotsService: SpotsService,
              private geolocation: Geolocation,
              private toastController: ToastController,
              private ar: ActivatedRoute
    ) {
      this.spotMarkers = L.markerClusterGroup();
      this.plugMarkers = L.markerClusterGroup();
      this.munchyMarkers = L.markerClusterGroup();
      this.hideFilters = true;
      this.hideSpots = false;
      this.hideMunchies = false;
      this.hidePlugs = false;
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
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
    this.map.addLayer(this.spotMarkers);
    this.map.addLayer(this.plugMarkers);
    this.map.addLayer(this.munchyMarkers);

    // Bind map press event for dropping a pin
    this.map.on('click', ev => {
      this.addADankSpot(ev.latlng);
    });
  }

  toggleFilters() {
    this.hideFilters = !this.hideFilters;
  }

  toggleSpots(){
    this.hideSpots = !this.hideSpots;
    if(this.hideSpots){
      this.map.removeLayer(this.spotMarkers);
    }
    else{
      this.map.addLayer(this.spotMarkers);
    }
  }

  togglePlugs(){
    this.hidePlugs = !this.hidePlugs;
    if(this.hidePlugs){
      this.map.removeLayer(this.plugMarkers);
    }
    else{
      this.map.addLayer(this.plugMarkers);
    }
  }

  toggleMunchies()
  {
    this.hideMunchies = !this.hideMunchies;
    if(this.hideMunchies){
      this.map.removeLayer(this.hideMunchies);
    }
    else{
      this.map.addLayer(this.hideMunchies);
    }
  }

  enableAllMarkerLayers(){
    if(this.hidePlugs){
      this.togglePlugs();
    }
    if(this.hideMunchies){
      this.toggleMunchies();
    }
    if(this.hideSpots){
      this.toggleSpots();
    }
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
        const markerOptions =  { icon: greenIcon, spot };
        const newMarker = marker(spot.point.coordinates, markerOptions );
        newMarker.on('click', ev => {
              // prop data
              const clickedSpot = ev.target.options.spot;
              const originCoords = [this.userLocation.lat, this.userLocation.lng];
              const destinationCoords = clickedSpot.point.coordinates;
              const distanceTo = SpotUtilities.toMiles(SpotUtilities.getDistance(originCoords, destinationCoords));
              this.presentSpotModal(clickedSpot, distanceTo);
        });
        console.log(spot);
        if (spot.spotType === 'spot') {
          this.spotMarkers.addLayer(newMarker);
        } else if (spot.spotType === 'munchy') {
          this.munchyMarkers.addLayer(newMarker);
        } else if (spot.spotType === 'plug') {
          this.plugMarkers.addLayer(newMarker);
        }
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
        this.spotMarkers.addLayer(addedMarker);
        this.presentToast();
      }
    });
    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Spot Added',
      color: 'success',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }
      ],
      duration: 5000
    });
    toast.present();
  }



}