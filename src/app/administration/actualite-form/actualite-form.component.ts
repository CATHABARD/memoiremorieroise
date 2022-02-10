import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/modeles/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';

@Component({
  selector: 'app-actualite-form',
  templateUrl: './actualite-form.component.html',
  styleUrls: ['./actualite-form.component.css']
})
export class ActualiteFormComponent implements OnInit {
  @Input() actualite: Actualite | undefined;

  form: FormGroup;
  errorMessage: string = '';
  fileIsUploading = false;
  fileUploaded = true;
  isFileAttached: boolean = false;

  uploadPercent: number | undefined;
  downloadURL = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private actualiteService: ActualiteService,
              private angularFireStorage: AngularFireStorage) {
                this.form = formBuilder.group({
                  photo: [{ value: this.actualite?.photo, visible: this.isFileAttached }],
                  progressbar: [{value: 'Progression', visible: this.isFileAttached }],
                  titre: ['', [Validators.maxLength(20), Validators.required]],
                  sousTitre: ['', [Validators.maxLength(30)]],
                  texte: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(6500)]],
                })
              }

  ngOnInit(): void {
    if(this.actualite?.photo != '') {
      this.isFileAttached = true;
    }

this.form.controls.titre.setValue(this.actualite?.titre);
    this.form.controls.sousTitre.setValue(this.actualite?.sousTitre);
    this.form.controls.texte.setValue(this.actualite?.texte);
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'photo':
        if (this.form?.controls.photo.touched) {
          msg = this.form?.controls.photo.hasError('maxSize') ? 'Vous devez sélectionner une photo de moins de 100mo' : '';
        }
        break;
      case 'titre':
        if (this.form?.controls.sousTitre.touched) {
          if (this.form?.controls.sousTitre.hasError('maxlength')) {
            msg = 'Le titre ne doit pas comporter plus de 20 caractères.';
          }
        }
        break;
        case 'sousTitre':
          if (this.form?.controls.titre.touched) {
            if (this.form?.controls.titre.hasError('required')) {
              msg = 'Vous devez saisir un titre.';
            }
            if (this.form?.controls.titre.hasError('maxlength')) {
              msg = 'Le sous-titre ne doit pas comporter plus de 30 caractères.';
            }
          }
          break;
        case 'texte':
        if (this.form?.controls.texte.touched) {
          if (this.form?.controls.texte.hasError('required')) {
            msg = 'Vous devez saisir un texte.';
          }
          if (this.form?.controls.texte.hasError('minlength')) {
            msg = 'Le texte doit comporter plus de 20 caractères.';
          }
          if (this.form?.controls.texte.hasError('maxlength')) {
            msg = 'Le texte ne doit pas comporter plus de 6500 caractères.';
          }
        }
        break;
      }
    return msg;
  }

  onUpload(event: any) {
    this.fileIsUploading = true;
    const file = event.target.files[0];
    const filePath = 'Actualites/' + new Date().toJSON() + '_' + event.target.files[0].name;
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
      })
    })
  }

  onSubmit() {
    
    this.actualite!.titre = this.form.controls.titre.value;
    this.actualite!.sousTitre = this.form.controls.sousTitre.value;
    this.actualite!.texte = this.form.controls.texte.value;
    // Si l'actu est nouvelle
    if(this.actualite?.id == '') {
      this.actualite.photo = this.downloadURL;
      this.actualiteService.AddActualite(this.actualite);
    } else {
      // Update
      
      if(this.downloadURL != '')
        this.actualite!.photo = this.downloadURL;
      this.actualiteService.UpdateActualite(this.actualite!);
    }
    this.router.navigate(['app-home-administration']);  
  }

  onQuit() {

  }

}
