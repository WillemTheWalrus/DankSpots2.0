import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import {throwError as observableThrowError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotsService {
  user: CognitoUser;
  constructor(private http: HttpClient, private authService: AuthService) { }
  getSpots() {
    this.user = this.authService.cognitoUser;
    const token = `${this.user.signInUserSession.accessToken.jwtToken}`;
    console.log(this.user.signInUserSession.accessToken);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token,
        'Access-Control-Allow-Origin': '*'
      })
    };
    console.log(httpOptions);
    return this.http.get(`${environment.dankServices}/spot`, httpOptions ).pipe(map(data => {
      return data;
    })
    , catchError(error => observableThrowError(error)));
  }
}
