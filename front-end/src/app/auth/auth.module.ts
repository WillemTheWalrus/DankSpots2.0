import { AuthRoutingModule } from './auth.router.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login/login.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { LoginEmailPage } from './login/login-email/login-email.page';
import { ConfirmPage } from './confirm/confirm.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';




@NgModule({
  declarations: [LoginPage, LoginEmailPage, SignUpPage, ConfirmPage, ForgotPasswordPage],
  entryComponents: [ConfirmPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AuthModule { }
