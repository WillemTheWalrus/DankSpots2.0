import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { each, omit } from 'lodash-es/';

@Injectable({
  providedIn: 'root'
})
export class AuthFormValidatorsService {
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
    this.form.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(() => this.updateErrorMessages());
  }

  static loginFormErrors = {
    username: '',
    password: '',
  };
  static loginValidationMessages = {
    username: {
      required: 'Username is required.'
    },
    password: {
      required: 'Password is required.',
    },
  };
  form: FormGroup;

  private updateErrorMessages() {
    const form = this.form;
    each(omit(AuthFormValidatorsService.loginFormErrors, ''), (msg, field) => {
      AuthFormValidatorsService.loginFormErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = AuthFormValidatorsService.loginValidationMessages[field];
        each(control.errors, (val, key) => {
          AuthFormValidatorsService.loginFormErrors[field] = messages[key];
        });
      }
    });
  }
}
