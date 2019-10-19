import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AuthFormValidatorsService } from '../../auth-form-validators.service';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage implements OnInit {
  form: FormGroup;
  formErrors = AuthFormValidatorsService.loginFormErrors;
  message: string;
  error: string;
  constructor(private router: Router, private authService: AuthService,
              private authFormValidatorsService: AuthFormValidatorsService, public toastController: ToastController) { }
  ngOnInit() {
    this.form = this.authFormValidatorsService.form;
  }

  login() {
    const credentials = this.form.value;
    this.authService.signin(credentials).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl('/tabs');
    }, error => {
      this.setError(error.message);
      this.presentErrorToast();
    });
  }

  private setError(msg) {
      this.error = msg;
      this.message = null;
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: this.error,
      color: 'danger',
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }

}
