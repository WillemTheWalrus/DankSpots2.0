import { SharedModule } from './../../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { AddSpotModalModalPage } from './add-spot-modal/add-spot-modal.page';
import { SpotModalPage } from './spot-modal/spot-modal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: Tab2Page },
  ])
  ],
  declarations: [Tab2Page, AddSpotModalModalPage, SpotModalPage],
  entryComponents: [AddSpotModalModalPage, SpotModalPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class Tab2PageModule {}
