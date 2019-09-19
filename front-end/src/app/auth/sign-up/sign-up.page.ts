import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  username: string;
  password: string;
  error: string;
  message: string;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    const credentials = {
      username: this.username,
      password: this.password,
    };
    this.authService.register(credentials).then((user) => {
      console.log('register: success', user);
      this.router.navigateByUrl('/login');
    }).catch((err) => {
      console.log('error registering', err);
      this.setError(err.message);
    });
  }

  private setError(msg) {
    this.error = msg;
    this.message = null;
 }

}
