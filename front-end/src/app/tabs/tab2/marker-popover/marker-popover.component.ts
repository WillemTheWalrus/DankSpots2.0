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
  constructor() { }

  ngOnInit() {}

  moreDetailsClick() {
    this.onMoreDetialsClick.emit({open: true, spot: this.clickedSpot});
  }

}
