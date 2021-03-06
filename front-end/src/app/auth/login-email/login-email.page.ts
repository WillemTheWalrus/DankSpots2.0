import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthFormValidatorsService } from '../auth-form-validators.service';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage implements OnInit {
  credentials: object;
  message: string;
  error: string;
  form: FormGroup;
  formErrors = AuthFormValidatorsService.formErrors;
  constructor(private router: Router, private authService: AuthService,
              private authFormValidatorsService: AuthFormValidatorsService, public toastController: ToastController) { }
  ngOnInit() {
    this.form = this.authFormValidatorsService.form;
  }

  private setError(msg: string) {
    this.error = msg;
    this.message = null;
  }

  private setMessage(msg: string) {
    this.message = msg;
    this.error = null;
}

  login() {
    const credentials = this.form.value;
    this.authService.signin(credentials).subscribe(data => {
      this.router.navigateByUrl('/tabs');
    }, error => {
      this.setError(error.message);
      this.presentToast();
    });
  }

  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.error,
      color: 'danger',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }
      ],
      duration: 2000
    });
    toast.present();
  }

}
