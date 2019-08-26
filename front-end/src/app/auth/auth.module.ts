import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login/login.page';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [ LoginPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class AuthModule { }
