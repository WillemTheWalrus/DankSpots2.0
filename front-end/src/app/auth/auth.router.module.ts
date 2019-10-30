import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { LoginEmailPage } from './login/login-email/login-email.page';
import { ConfirmPage } from './confirm/confirm.page';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginPage,
    },
    {
        path: 'sign-up',
        component: SignUpPage
    },
    {
        path: 'login-email',
        component: LoginEmailPage
    },
    {
        path: 'confirm',
        component: ConfirmPage
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordPage,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
