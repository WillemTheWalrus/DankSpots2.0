import { SpotsService } from '../spots.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Spot } from 'src/app/shared/dtos/spot';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-spot-modal',
  templateUrl: './spot-modal.page.html',
  styleUrls: ['./spot-modal.page.scss'],
})
export class SpotModalPage implements OnInit {
  @Input() clickedSpot: Spot;
  @Input() distanceTo: string;
  @Input() userLocation: any;
  dogs: Array<any>;
  constructor(private spotsService: SpotsService, private modalController: ModalController, private launchNav: LaunchNavigator) { }

  ngOnInit() {
    this.spotsService.getDogs().subscribe((data: any) => {
       this.dogs = data.message;
    });

  }

  launchNagivator() {
    this.launchNav.navigate( this.clickedSpot.point.coordinates, { start: [this.userLocation.lat, this.userLocation.lng]})
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );

  }

  async close() {
    await this.modalController.dismiss();
  }

}
