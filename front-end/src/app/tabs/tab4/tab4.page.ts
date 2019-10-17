import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  darkTheme: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  toggleTheme(ev: any) {
    console.log(ev);
    this.darkTheme = ev.target.checked;
    document.body.classList.toggle('dark', this.darkTheme);
  }

  signOut() {
    this.authService.signout();
  }

}
