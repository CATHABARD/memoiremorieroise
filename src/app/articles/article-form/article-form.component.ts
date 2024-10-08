import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../modeles/article';
import { UntypedFormGroup, UntypedFormBuilder, Validators, Form } from '@angular/forms';
import { EditArticleComponent } from '../edit-article/edit-article.component';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { ThemesService } from 'src/app/services/themes.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

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

  color: ThemePalette = 'primary';
  form: UntypedFormGroup;
  errorMessage: string = '';
  fileIsUploading = false;
  fileUploaded = true;
  isFileAttached: boolean = false;

  uploadPercent: number | undefined;
  downloadURL: string | undefined;

  readonly maxSize = 100000000;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private formBuilder: UntypedFormBuilder,
              private angularFireStorage: AngularFireStorage,
              private themesService: ThemesService,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private router: Router,
              private breakpointObserver: BreakpointObserver,
              private location: Location) {
                  this.form = this.formBuilder.group({
                    photo: [{ value: this.article?.photo, visible: this.isFileAttached }],
                    progressbar: [{value: 'Progression', visible: this.isFileAttached }],
                    legende: ['', [Validators.maxLength(50)]],
                    titre: ['', [Validators.required, Validators.maxLength(60)]],
                    texte: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(6500)]],
                  });
                }
              

  ngOnInit() {
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
    this.themesService.getThemes();
    this.articlesService.getArticlesCurrentTheme();
    this.location.back();
  }

  onUpload(event: any) {
    this.fileIsUploading = true;
    const file = event.target.files[0];
    const filePath = 'Images/' + new Date().toJSON() + '_' + event.target.files[0].name;
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
}
