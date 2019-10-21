import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  confirmationCode: number;
  error: string;
  message: string;

   // Data passed in by componentProps
   @Input() username: string;
   @Input() password: string;
   @Input() email: string;
  constructor( private modalController: ModalController, private toastController: ToastController, private authService: AuthService) { }

  ngOnInit() {
  }

  private setError(msg) {
    this.error = msg;
  }

  confirm() {
    const creds = {
      username: this.username,
      password: this.password,
      email: this.email,
      confcode: this.confirmationCode,
    };
    this.authService.confirm(creds).subscribe(
      () => {
        this.presentToast();
        this.close();
      }, error => {
        this.setError(error.message);
      },
    );
  }

  async close() {
    await this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Confirmmation successfull!',
      duration: 2000,
      showCloseButton: true,
    });
    toast.present();
  }

}
