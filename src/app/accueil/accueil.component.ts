import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PhotosService } from '../services/photos.service';
import { GlobalService } from '../services/global.service';
import { Subscription } from 'rxjs';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Carousel } from '../modeles/carousel';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  @ViewChild('ngcarousel', { static: true })
  ngCarousel!: NgbCarousel;
  
  articles: Article[] = [];
  photos: Photo[] = [];
  articleCourant = 0;
  photoCourante = 0;
  public listePhotosCarousel: Carousel[] = []
  readonly pasPhotos = 4;
  readonly pasArticles = 4;
  pageCourantePhoto = 1;
  pageCouranteArticle = 1;
  nbPagesPhotos = 0;
  nbPagesArticles = 0;
  private photosSubscription: Subscription | undefined;
  private dataSubscription: Subscription | undefined;


  constructor(public globalService: GlobalService,
              private photosService: PhotosService,
              public authService: AuthService) { }

  // Initialisation de la page
  ngOnInit() {
    this.photosSubscription = this.photosService.photoSubject.subscribe(photos => {
      this.photos = photos as Photo[];
      this.nbPagesPhotos = Math.round(photos.length / this.pasPhotos);
      this.photosService.getPhotosCarousel().subscribe((c: any) => {
        this.listePhotosCarousel = c.docs.map((C: any) => {
          let photo = C.data() as Carousel;
          return photo;
        })
      });
    });

    this.dataSubscription = this.globalService.dataSubject.subscribe(b => {
      if (b)
        this.nbPagesArticles = Math.round(this.globalService.allArticles.length / this.pasArticles);
    });

    this.photosService.emitPhoto();
    this.globalService.emitDataChange();
  }

  ngOnDestroy() {
    if(this.photosSubscription != null) {
      this.photosSubscription.unsubscribe();
    }
    if(this.dataSubscription != null) {
      this.dataSubscription.unsubscribe();
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
