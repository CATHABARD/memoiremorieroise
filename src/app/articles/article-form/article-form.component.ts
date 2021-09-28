import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../modeles/article';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { EditArticleComponent } from '../edit-article/edit-article.component';
import { from, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize, map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { ThemesService } from 'src/app/services/themes.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UploadMetadata } from '@angular/fire/compat/storage/interfaces';

export interface FilesUploadMetadata {
  uploadProgress: Observable<number | undefined>;
  downloadUrl: Observable<string>;
}

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css'],
  providers: [EditArticleComponent]
})
export class ArticleFormComponent implements OnInit {
  @Input() article: Article | undefined;

  form: FormGroup;
  errorMessage: string = '';
  fileIsUploading = false;
  fileUploaded = true;
  isFileAttached: boolean = false;

  // uploadPercent: Observable<number | undefined> | undefined;
  uploadPercent: number | undefined;
  // downloadURL: Observable<string | undefined> | undefined;
  downloadURL: string | undefined;

  readonly maxSize = 100000000;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private formBuilder: FormBuilder,
              private angularFireStorage: AngularFireStorage,
              private themesService: ThemesService,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private location: Location,
              private breakpointObserver: BreakpointObserver) {
                  this.form = this.formBuilder.group({
                    photo: [{ value: this.article?.photo, visible: this.isFileAttached }],
                    progressbar: [{value: 'Progression', visible: this.isFileAttached }],
                    legende: ['', [Validators.maxLength(50)]],
                    titre: ['', [Validators.required, Validators.maxLength(60)]],
                    texte: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(6500)]]
                  });
                }
              

  ngOnInit() {
    this.initForm();
    (this.article?.photo != undefined)? this.downloadURL = this.article?.photo : '';
    this.form.controls.photo.setValue(this.downloadURL);
    this.form.controls.legende.setValue(this.article?.legende);
    this.form.controls.titre.setValue(this.article?.titre);
    this.form.controls.texte.setValue(this.article?.texte);
    if (this.article?.photo !== '') {
      this.isFileAttached = true;
    } else {
      this.isFileAttached = false;
    } 
}

  initForm() {
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
        if (this.form?.controls.titre.touched) {
          if (this.form?.controls.titre.hasError('required')) {
            msg = 'Vous devez saisir un titre.';
          }
          if (this.form?.controls.titre.hasError('maxlength')) {
            msg = 'Le titre ne doit pas comporter plus de 60 caractères.';
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

  onSubmit() {
    (this.article != undefined)? this.article.titre =  this.form?.get('titre')?.value : '';
    (this.article != undefined)? this.article.texte =  this.form?.get('texte')?.value : '';
    (this.article != undefined)? this.article.idTheme = this.themesService.currentTheme?.id : '';
    (this.article != undefined)? this.article.photo = this.downloadURL: '';
    (this.article != undefined)? this.article.legende = this.form?.get('legende')?.value : '';
    // Ajouter un article
    if (this.article?.id === '') {
      this.article.auteur = this.authService.getCurrentUser()?.uid;
      this.articlesService.addArticle(this.article).then(res => {
        alert('Merci pour cet article qui sera trés prochainement publié.');
      });
    } else { // mettre un article à jour
      this.articlesService.updateArticle(this.article!).then(res => {
      });
    }
    this.location.back();
  }

  onUpload(event: any) {
    const file = event.target.files[0];
    const filePath = 'Images/';
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(filePath, file);

    task.percentageChanges().subscribe(val => {
      this.uploadPercent = val;
    });

    task.snapshotChanges().pipe(
        finalize(() => fileRef.getDownloadURL().subscribe(path => {
          this.downloadURL = path;
        }))
     );
  }
}
