import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AwsConfig } from './../app.config';
import { CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails ,
  ICognitoUserPoolData ,
  CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable, Subject, from } from 'rxjs';
import { ToastController } from '@ionic/angular';

declare const AWS: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private unauthCreds: any;
  config: any = new AwsConfig().load();
  private poolData: ICognitoUserPoolData;
  private userPool: CognitoUserPool;
  private _cognitoUser: CognitoUser;
  private session: CognitoUserSession;
  private _signoutSubject: Subject<string> = new Subject<string>();
  private _signinSubject: Subject<string> = new Subject<string>();

  constructor(private router: Router,  public toastController: ToastController) {
    AWS.config.region = this.config.region;
    this.poolData = { UserPoolId: this.config.userPoolId, ClientId: this.config.appId };
    this.userPool = new CognitoUserPool(this.poolData);
    this.refreshOrResetCreds();
  }

  get signoutNotification() { return Observable.create( fn => this._signoutSubject.subscribe(fn) ); }
  get signinNotification() { return Observable.create( fn => this._signinSubject.subscribe(fn) ); }
  get cognitoUser(): CognitoUser { return this._cognitoUser; }
  get currentIdentity(): string { return AWS.config.credentials.identityId; }
  isUserSignedIn(): boolean { return this._cognitoUser !== null; }

  private refreshOrResetCreds() {
    this._cognitoUser = this.userPool.getCurrentUser();

    if (this._cognitoUser !== null) {
      this.refreshSession();
    } else {
      this.resetCreds();
    }
  }

  private setCredentials(newCreds) {
    AWS.config.credentials = newCreds;
  }

  private buildCreds() {
    AWS.config.region =  this.config.region;
    const token = this.session.getIdToken().getJwtToken();
    const key = this.config.idpURL + '/' + this.config.userPoolId;
    const json = { IdentityPoolId: this.config.identityPool, Logins: {} };
    json.Logins[key] = token;
    const creds = new AWS.CognitoIdentityCredentials({
      Logins : {
         key : token
      },
      IdentityPoolId: this.config.identityPool,
    });
    return creds;
  }

  private saveCreds(session, cognitoUser?): void {
    this.session = session;
    if (cognitoUser) { this._cognitoUser = cognitoUser; }
    this.setCredentials(this.buildCreds());
  }

  private getNewCognitoUser(creds): CognitoUser {
    return new CognitoUser({ Username: creds.email, Pool: this.userPool });
  }

  private authDetails(creds): AuthenticationDetails {
    return new AuthenticationDetails({ Username: creds.email, Password: creds.password });
  }

  private refreshSession(): Promise<CognitoUserSession> {
    return new Promise ((resolve, reject) => {
      this._cognitoUser.getSession((err, session) => {
        if (err) { console.log('Error refreshing user session', err); return reject(err); }
        this.saveCreds(session);
        resolve(session);
      });
    });
  }

  private resetCreds(clearCache: boolean = false) {
    AWS.config.region = this.config.region;
    this._cognitoUser = null;
    this.unauthCreds = this.unauthCreds || new AWS.CognitoIdentityCredentials({ IdentityPoolId: this.config.identityPool });
    if (clearCache) { this.unauthCreds.clearCachedId(); }
    this.setCredentials(this.unauthCreds);
  }

 // Used for custom attributes
  private buildAttributes(creds): Array<CognitoUserAttribute> {
    const attributeEmail = new CognitoUserAttribute({Name: 'email', Value: creds.email});
    const attributeList = [];
    attributeList.push(attributeEmail);
    return attributeList;
  }

  private _getCreds(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        AWS.config.credentials.get((err) => {
          if (err) { return reject(err); }
          resolve(AWS.config.credentials);
        });
      } catch (e) { reject(e); }
    });
  }

  getCredentials(): Observable<any> {
    let result = null;
    if (this._cognitoUser === null) {result =  this._getCreds(); }
    else if (this.session && this.session.isValid()) {result = this._getCreds(); }
    else { result = this.refreshSession().then(this._getCreds); }
    return from(result);
  }

  // signs in a user and notifies subscribers of a sign-in event
  signin(creds): Observable<CognitoUser> {
    const cognitoUser = this.getNewCognitoUser(creds);
    return Observable.create(observer => {
      cognitoUser.authenticateUser(this.authDetails(creds), {
        onSuccess: (session) => {
          this._cognitoUser = cognitoUser;
          this.saveCreds(session, cognitoUser);
          this._signinSubject.next(cognitoUser.getUsername());
          observer.next(session);
          observer.complete();
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {},
        mfaRequired: (challengeName, challengeParameters) => {},
        customChallenge: (challengeParameters) => {},
        onFailure: (error => {
          observer.error(error);
        })
      });
    });
  }

  // signs out a user if they exist, resets credentials (falling back to guest access) and notifies subscribers of a sign-out event
  signout() {
    if (this._cognitoUser) {
      const name = this._cognitoUser.getUsername();
      this._cognitoUser.signOut();
      this._signoutSubject.next(name);
      this.resetCreds(true);
      this.router.navigateByUrl('/login');
    }
  }

  // registers a new user
  register(creds): Observable<CognitoUser> {
    console.log('register creds');
    console.log(creds);
    return Observable.create(observer => {
      this.userPool.signUp(creds.email, creds.password, this.buildAttributes(creds), null, (err, result) => {
        if (err) { return observer.error(err); }
        observer.next(result.user);
        observer.complete();
      });
    });
  }

  // confirms a user
  confirm(creds): Observable<CognitoUser> {
    const cognitoUser = this.getNewCognitoUser(creds);
    return Observable.create( observer => {
      cognitoUser.confirmRegistration(creds.confcode, true, (err, result) => {
        if (err) { return observer.error(err); }
        observer.next(result.CognitoUser);
        observer.complete();
      });
    });
  }
}
