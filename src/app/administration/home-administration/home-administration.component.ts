import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PdfService } from 'src/app/services/pdf.service';
import { PhotosService } from 'src/app/services/photos.service';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-home-administration',
  templateUrl: './home-administration.component.html',
  styleUrls: ['./home-administration.component.scss']
})
export class HomeAdministrationComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isEditArticle = false;
  isEditPhotosDeClasse = false;
  isModerateur = false;
  totalAValider = 0;
  authSubscription: Subscription;

  constructor(private router: Router,
              private globalService: GlobalService,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private pdfService: PdfService,
              private photoService: PhotosService,
              ) {
      this.authSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(data => {
        if (data != null) {
          if ((this.authService.getCurrentUser()?.status && Droits.administrateur) === Droits.administrateur) {
            this.isAdmin = true;
          } else {
            if ((this.authService.getCurrentUser()?.status && Droits.editArticle) === Droits.editArticle) {
              this.isEditArticle = true;
            }
            if ((this.authService.getCurrentUser()?.status && Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
              this.isEditPhotosDeClasse = true;
            }
            if ((this.authService.getCurrentUser()?.status && Droits.moderateur) === Droits.moderateur) {
              this.isModerateur = true;
            }
          }
        }
      });
  }

  ngOnInit() {
    let currentUser = this.authService.getCurrentUser();

    this.articlesService.getArticlesAValider();
    this.pdfService.getListePdfAValider();
    this.globalService.getPhotosAValider();

    this.totalAValider = this.globalService.ArticlesAValider.length + this.globalService.photosAValider.length + this.pdfService.pdfsAValider.length;
    if (currentUser && currentUser.status && (currentUser.status & Droits.administrateur) === Droits.administrateur) {
      this.isAdmin = true;
    } else {
      if (currentUser && currentUser.status && (currentUser.status & Droits.editArticle) == Droits.editArticle) {
        this.isEditArticle = true;
      }
      if (currentUser && currentUser.status && (currentUser.status & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
        this.isEditPhotosDeClasse = true;
      }
      if (currentUser && currentUser.status && (currentUser.status & Droits.moderateur) === Droits.moderateur) {
        this.isModerateur = true;
      }
    }
}

ngOnDestroy() {
  this.authSubscription.unsubscribe();
}

  openValidateDialog(): void {
    this.router.navigate(['app-valider-articles']);
  }

}
