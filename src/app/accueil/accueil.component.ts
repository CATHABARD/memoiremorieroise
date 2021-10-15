import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PhotosService } from '../services/photos.service';
import { Subscription } from 'rxjs';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { ArticlesService } from '../services/articles.service';
import { ActualiteService } from '../services/actualite.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  @ViewChild('ngcarousel', { static: true })
  ngCarousel!: NgbCarousel;
  
  // articles: Article[] = [];
  photos: Photo[] = [];
  articleCourant = 0;
  photoCourante = 0;
  readonly pasPhotos = 4;
  readonly pasArticles = 4;
  pageCourantePhoto = 1;
  pageCouranteArticle = 1;
  nbPagesPhotos = 0;
  nbPagesArticles = 0;
  private photosSubscription: Subscription | undefined;
  private articlesSubscription: Subscription | undefined;
  private actualitesSubscription: Subscription | undefined;
  private photosCarouselSubscription:  Subscription | undefined;


  constructor(public photosService: PhotosService,
              public articlesService: ArticlesService,
              public actualitesService: ActualiteService,
              public authService: AuthService) {
                this.articlesService.getArticles();
                this.photosService.getPhotos();
              }

  // Initialisation de la page
  ngOnInit() {
    this.photosSubscription = this.photosService.photoSubject.subscribe(photos => {
      this.photos = photos as Photo[];
      this.nbPagesPhotos = Math.round(photos.length / this.pasPhotos);
    });
    this.photosCarouselSubscription = this.photosService.photosCarouselSubject.subscribe(pc => {

    });
      this.articlesSubscription = this.articlesService.articlesSubject.subscribe(article => {
      this.nbPagesArticles = Math.round(this.articlesService.articles.length / this.pasArticles);
    });
    this.articlesService.emitArticles();
    this.actualitesSubscription = this.actualitesService.actualitesSubject.subscribe(actualites => {

    });
    this.photosService.getPhotosCarousel();
    this.actualitesService.getActualites();
  }

  ngOnDestroy() {
    if(this.photosSubscription != null) {
      this.photosSubscription.unsubscribe();
    }
    if(this.articlesSubscription != null) {
      this.articlesSubscription.unsubscribe();
    }
  }

  onDecrementePhoto() {
    this.photoCourante -= this.pasPhotos;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos) + 1; 
    console.log(this.photoCourante);
  }

  onIncrementePhoto() {
    this.photoCourante += this.pasArticles;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos) + 1;
    console.log(this.photoCourante);
}

  onDecrementeArticle() {
    this.articleCourant -= this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles) + 1;
  }

  onIncrementeArticle() {
    this.articleCourant += this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles) + 1;
  }



  prevSlide() {
    this.ngCarousel.prev();
  }

  nextSlide() {
    this.ngCarousel.next();
  }

  stopSlider() {
    this.ngCarousel.pause();
  }


}
