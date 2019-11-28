import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from './components/spinner/spinner.component';

const components = [SpinnerComponent];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    components
  ],
})
export class SharedModule { }
