import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-spot-modal',
  templateUrl: './add-spot-modal.page.html',
  styleUrls: ['./add-spot-modal.page.scss'],
})
export class AddSpotModalModalPage implements OnInit {
  // toDo: move to shared module
  constructor( private modalController: ModalController) { }
  lat: number;
  long: number;
  ngOnInit() {
  }

  async closeModal() {
    const markerPoints = {
      lat: this.lat,
      long: this.long,
    };
    await this.modalController.dismiss(markerPoints);
  }

  async close() {
    await this.modalController.dismiss();
  }

}
