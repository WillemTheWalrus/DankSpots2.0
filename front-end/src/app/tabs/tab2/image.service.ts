import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './../../auth/auth.service';

declare const AWS: any;
@Injectable({
    providedIn: 'root'
})

export class ImageService {
  user: any;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getImages() {
    this.user = this.authService.cognitoUser;
    const token = this.authService.isUserSignedIn ? `${this.user.signInUserSession.idToken.jwtToken}` : null;
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: token })
    };
    return this.http.get('/Prod/images', httpOptions)
      .pipe(
        map((response: any) => {
          const uploadUrl = response.body.formConfig.uploadUrl;
          return { uploadUrl };
        }),
        catchError(this.handleError('test', 'ERROR')),
      );
  }

  uploadImage(file: any) {
    const config = this.authService.config;
    const bucket = new AWS.S3(
      {
          accessKeyId: 'AKIA6G3TPIZGK53GTFJJ',
          secretAccessKey: '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',
          region: config.region,
      }
    );
    const params = {
        Bucket: `dankimagebucket`,
        Key: `test5`,
        Body: file,
        ACL: 'public-read',
    };
    console.log(params);
    bucket.upload(params, (data: any) => {
      console.log('success', data);
    }, (err: any) => {
      console.log('error', err);
    });
  }

  handleError<T>(operation = 'operation', result?: T) {
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
