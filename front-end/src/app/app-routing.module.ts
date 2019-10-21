import { ConfirmPage } from './auth/confirm/confirm.page';
import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { SignUpPage } from './auth/sign-up/sign-up.page';
import { LoginEmailPage } from './auth/login/login-email/login-email.page';
import { ForgotPasswordPage } from './auth/forgot-password/forgot-password.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPage,
  },
  { path: 'sign-up',
    component: SignUpPage
  },
  { path: 'login-email',
    component: LoginEmailPage
  },
  { path: 'confirm',
    component: ConfirmPage
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
