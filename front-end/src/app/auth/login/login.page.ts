import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  message: string;
  error: string;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    const credentials = {
      username: this.username,
      password: this.password,
    };
    this.authService.signin(credentials).then((user) => {
      this.router.navigateByUrl('/tabs');
    }).catch((err) => {
      console.log('error signing in', err);
      this.setError(err.message);
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

}
