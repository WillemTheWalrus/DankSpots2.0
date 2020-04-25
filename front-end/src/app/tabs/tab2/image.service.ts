import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class ImageService {
  user: any;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  // image will be in the data url format
  uploadImage(image: string) {
      this.user = this.authService.cognitoUser;
      const token = this.authService.isUserSignedIn ? `${this.user.signInUserSession.idToken.jwtToken}` : null;
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: token,
        })
      };
      return this.http.post('/Prod/images', { base64String: image, fileExtension: 'jpg' }, httpOptions).pipe(
      map((response: any) => {
        // do stuff
        return response;
      }),
      catchError(this.handleError('test',  'ERROR'))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error);
        console.log(`${operation} failed: ${error.message}`);
        return throwError(`${operation} failed: ${error.message}`);
      };
  }
}
