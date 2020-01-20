import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  entryComponents: [AddSpotModalModalPage, MarkerPopoverComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class Tab2PageModule {}
