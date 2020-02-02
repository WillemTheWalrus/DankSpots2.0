import { SpotsService } from '../spots.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Spot } from 'src/app/shared/dtos/spot';

@Component({
  selector: 'app-spot-modal',
  templateUrl: './spot-modal.page.html',
  styleUrls: ['./spot-modal.page.scss'],
})
export class SpotModalPage implements OnInit {
  @Input() clickedSpot: Spot;
  @Input() distanceTo: string;
  dogs: Array<any>;
  constructor(private spotsService: SpotsService, private modalController: ModalController) { }

  ngOnInit() {
    this.spotsService.getDogs().subscribe((data: any) => {
       this.dogs = data.message;
    });

  }

  async close() {
    await this.modalController.dismiss();
  }

}
