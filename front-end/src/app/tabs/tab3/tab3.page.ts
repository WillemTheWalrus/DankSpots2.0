import { Component, OnInit } from '@angular/core';
import { ThemeService } from './../../../theme/theme.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  darkTheme: boolean;
  constructor(private authService: AuthService, private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.isThemeDark.subscribe(
      (isDark: boolean) => {
        this.darkTheme = isDark;
      }
    );
  }

  toggleTheme(ev: any) {
    this.darkTheme = ev;
    this.themeService.isThemeDark.next(ev.target.checked);
  }

  signOut() {
    this.authService.signout();
  }

}
