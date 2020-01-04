import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Component, Injector, ComponentFactoryResolver, ApplicationRef, NgZone, ComponentRef } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { map, latLng, tileLayer, marker, icon, popup} from 'leaflet';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpotsService } from './spots.service';
import { MarkerPopoverComponent } from './marker-popover/marker-popover.component';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/leaf-green.png';
const shadowUrl = 'assets/leaf-shadow.png';
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

const redIcon = icon({
  iconRetinaUrl,
  iconUrl: 'assets/leaf-red.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
const orangeIcon = icon({
  iconRetinaUrl,
  iconUrl: 'assets/leaf-orange.png',
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
  map: any;
  user: CognitoUser;
  userLocation: any;
  icon: any;
  message: string;
  // ToDo: make a spots and spot DTO
  spotsData: any;
  compRef: ComponentRef<MarkerPopoverComponent>;
  popoverContent: any;
  markers: any;

  constructor(private modalController: ModalController,
              private spotsService: SpotsService,
              private geolocation: Geolocation,
              private toastController: ToastController,
              private injector: Injector,
              private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private zone: NgZone
    ) {
  }

  ionViewDidEnter() {
    this.getGeoLocation();
    this.getSpots();
    this.leafletMap();
  }

  // Remove map when we have multiple map objects
  ionViewWillLeave() {
    this.map.remove();
  }

  private setMessage(msg: string) {
    this.message = msg;
  }

  leafletMap() {
    // Initialize Leaflet map
    this.map = map('mapId').setView(latLng(32.7157, -117.1611), 10); // default to San Diego
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);
    this.map.addLayer(this.markers);

    // Bind map press event for dropping a pin
    this.map.on('contextmenu', e => {
      this.addADankSpot(e.latlng);
  });
  }

  async addADankSpot(pressedLocation) {

    // If dropping a pin, use press location.  Otherwise default to current map's center
    const newSpotLocation = pressedLocation ? pressedLocation : this.map.getCenter();
    this.presentModal(newSpotLocation);
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
    this.markers = L.markerClusterGroup();
    this.spotsService.getSpots().subscribe((spotsData: any) => {
      this.spotsData = spotsData;
      const spots = spotsData.Items.map(item => {
        return { ...item, point: JSON.parse(item.geoJson) };
      });
      spots.forEach(spot => {
        const popoverContent = popup();
        const markerOptions =  { dragable: true, keepInView: true	, icon: iconDefault, spot };
        const newMarker = marker([spot.point.coordinates[1], spot.point.coordinates[0]], markerOptions );
        // newMarker.addTo(this.map);
        newMarker.on('click', ev => {
           // set pop up content for the popover
           // we need to run it in angular zone
           this.zone.run(() => {
              if (this.compRef) {
                this.compRef.destroy();
              }

              // creation component, MarkerPopoverComponent should be declared in entryComponents
              const compFactory = this.resolver.resolveComponentFactory(MarkerPopoverComponent);
              this.compRef = compFactory.create(this.injector);


              // parent-child communication
              const clickedSpot = ev.target.options.spot;
              this.compRef.instance.clickedSpot = clickedSpot;

              // subscription for button click events using event emitter
              const subscription = this.compRef.instance.onMoreDetialsClick.subscribe((data: any) => {
                  console.log(data);
              });

              // set inner popup content bound to marker
              const div = document.createElement('div');
              div.appendChild(this.compRef.location.nativeElement);
              popoverContent.setContent(div);

              // it's necessary for change detection within MarkerPopoverComponent
              this.appRef.attachView(this.compRef.hostView);
              this.compRef.onDestroy(() => {
                this.appRef.detachView(this.compRef.hostView);
                subscription.unsubscribe();
              });
            });
        });
        newMarker.bindPopup(popoverContent, { keepInView: true });
        this.markers.addLayer(newMarker);
      });
    },
      (error) => {console.log(error); }
    );
  }

  async presentModal(newSpotLocation: any) {
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
        this.setMessage('New Spot Added');
        // Create marker and add to the map
        // toDo:  generate the new icon like I do the spots coming from the server
        const addedMarker = marker(dataReturned.data.newSpotLocation, { icon: redIcon });
        addedMarker.bindPopup(dataReturned.data.name);
        addedMarker.on('click', ev => {
          console.log('titties');
        });
        this.markers.addLayer(addedMarker);
        this.presentToast();
      }
    });
    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.message,
      color: 'success',
      showCloseButton: true,
      duration: 5000
    });
    toast.present();
  }

}
