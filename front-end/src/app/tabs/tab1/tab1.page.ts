import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private authService: AuthService) {}

  signOut() {
    this.authService.signout();
  }

}
