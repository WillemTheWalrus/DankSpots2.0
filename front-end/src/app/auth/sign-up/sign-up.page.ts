import { ConfirmPage } from './../confirm/confirm.page';
import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { AuthFormValidatorsService } from '../auth-form-validators.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  credentials: object;
  message: string;
  error: string;
  form: FormGroup;
  formErrors = AuthFormValidatorsService.formErrors;
  constructor(public modalController: ModalController, private router: Router,
              public toastController: ToastController , private authService: AuthService,
              private authFormValidatorsService: AuthFormValidatorsService, ) { }

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

  signUp() {
    this.credentials = this.form.value;
    this.authService.register(this.credentials).subscribe(user => {
      this.presentModal();
    }, error => {
      this.setError(error.message);
      this.presentToast();
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ConfirmPage,
      componentProps: this.credentials,
    });
    modal.onDidDismiss().then((dataReturned: any) => {
      if (dataReturned !== null) {}
      this.router.navigateByUrl('/login');
    });
    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.error,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

}
