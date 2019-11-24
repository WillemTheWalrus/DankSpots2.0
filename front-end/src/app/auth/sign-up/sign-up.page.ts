import { ConfirmPage } from './../confirm/confirm.page';
import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  username: string;
  password: string;
  email: string;
  error: string;
  message: string;
  credentials: any;
  constructor(public modalController: ModalController, private router: Router,
              public toastController: ToastController , private authService: AuthService) { }

  ngOnInit() {
  }

  private setError(msg) {
    this.error = msg;
    this.message = null;
 }

  signUp() {
    this.credentials = {
      username: this.email,
      password: this.password,
      email: this.email,
    };
    this.authService.register(this.credentials).subscribe(user => {
      this.presentModal();
    }, error => {
      this.setError(error.message);
      this.presentErrorToast();
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

async presentErrorToast() {
  const toast = await this.toastController.create({
    message: this.error,
    color: 'danger',
    duration: 2000
  });
  toast.present();
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Confirmmation successfull!',
    duration: 2000
  });
  toast.present();
}

}
