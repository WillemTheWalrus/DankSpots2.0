import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marker-popover',
  templateUrl: './marker-popover.component.html',
  styleUrls: ['./marker-popover.component.scss'],
})
export class MarkerPopoverComponent implements OnInit {
  clickedSpot: any;
  constructor() { }

  ngOnInit() {}

}
