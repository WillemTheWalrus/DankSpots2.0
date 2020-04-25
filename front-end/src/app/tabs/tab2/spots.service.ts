import { Injectable } from '@angular/core';
import {throwError as observableThrowError } from 'rxjs';
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
    return this.http.get('/Prod/spot', this.loadHttpOptions() )
    .pipe(map((data: any) => {
      const items = data.Items.filter(item => item.geoJson);
      return items.map((item: any) => {
        return new Spot({ ...item, point: JSON.parse(item.geoJson) });
      });
    }),
    catchError(error => observableThrowError(error)));
  }

  saveSpot(spot: Spot) {
    return this.http.post('/Prod/spot', spot, this.loadHttpOptions()).pipe(
      map(data => {
        return data;
      }),
      catchError( error => observableThrowError(error)),
    );
  }

  loadHttpOptions() {
    this.user = this.authService.cognitoUser;
    const token = this.authService.isUserSignedIn ? `${this.user.signInUserSession.idToken.jwtToken}` : null;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
      })
    };
    return httpOptions;
  }

}
