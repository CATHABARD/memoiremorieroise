import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Photo } from '../modeles/photo';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  public photo: Photo  | undefined;
  private listePhotos: Photo[] = []
  public photosAValider: Photo[] = [];
  public currentPhoto: Photo | undefined;
  photoSubject = new Subject<Photo[]>();

  emitPhoto() {
    this.photoSubject.next(this.listePhotos);
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
      this.listePhotos = photos.docs.map(P => {
        let photo = P.data() as Photo;
        photo.id = P.id;
        return photo;
      })
      if (this.listePhotos.length > 0) {
        this.currentPhoto = this.listePhotos[0];
      }
      this.emitPhoto();
    });
  }

    getPhotosCarousel() {
    return this.angularFirestore.collection('Carousel').get();
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
