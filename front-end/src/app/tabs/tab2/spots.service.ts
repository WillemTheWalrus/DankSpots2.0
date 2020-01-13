import { Injectable } from '@angular/core';
import {throwError as observableThrowError, Observable, of } from 'rxjs';
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
        Authorization: token,
      })
    };
    return this.http.get('/Prod/spot', httpOptions )
    .pipe(map(data => {
      this.spotsData = data;
      return data;
    })
    , catchError(error => observableThrowError(error)));
  }

  saveSpot() {}

  loadSpot() {}

  getDog() {
    return this.http.get('/api/breeds/image/random')
    .pipe(
      map(data => data),
      catchError(this.handleError('jsonpTest', 'ERROR')),
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
