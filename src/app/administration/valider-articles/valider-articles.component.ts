import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Article } from '../../modeles/article';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Pdf } from '../../modeles/pdf';
import { Photo } from '../../modeles/photo';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PdfService } from 'src/app/services/pdf.service';
import { PhotosService } from 'src/app/services/photos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMaximiseArticleImageComponent } from 'src/app/articles/liste-articles/liste-articles.component';

@Component({
  selector: 'app-valider-articles',
  templateUrl: './valider-articles.component.html',
  styleUrls: ['./valider-articles.component.scss']
})
export class ValiderArticlesComponent implements OnInit, OnDestroy {
  @Input() articlesAValider: Article[] = [];
  
  public article: Article | undefined | null;
  public isConnected = false;
  public canWrite: boolean = false;

  private authSubscription: Subscription;

  isAdmin = false;
  isEditArticle = false;
  isEditPhotosDeClasse = false;
  isModerateur = false;

  pdfsAValider: Pdf[] = [];

  constructor(public globalService: GlobalService,
              public pdfService: PdfService,
              public photosService: PhotosService,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private matDialog: MatDialog) {
    this.authSubscription = this.authService.authSubject.subscribe(data => {
      if (data != null) {
        let currentUser = this.authService.getCurrentUser();
        // tslint:disable-next-line:no-bitwise
        if (currentUser && currentUser.status && (currentUser.status & Droits.administrateur) === Droits.administrateur) {
          this.isAdmin = true;
        } else {
          // tslint:disable-next-line:no-bitwise
          if (currentUser && currentUser.status && (currentUser.status & Droits.editArticle) === Droits.editArticle) {
            this.isEditArticle = true;
          }
          // tslint:disable-next-line:no-bitwise
          if (currentUser && currentUser.status && (currentUser.status & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
            this.isEditPhotosDeClasse = true;
          }
          // tslint:disable-next-line:no-bitwise
          if (currentUser && currentUser.status && (currentUser.status & Droits.moderateur) === Droits.moderateur) {
            this.isModerateur = true;
          }
        }
      }
    });
    this.authService.emitUserChanged();
  }

  ngOnInit() {
    this.articlesService.getArticlesAValider().subscribe(Articles => {
      this.articlesAValider = Articles.docs as Article[];
    });
    this.pdfService.getListePdfAValider().subscribe(data => {
      this.pdfsAValider = data.docs;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription != null) {
      this.authSubscription.unsubscribe();
    }
  }

  onValideArticle(a: Article) {
    this.articlesService.valideArticle(a).then(data => {

    }).catch(error => {
      console.log(error);
    });
  }

  onRejeteArticle(a: Article) {
    this.articlesService.rejeteArticle(a).then(data => {

    }).catch(error => {
      console.log(error);
    });
  }

  onEditeArticle(a: Article) {
    this.articlesService.currentArticle = a;
    const dialogRef = this.matDialog.open(DialogMaximiseArticleImageComponent, {
      height: '90%',
      width: '60%'
    });
  }

  onValidePdf(p: Pdf) {
    this.pdfService.validerPdf(p);
    this.pdfService.getPdfs();
  }

  onRejetePdf(p: Pdf) {
    this.pdfService.rejeterPdf(p);
  }

  onValidePhoto(p: Photo) {
    this.photosService.validerPhoto(p);
    this.photosService.getPhotos();
  }

  onRejetePhoto(p: Photo) {
    this.photosService.rejeterPhoto(p);
  }
}
