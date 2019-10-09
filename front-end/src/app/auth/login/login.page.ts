import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AuthService } from './../auth.service';
import { AuthFormValidatorsService } from './../auth-form-validators.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup = this.authFormValidatorsService.form;
  formErrors = AuthFormValidatorsService.loginFormErrors;
  message: string;
  error: string;
  constructor(private router: Router, private authService: AuthService,
              private authFormValidatorsService: AuthFormValidatorsService, public toastController: ToastController) { }

  ngOnInit() {
  }

  login() {
    const credentials = this.form.value;
    this.authService.signin(credentials).subscribe(data => {
      this.router.navigateByUrl('/tabs');
    }, error => {
      this.setError(error.message);
      this.presentErrorToast();
    });
  }

  signUp() {
    this.router.navigateByUrl('/sign-up');
  }

  private setMessage(msg) {
    this.message = msg;
    this.error = null;
  }

  private setError(msg) {
      this.error = msg;
      this.message = null;
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: this.error,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

}
