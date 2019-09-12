import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login/login.page';
import { SignUpPage } from './sign-up/sign-up.page';




@NgModule({
  declarations: [LoginPage, SignUpPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class AuthModule { }
