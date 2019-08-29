import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExampleModalPage } from './example-modal/example-modal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: Tab3Page },
      { path: 'modal', component: ExampleModalPage },
  ])
  ],
  declarations: [Tab3Page, ExampleModalPage]
})
export class Tab3PageModule {}
