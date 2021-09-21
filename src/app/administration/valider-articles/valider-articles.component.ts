import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../modeles/article';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Pdf } from '../../modeles/pdf';
import { Photo } from '../../modeles/photo';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-valider-articles',
  templateUrl: './valider-articles.component.html',
  styleUrls: ['./valider-articles.component.scss']
})
export class ValiderArticlesComponent implements OnInit, OnDestroy {
  public article: Article | undefined | null;
  public isConnected = false;
  public canWrite: boolean = false;

  authSubscription: Subscription;

  isAdmin = false;
  isEditArticle = false;
  isEditPhotosDeClasse = false;
  isModerateur = false;

  constructor(public globalService: GlobalService,
              public pdfService: PdfService,
              private authService: AuthService,
              private articlesService: ArticlesService) {
    this.authSubscription = this.authService.authSubject.subscribe(data => {
      if (data === true) {
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

  onValidePdf(p: Pdf) {
    this.pdfService.validerPdf(p);
  }

  onRejetePdf(p: Pdf) {
    this.pdfService.rejeterPdf(p);
  }

  onValidePhoto(p: Photo) {
    this.globalService.validerPhoto(p);
  }

  onRejetePhoto(p: Photo) {
    this.globalService.rejeterPhoto(p);
  }

}
