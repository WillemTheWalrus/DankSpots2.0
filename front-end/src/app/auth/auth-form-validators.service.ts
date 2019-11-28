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
      username: ['dirtymuzz@gmail.com', Validators.required],
      password: ['11111111', [Validators.required]],
      email: ['dirtymuzz@gmail.com', Validators.email]
    });
    this.form.valueChanges.pipe(
      debounceTime(200)
    ).subscribe(() => this.updateErrorMessages());
  }

  static formErrors = {
    username: '',
    password: '',
    email: '',
  };
  static validationMessages = {
    username: {
      required: 'Username is required.'
    },
    password: {
      required: 'Password is required.',
    },
    email: {
      required: 'Email is required',
    }
  };
  form: FormGroup;

  private updateErrorMessages() {
    const form = this.form;
    each(omit(AuthFormValidatorsService.formErrors, ''), (msg, field) => {
      AuthFormValidatorsService.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = AuthFormValidatorsService.validationMessages[field];
        each(control.errors, (val, key) => {
          AuthFormValidatorsService.formErrors[field] = messages[key];
        });
      }
    });
  }
}
