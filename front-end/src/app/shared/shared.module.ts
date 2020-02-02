import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from './components/spinner/spinner.component';

const components = [SpinnerComponent];
const modules = [CommonModule, IonicModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [
    components
  ],
  imports: [
   modules
  ],
  exports: [
    components,
    modules,
  ],
})
export class SharedModule { }
