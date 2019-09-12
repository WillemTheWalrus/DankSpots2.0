import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // signs in a user and notifies subscribers of a sign-in event
  signin() {}

  // signs out a user if they exist, resets credentials (falling back to guest access) and notifies subscribers of a sign-out event
  signout() {}

  // registers a new user
  register() {}

  // confirms a user
  confirm() {}
}
