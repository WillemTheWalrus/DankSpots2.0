import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-spot-modal',
  templateUrl: './add-spot-modal.page.html',
  styleUrls: ['./add-spot-modal.page.scss'],
})
export class AddSpotModalModalPage implements OnInit {
  // toDo: move to shared module
  constructor( private modalController: ModalController, private fb: FormBuilder) { }
  @Input() newSpotLocation: any;
  form: FormGroup;

  ionViewDidEnter() {}

  ionViewWillLeave() {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name:  ['', Validators.required]
   });
    this.form.valueChanges.pipe(debounceTime(200)).subscribe();
  }

  get isFormValid() {
    return this.form.invalid;
  }

  async closeModal() {
    await this.modalController.dismiss({ ...this.form.value, newSpotLocation: this.newSpotLocation});
  }

  async close() {
    await this.modalController.dismiss();
  }

}
