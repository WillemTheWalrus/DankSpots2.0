import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import {throwError as observableThrowError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotsService {
  user: any;
  constructor(private http: HttpClient, private authService: AuthService) { }
  getSpots() {
    this.user = this.authService.cognitoUser;
    const token = this.authService.isUserSignedIn ? `${this.user.signInUserSession.accessToken.jwtToken}` : null;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token,
        'Access-Control-Allow-Origin': '*',
      })
    };
    const getSpots = this.http.get(`${environment.baseApi}/spot`, httpOptions );
    return getSpots.pipe(map(data => {
      return data;
    })
    , catchError(error => observableThrowError(error)));
  }
}
