import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import {throwError as observableThrowError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotsService {
  user: any;
  spotsData: any;
  constructor(private http: HttpClient, private authService: AuthService) { }
  getSpots() {
    this.user = this.authService.cognitoUser;
    const token = this.authService.isUserSignedIn ? `${this.user.signInUserSession.idToken.jwtToken}` : null;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token,
        'Access-Control-Allow-Origin': 'http://localhost:8100',
      })
    };
    const getSpots = this.http.get(`${environment.baseApi}/spot`, httpOptions );
    return getSpots.pipe(map(data => {
      this.spotsData = data;
      return data;
    })
    , catchError(error => observableThrowError(error)));
  }

  saveSpot() {
  }

}
