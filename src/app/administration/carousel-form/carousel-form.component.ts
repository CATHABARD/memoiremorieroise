import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Carousel } from 'src/app/modeles/carousel';
import { PhotosService } from 'src/app/services/photos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-carousel-form',
  templateUrl: './carousel-form.component.html',
  styleUrls: ['./carousel-form.component.css']
})
export class CarouselFormComponent implements OnInit {
  @Input() carousel: Carousel | undefined;
  form: UntypedFormGroup;
  isFileAttached: boolean = false;
  errorMessage: string = '';
  fileIsUploading = false;
  fileUploaded = true;
  uploadPercent: number | undefined;
  downloadURL: string | undefined;

  constructor(private formBuilder: UntypedFormBuilder,
              private angularFireStorage: AngularFireStorage,
              private location: Location,
              private photosService: PhotosService) {
    this.form = this.formBuilder.group({
      photo: [{ value: this.carousel?.path, visible: this.isFileAttached }],
      progressbar: [{value: 'Progression', visible: this.isFileAttached }],
    });
  }

  ngOnInit(): void {
    if (this.carousel?.path !== '') {
      this.isFileAttached = true;
    } else {
      this.isFileAttached = false;
    } 
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'photo':
        if (this.form?.controls.photo.touched) {
          msg = this.form?.controls.photo.hasError('maxSize') ? 'Vous devez sélectionner une photo de moins de 100mo' : '';
        }
        break;
      }
  }

  onUpload(event: any) {
    this.fileIsUploading = true;
    const file = event.target.files[0];
    const filePath = 'Accueil/' + new Date().toJSON() + '_' + event.target.files[0].name;
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(filePath, file);

    task.percentageChanges().subscribe(val => {
      this.uploadPercent = val;
    });
     task.then(() => {
      this.fileIsUploading = false;
      this.fileUploaded = true;
      fileRef.getDownloadURL().subscribe(name => {
        this.downloadURL = name;
        this.carousel!.path = name;
        this.isFileAttached = true;
      })
    })
  }

  onSubmit() {
    (this.carousel?.path == '')? this.carousel!.path = this.downloadURL : '';
    this.carousel!.numero = this.photosService.getNextNumero();

    // Ajouter un carousel
    if (this.carousel?.id === '') {
      this.photosService.addPhotoCarousel(this.carousel);
    } else { // mettre un carousel à jour
      this.photosService.updatePhotoCarousel(this.carousel!).then(() => {
      });
    }
    this.location.back();
  }
}
