import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { MarkerPopoverComponent } from './marker-popover/marker-popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: Tab2Page },
  ])
  ],
  declarations: [Tab2Page, AddSpotModalModalPage, MarkerPopoverComponent],
  entryComponents: [AddSpotModalModalPage, MarkerPopoverComponent]
})
export class Tab2PageModule {}
