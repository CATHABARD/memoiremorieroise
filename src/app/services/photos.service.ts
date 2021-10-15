import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Photo } from '../modeles/photo';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Carousel } from '../modeles/carousel';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  public photo: Photo  | undefined;
  public photos: Photo[] = []
  public photosCarousel: Carousel[] = []
  public photosAValider: Photo[] = [];
  public currentPhoto: Photo | undefined;
  photoSubject = new Subject<Photo[]>();
  photosCarouselSubject = new Subject<Carousel[]>();

  emitPhoto() {
    this.photoSubject.next(this.photos);
  }

  emitPhotoCarousel() {
    this.photosCarouselSubject.next(this.photosCarousel);
  }

  constructor(private angularFirestore: AngularFirestore) { } 

  public addPhoto(p: Photo) {
    this.angularFirestore.collection('Photos').add({
      annee: p.annee,
      auteur: p.auteur,
      listeEleves: p.listeEleves,
      photo: p.photo,
      titre: p.titre,
      status: Status.initial
    });
  }

  getPhotos() {
    return this.angularFirestore.collection('Photos').get().subscribe(photos => {
      this.photos = photos.docs.map(P => {
        let photo = P.data() as Photo;
        photo.id = P.id;
        return photo;
      })
      if (this.photos.length > 0) {
        this.currentPhoto = this.photos[0];
      }
      this.emitPhoto();
    });
  }

    getPhotosCarousel() {
      this.angularFirestore.collection('Carousel', p => p.orderBy('indice')).get().subscribe(pc => {
        this.photosCarousel = pc.docs.map(PC => {
          let p = PC.data() as Carousel;
          p.id = PC.id;
          return p;
        })
      });
      this.emitPhotoCarousel();
  }

  getPhoto(id: string) {
    return this.angularFirestore.collection('Photos').doc(id).get();
  }

  public getPhotosByPeriode(debut: number, fin: number) {
    return this.angularFirestore.collection('Photos').get();
  }

  public updatePhoto(p: Photo) {
    console.log(p);
    this.angularFirestore.collection('Photos').doc(p.id).update(
      {
        auteur: p.auteur,
        titre: p.titre,
        annee: p.annee,
        listeEleves: p.listeEleves,
        photo: p.photo,
        status: p.status
      });
  }

  public getPhotosAValider() {
    return this.angularFirestore.collection('Photos', p => p.where('status', '==', 0)).get()
  }

  public validerPhoto(p: Photo) {
    return this.angularFirestore.collection('Photos').doc(p.id).update({
      status: Status.valide
    });
  }

  public rejeterPhoto(p: Photo) {
    return this.angularFirestore.collection('Photos').doc(p.id).update({
      status: Status.rejete
    });
  }

}
