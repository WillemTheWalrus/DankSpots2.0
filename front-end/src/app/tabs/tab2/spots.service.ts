import { Injectable } from '@angular/core';
import {throwError as observableThrowError, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Spot } from 'src/app/shared/dtos/spot';

@Injectable({
  providedIn: 'root'
})
export class SpotsService {
  user: any;
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
    .pipe(map((data: any) => {
      return data.Items.map(item => {
        return new Spot({ ...item, point: JSON.parse(item.geoJson) });
      });
    }),
    catchError(error => observableThrowError(error)));
  }

  saveSpot() {}

  loadSpot() {}

  getDog() {
    return this.http.get('/api/breeds/image/random')
    .pipe(
      map(data => data),
      catchError(this.handleError('test', 'ERROR')),
    );
  }

  getDogs() {
    return this.http.get('/api/breeds/image/random/10')
    .pipe(
      map(data => data),
      catchError(this.handleError('test', 'ERROR')),
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
