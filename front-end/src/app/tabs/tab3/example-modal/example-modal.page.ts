import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-example-modal',
  templateUrl: './example-modal.page.html',
  styleUrls: ['./example-modal.page.scss'],
})
export class ExampleModalPage implements OnInit {

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

}