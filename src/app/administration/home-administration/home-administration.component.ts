import { Component, OnInit, OnDestroy } from '@angular/core';
import { Droits } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PdfService } from 'src/app/services/pdf.service';
import { PhotosService } from 'src/app/services/photos.service';
import { shareReplay } from 'rxjs/operators';
import { Article } from 'src/app/modeles/article';
import { Pdf } from 'src/app/modeles/pdf';
import { Photo } from 'src/app/modeles/photo';
import { Actualite } from 'src/app/modeles/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PhotoMorieres } from 'src/app/modeles/photosMorières';
import { PhotoMorieresService } from 'src/app/services/photo-morieres.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-administration',
  templateUrl: './home-administration.component.html',
  styleUrls: ['./home-administration.component.scss']
})
export class HomeAdministrationComponent implements OnInit, OnDestroy {
  isAdmin = false;
  isEditArticle = false;
  isEditPhotosDeClasse = false;
  isEditPdf = false;
  isModerateur = false;
  
  totalAValider = 0;
  private actualitesSubscription: Subscription;
  private authSubscription: Subscription;
  private photosMorieresSubscription: Subscription;
  articlesAValider: Article[] = [];
  pdfsAValider: Pdf[] = [];
  photosAValider: Photo[] = [];
  actualites: Actualite[] = [];
  nonActualites: Actualite[] = [];
  photosMorieresAValider: PhotoMorieres[] = [];

  version: string = environment.version;

  constructor(private authService: AuthService,
              private articlesService: ArticlesService,
              private pdfService: PdfService,
              private photoService: PhotosService,
              private photosMorieresService: PhotoMorieresService,
              public actualiteService: ActualiteService,
              private router: Router,
              private matDialog: MatDialog) {
    this.authSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(data => {
      const user = this.authService.getCurrentUser();
      if( user != null && user != undefined ) {
        this.isEditArticle = (user.status! & Droits.editArticle) == Droits.editArticle;
        this.isEditPhotosDeClasse = (user.status! & Droits.editPhotosDeClasse) == Droits.editPhotosDeClasse;
        this.isEditPdf = (user.status! & Droits.editPdf) == Droits.editPdf;
        this.isAdmin = (user.status! & Droits.administrateur) == Droits.administrateur;
      }
    });

    this.actualitesSubscription = this.actualiteService.actualitesSubject.pipe(shareReplay(1)).subscribe(aa => {
      this.actualites = aa;
      this.actualiteService.getActualitesNonSelect().subscribe(na => {
        this.nonActualites = na.docs.map(NA => {
          const n = NA.data() as Actualite;
          n.id = NA.id;
          return n;
        });
      });
    });

    this.photosMorieresSubscription = this.photosMorieresService.photoMorieresAValiderSubject.pipe(shareReplay(1)).subscribe(pm => {
      this.photosMorieresAValider = pm;
    });
    this.actualiteService.emitActualites();
    this.photosMorieresService.getPhotosMorieresAValider();
  }

  ngOnInit() {
    let currentUser = this.authService.getCurrentUser();

    this.articlesService.getArticlesAValider().subscribe(Articles => {
      this.articlesAValider = Articles.docs.map(AAV => {
        const aav = AAV.data() as Article;
        aav.id = AAV.id;
        return aav;
      })
      this.pdfService.getListePdfAValider().subscribe(data => {
        this.pdfsAValider = data.docs.map(pdf => {
          const P = pdf.data() as Pdf;
          P.id = pdf.id;
          return P;
        });
        this.photoService.getPhotosAValider().subscribe(data => {
          this.photosAValider = data.docs.map(photo => {
            const p = photo.data() as Photo;
            p.id = photo.id;
            return p;
          });
          this.totalAValider = this.articlesAValider.length + this.photosAValider.length + this.pdfService.pdfsAValider.length;
        });
      });
    });

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

    this.actualiteService.getActualites();
  }

  ngOnDestroy() {
    if(this.authSubscription != null) {
      this.authSubscription.unsubscribe();
    }
    if(this.photosMorieresSubscription != null) {
      this.photosMorieresSubscription.unsubscribe();
    }
    if(this.actualitesSubscription != null) {
      this.actualitesSubscription.unsubscribe();
    }
  }

  onValideArticle(a: Article) {
    this.articlesService.valideArticle(a);
    const i = this.articlesAValider.indexOf(a);
    this.articlesAValider.splice(i, 1);
  }
  
  onEditeArticle(a: Article) {
      this.router.navigate(['app-edit-article/', a.id]);
   }
  
  
  onRejeteArticle(a: Article) {
    this.articlesService.rejeteArticle(a)
    const i = this.articlesAValider.indexOf(a);
    this.articlesAValider.splice(i, 1);
  }

  onValidePhoto(p: Photo) {
    this.photoService.validerPhoto(p);
    const i = this.photosAValider.indexOf(p);
    this.photosAValider.splice(i, 1);
  }
  
  onEditePhoto(p: Photo) {
    this.router.navigate(['app-edit-photo-de-classe/', p.id]);
  }
  
  onRejetePhoto(p: Photo) {
    this.photoService.rejeterPhoto(p);
    const i = this.photosAValider.indexOf(p);
    this.photosAValider.splice(i, 1);
  }

  onValidePhotoMorieres(p: PhotoMorieres) {
    this.photosMorieresService.validerPhotoMorieres(p);
    const i = this.photosMorieresAValider.indexOf(p);
    this.photosMorieresAValider.splice(i, 1);
  }
  
  onRejetePhotoMorieres(p: PhotoMorieres) {
    this.photosMorieresService.rejeterPhotoMorieres(p);
    const i = this.photosMorieresAValider.indexOf(p);
    this.photosMorieresAValider.splice(i, 1);
  }

  onValidePdf(p: Pdf) {
    this.pdfService.validerPdf(p);
    const i = this.pdfsAValider.indexOf(p);
    this.pdfsAValider.splice(i, 1);
    this.pdfService.getPdfsValides();
  }
  
  onRejetePdf(p: Pdf) {
    this.pdfService.rejeterPdf(p);
    const i = this.pdfsAValider.indexOf(p);
    this.pdfsAValider.splice(i, 1);
  }

  onEditActualite(e: Actualite) {
    this.router.navigate(['app-edit-actualite/', e.id]);
  }

  onSupprimeActualite(a: Actualite) {
    this.actualiteService.SupprimeActualite(a);
  }

  onValideActualite(a: Actualite) {
    this.actualiteService.ValideActualite(a);
  }

  onDesactiveActualite(a: Actualite) {
    this.actualiteService.DesactiveActualite(a);
  }

  onAddActualite() {
    this.router.navigate(['app-add-actualite']);
  }
}
