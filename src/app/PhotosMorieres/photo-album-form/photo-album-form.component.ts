import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from 'src/app/modeles/user';
import { AuthService } from 'src/app/services/auth.service';
import { Droits } from 'src/app/services/global.service';
import { PhotoMorieresService } from 'src/app/services/photo-morieres.service';
import { PhotoMorieres } from '../../modeles/photosMorières';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-album-form',
  templateUrl: './photo-album-form.component.html',
  styleUrls: ['./photo-album-form.component.css']
})
export class PhotoAlbumFormComponent implements OnInit {
  @Input() photo: PhotoMorieres | undefined;

  uploadPercent = 0;

  addPhotoForm: FormGroup;
  errorMessage: string = '';
  currentUser: User | undefined;
  public isConnected = false;
  public canWrite = false;

  fileIsUploading = false;
  fileUrl: string = '';
  fileUploaded = false;
  readonly maxSize = 104857600;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map(result => result.matches)
  );

  private userSubscription: Subscription;


  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private photosService: PhotoMorieresService,
              private location: Location,
              private angularFireStorage: AngularFireStorage,
              private breakpointObserver: BreakpointObserver,
              private matDialog: MatDialog) {
                if (this.photo == undefined) {
                  this.photo = new PhotoMorieres('', undefined, this.authService.getCurrentUser()?.id, '', '', '');
                }
                if (this.photo?.photo == undefined) {
                  this.photo!.photo = '';
                }
                // S'il s'agit d'une création
                  this.addPhotoForm = this.formBuilder.group({
                    // , [Validators.required, FileValidator.maxContentSize(this.maxSize)]
                    photo: [undefined],
                    progressbar: ['Progression'],
                    titre: ['', [Validators.required, Validators.maxLength(50)]],
                    periode: ['', [Validators.required, Validators.maxLength(30)]],
                    texte: ['', [Validators.required, Validators.maxLength(3000)]]
                  });
                  this.fileUploaded = true;

                  this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
                    this.currentUser = u;
                    if (u != null) {
                      this.isConnected = (u != null && u.email?.trim() != authService.getVisiteur()?.trim());
                      if (this.isConnected) {
                        const d = u.status;
                        // tslint:disable-next-line:no-bitwise
                        if (d != undefined && (d & Droits.editArticle) == Droits.editArticle) {
                          this.canWrite = true;
                        } else {
                          this.canWrite = false;
                        }
                      } else {
                        this.canWrite = false;
                      }
                    }
                  })
                  authService.emitUserChanged();
              
  }
            
  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addPhotoForm.controls.photo.setValue(this.photo?.photo);
    this.addPhotoForm.controls.titre.setValue(this.photo?.titre);
    this.addPhotoForm.controls.texte.setValue(this.photo?.texte);
    this.addPhotoForm.controls.periode.setValue(this.photo?.periode);
  }

  onSubmit() {
    if (this.addPhotoForm?.invalid) {
      alert('Une valeur saisie est incorrecte.');
      return;
    }
    this.photo!.titre = this.addPhotoForm?.get('titre')?.value;
    this.photo!.periode = this.addPhotoForm?.get('periode')?.value;
    this.photo!.texte = this.addPhotoForm?.get('texte')?.value;

    // S'il s'agit d'une création
    if (this.photo!.id  === '') {
      this.photo!.photo = this.fileUrl;
      this.photo!.auteur = this.currentUser?.id;
      this.photo!.nomAuteur = this.authService.getCurrentUser()?.prenom;
      console.log(this.photo);
      this.photosService.addPhotoMorieres(this.photo!);
    } else { // S'il s'agit d'une modification
      this.photosService.updatePhotoMorieres(this.photo!);
    }
    this.photosService.getPhotosMorieres();
    this.location.back();
  }

    getErrorMessage(ctrl: string) {
      let msg = '';

      switch (ctrl) {
        case 'titre':
          if (this.addPhotoForm?.controls.titre.touched) {
            msg = this.addPhotoForm.controls.titre.hasError('required') ? 'Vous devez saisir un titre' : '';
          }
          break;
        case 'periode':
          if (this.addPhotoForm?.controls.periode.touched) {
            msg = this.addPhotoForm.controls.periode.hasError('required') ? 'Vous devez saisir une année' : '';
          }
          break;
        case 'listeEleves':
          if (this.addPhotoForm?.controls.texte.touched) {
            msg = this.addPhotoForm.controls.texte.hasError('required') ? 'Vous devez saisir un texte' : '';
          }
          break;
        case 'photo':
          if (this.addPhotoForm?.controls.photo.touched) {
            msg = this.addPhotoForm.controls.photo.hasError('required') ? 'Vous devez sélectionner une photo' : '';
          }
          break;
        }
      return msg;
    }

    onUpload(event: any) {
      this.fileIsUploading = true;
      const file = event.target.files[0];
      const filePath = 'PhotosMorieres/' + new Date().toJSON() + '_' + event.target.files[0].name;
      const fileRef = this.angularFireStorage.ref(filePath);
      const task = this.angularFireStorage.upload(filePath, file);
  
      task.percentageChanges().subscribe((val: any) => {
        this.uploadPercent = val as number;
      });
       task.then(() => {
        this.fileIsUploading = false;
        this.fileUploaded = true;
        fileRef.getDownloadURL().subscribe((name: any) => {
          this.fileUrl = name;
        })
      });
    }
}
