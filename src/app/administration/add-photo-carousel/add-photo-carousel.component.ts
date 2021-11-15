import { Component, OnInit } from '@angular/core';
import { Carousel } from 'src/app/modeles/carousel';

@Component({
  selector: 'app-add-photo-carousel',
  templateUrl: './add-photo-carousel.component.html',
  styleUrls: ['./add-photo-carousel.component.css']
})
export class AddPhotoCarouselComponent implements OnInit {
  carousel: Carousel | undefined;

  constructor() {
    this.carousel = new Carousel('', 0, '', 0);
  }

  ngOnInit(): void {
  }

}
