import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  spinCount: number;
  constructor(private cdRef: ChangeDetectorRef, public spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinCount = 0;
		this.spinnerService.spinning.subscribe(value => {
			this.spinCount += value;
			if (this.spinCount < 0) {
				this.spinCount = 0;
			}

			this.cdRef.detectChanges();
		});
  }

  isSpinnerVisible() {
		return this.spinCount > 0;
	}

}
