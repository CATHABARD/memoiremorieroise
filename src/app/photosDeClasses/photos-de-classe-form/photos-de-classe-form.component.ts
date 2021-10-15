import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Photo } from '../../modeles/photo';
import { Droits } from 'src/app/services/global.service';
import { Location } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PhotosService } from 'src/app/services/photos.service';
import { User } from 'src/app/modeles/user';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-photos-de-classe-form',
  templateUrl: './photos-de-classe-form.component.html',
  styleUrls: ['./photos-de-classe-form.component.css']
})
export class PhotosDeClasseFormComponent implements OnInit {
  @Input() photo: Photo | undefined;

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
              private photosService: PhotosService,
              private location: Location,
              private angularFireStorage: AngularFireStorage,
              private breakpointObserver: BreakpointObserver) {
                if (this.photo == undefined) {
                  this.photo = new Photo('', undefined, this.authService.getCurrentUser()?.id, '', '', '');
                }
                if (this.photo.photo == undefined) {
                  this.photo.photo = '';
                }
                // S'il s'agit d'une création
                  this.addPhotoForm = this.formBuilder.group({
                    // , [Validators.required, FileValidator.maxContentSize(this.maxSize)]
                    photo: [undefined],
                    progressbar: ['Progression'],
                    legende: ['', [Validators.maxLength(50)]],
                    titre: ['', [Validators.required, Validators.maxLength(50)]],
                    annee: ['', [Validators.required, Validators.min(1900), Validators.max(2020)]],
                    listeEleves: ['', [Validators.required, Validators.maxLength(3000)]]
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
    this.addPhotoForm.controls.titre.setValue(this.photo?.titre);
    this.addPhotoForm.controls.listeEleves.setValue(this.photo?.listeEleves);
    this.addPhotoForm.controls.annee.setValue(this.photo?.annee);
  }

  onSubmit() {
    if (this.addPhotoForm?.invalid) {
      alert('Une valeur saisie est incorrecte.');
      return;
    }
    this.photo!.titre = this.addPhotoForm?.get('titre')?.value;
    this.photo!.annee = this.addPhotoForm?.get('annee')?.value;
    this.photo!.listeEleves = this.addPhotoForm?.get('listeEleves')?.value;

    // S'il s'agit d'une création
    if (this.photo!.id  === '') {
      this.photo!.photo = this.fileUrl;
      this.photo!.auteur = this.currentUser?.id;
      this.photo!.nomAuteur = this.authService.getCurrentUser()?.prenom;
      console.log(this.currentUser);
      this.photosService.addPhoto(this.photo!);
    } else { // S'il s'agit d'une modification
      this.photosService.updatePhoto(this.photo!);
    }
    this.photosService.getPhotos();
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
        case 'annee':
          if (this.addPhotoForm?.controls.annee.touched) {
            msg = this.addPhotoForm.controls.annee.hasError('required') ? 'Vous devez saisir une année' : '';
          }
          break;
        case 'listeEleves':
          if (this.addPhotoForm?.controls.listeEleves.touched) {
            msg = this.addPhotoForm.controls.listeEleves.hasError('required') ? 'Vous devez saisir une liste des élèves' : '';
          }
          break;
        case 'photo':
          if (this.addPhotoForm?.controls.photo.touched) {
            msg = this.addPhotoForm.controls.photo.hasError('required') ? 'Vous devez sélectionner une photo de classes' : '';
          }
          break;
        }
      return msg;
    }

    onUpload(event: any) {
      this.fileIsUploading = true;
      const file = event.target.files[0];
      const filePath = 'Classes/' + new Date().toJSON() + '_' + event.target.files[0].name;
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
