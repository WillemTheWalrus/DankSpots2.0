import { SpotsService } from './../spots.service';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-marker-popover',
  templateUrl: './marker-popover.component.html',
  styleUrls: ['./marker-popover.component.scss'],
})
export class MarkerPopoverComponent implements OnInit {
  clickedSpot: any;
  dogImg: string;
  onMoreDetialsClick = new EventEmitter();
  constructor(private spotsService: SpotsService) { }

  ngOnInit() {
    this.spotsService.getDog().subscribe((data: any) => {
       this.dogImg = data.message;
    });
  }

  moreDetailsClick() {
    this.onMoreDetialsClick.emit({open: true, spot: this.clickedSpot});
  }

}
