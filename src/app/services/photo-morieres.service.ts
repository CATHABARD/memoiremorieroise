import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { PhotoMorieres } from '../modeles/photosMorières';
import { User } from '../modeles/user';
import { Status } from './global.service';
import { UsersService } from './users.services';

@Injectable({
  providedIn: 'root'
})
export class PhotoMorieresService {
  public photo: PhotoMorieres  | undefined;
  public photos: PhotoMorieres[] = []
  public photosAValider: PhotoMorieres[] = [];
  public currentPhoto: PhotoMorieres | undefined;
  photoMorieresSubject = new Subject<PhotoMorieres[]>();

  emitPhotoMorieres() {
    this.photoMorieresSubject.next(this.photos);
  }

  constructor(private angularFirestore: AngularFirestore,
              private usersService: UsersService) { } 

  public addPhotoMorieres(p: PhotoMorieres) {
    this.angularFirestore.collection('/PhotosMorieres').add({
      periode: p.periode,
      auteur: p.auteur,
      texte: p.texte,
      photo: p.photo,
      titre: p.titre,
      status: Status.initial
    });
  }

  getPhotosMorieres() {
    return this.angularFirestore.collection('/PhotosMorieres', p => p.where('status', '==', Status.valide)).get().subscribe(photos => {
      this.photos = photos.docs.map(P => {
        let photo = P.data() as PhotoMorieres;
        photo.id = P.id;
        return photo;
      })
      if (this.photos.length > 0) {
        this.currentPhoto = this.photos[0];
      }

      // recherche du nom de l'auteur
      this.photos.forEach(p => {
        this.usersService.getUserByUid(p.auteur!.trim()).subscribe(u => {
          u.docs.filter((U: any) => {
            p.nomAuteur = (U.data() as User).prenom;
          });
        })
      })
      
      this.emitPhotoMorieres();
    });
  }

  getPhotoMorieres(id: string) {
    return this.angularFirestore.collection('/PhotosMorieres').doc(id).get();
  }

  public updatePhotoMorieres(p: PhotoMorieres) {
    console.log(p);
    this.angularFirestore.collection('/PhotosMorieres').doc(p.id).update(
      {
        auteur: p.auteur,
        titre: p.titre,
        periode: p.periode,
        texte: p.texte,
        photo: p.photo,
        status: p.status
      });
  }

  public getPhotosMorieresAValider() {
    return this.angularFirestore.collection('/PhotosMorieres', p => p.where('status', '==', 0)).get()
  }

  public validerPhotoMorieres(p: PhotoMorieres) {
    return this.angularFirestore.collection('/PhotosMorieres').doc(p.id).update({
      status: Status.valide
    });
  }

  public rejeterPhotoMorieres(p: PhotoMorieres) {
    return this.angularFirestore.collection('/PhotosMorieres').doc(p.id).update({
      status: Status.rejete
    });
  }


}
