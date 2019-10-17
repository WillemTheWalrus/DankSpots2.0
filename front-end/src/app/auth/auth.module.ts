import { SignupEmailPage } from './sign-up/signup-email/signup-email.page';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login/login.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { LoginEmailPage } from './login/login-email/login-email.page';




@NgModule({
  declarations: [LoginPage, LoginEmailPage, SignUpPage, SignupEmailPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ]
})
export class AuthModule { }
