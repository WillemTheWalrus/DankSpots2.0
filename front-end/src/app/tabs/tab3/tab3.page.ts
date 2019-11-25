import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  darkTheme: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  toggleTheme(ev: any) {
    this.darkTheme = ev.target.checked;
  }

  deleteAccount() {}

  signOut() {
    this.authService.signout();
  }

}
