import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  username: string;
  password: string;
  email: string;
  error: string;
  message: string;
  constructor(private router: Router, public alertController: AlertController,
              public toastController: ToastController , private authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    const credentials = {
      username: this.username,
      password: this.password,
      email: this.email,
    };
    this.authService.register(credentials).subscribe(user => {
      console.log('register: success', user);
      this.promptVerificationCode(credentials);
    }, error => {
      console.log('error registering', error);
      this.setError(error.message);
    });
  }

  confirm(creds: any) {
    this.authService.confirm(creds).subscribe(
      () => {
        this.presentToast();
        this.router.navigateByUrl('/login');
      }, error => {
        console.log('error confirming', error);
        this.setError(error.message);
      },
    );
  }

  async promptVerificationCode(creds: any) {
    const alert = await this.alertController.create({
      header: 'Enter Verification Code',
      inputs: [
        {
          name: 'confcode',
          placeholder: 'Verification Code'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Verify',
          handler: data => {
            const confirmCreds = {...creds, confcode: data.confcode};
            this.confirm(confirmCreds);
          }
        }
      ]
    });
    alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Confirmmation successfull!',
      duration: 2000
    });
    toast.present();
  }

  private setError(msg) {
    this.error = msg;
    this.message = null;
 }

}
