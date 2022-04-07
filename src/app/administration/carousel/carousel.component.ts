import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Carousel } from 'src/app/modeles/carousel';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  photos: Carousel[] = [];
  photosCarouselSubscription: Subscription | undefined;

  constructor(public photosService: PhotosService,
              private router: Router,
    ) {
    this.photosCarouselSubscription = this.photosService.photosCarouselSubject.subscribe(pc => {
      this.photos = pc.map(PC => {
        let p = PC as Carousel;
        p.id = PC.id;
        return p;
      })
    })
  }

  ngOnInit(): void {
    this.photosService.getPhotosCarousel();
  }

  ngOnDestroy(): void {
    if(this.photosCarouselSubscription != null) {
      this.photosCarouselSubscription?.unsubscribe();
    }
  }

  onMonte(p: Carousel) {

  }

  onDescend(p: Carousel) {
    let I: number;
    for(I=0 ; I<this.photos.length; I++) {
      if(this.photos[I].numero == p.numero) {
        break;
      }
    }
    let items = this.photos.splice(I, 2);
    items[1].numero = p.numero!;
    items[0].numero = p.numero! + 1;
    this.photosService.updatePhotoCarousel(items[0]).then(() => {
      this.photosService.updatePhotoCarousel(items[1]).then(() => {
        this.photosService.getPhotosCarousel();
      });
    });
  }

  onAddPhoto() {
    this.router.navigate(['app-add-photo-carousel']);
  }
}
