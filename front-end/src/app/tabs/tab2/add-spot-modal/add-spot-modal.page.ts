import { ImageService } from '../image.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-add-spot-modal',
  templateUrl: './add-spot-modal.page.html',
  styleUrls: ['./add-spot-modal.page.scss'],
})
export class AddSpotModalModalPage implements OnInit {
  @Input() newSpotLocation: any;
  form: FormGroup;
  image: string;
  uploadUrl: string;

  constructor( private modalController: ModalController,
               private fb: FormBuilder,
               private actionSheetController: ActionSheetController,
               private camera: Camera,
               private file: File,
               private imageService: ImageService
              ) {
                this.form = this.fb.group({
                  name: ['', Validators.required],
                  description: ['', Validators.required]
               });
            }

  ionViewDidEnter() {}

  ionViewWillLeave() {
  }

  ngOnInit() {
    this.imageService.getImages().subscribe(((data: any) => {
      this.uploadUrl = data.uploadUrl;
    }));
    this.form.valueChanges.pipe(debounceTime(200)).subscribe();
  }

  pickImage(sourceType: any) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = imageData;
      // this.imageService.uploadImage(imageData);
      this.file.resolveLocalFilesystemUrl(imageData).then(result => {
          this.resolveFileEntry(result);
      }).catch(err => {console.error('Error resolving the file system url'); });
    }, (err) => {
      // Handle error
    });
  }

  resolveFileEntry(res) {
    res.file((resFile) => {
     const reader = this.getFileReader();
     console.log(reader);
     reader.readAsDataURL(resFile);
     reader.onload = (e: any) => {
        // The file's text will be printed here
      console.log(e.target.result);
     };
    });
  }

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any).__zone_symbol__originalInstance;
    return zoneOriginalInstance || fileReader;
}

  async addDSpot() {
    await this.modalController.dismiss({ ...this.form.value, newSpotLocation: this.newSpotLocation});
  }

  async close() {
    await this.modalController.dismiss();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Image Source',
      buttons: [{
        text: 'Camera Roll',
        icon: 'albums',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
