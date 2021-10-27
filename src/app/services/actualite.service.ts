import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Actualite } from '../modeles/actualite';
import { Status } from './global.service';
import { UsersService } from './users.services';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  actualites: Actualite[] = [];
  messagesVisiteurs: Actualite[] = [];
  public actualitesSubject = new Subject<Actualite[]>();

  constructor(private angularFirestore: AngularFirestore,
              private usersService: UsersService,) { }

    emitActualites() {
      console.log('emit');
      this.actualitesSubject.next(this.actualites);
    }
  
    getActualites() {
      this.angularFirestore.collection('Actualites', a => a.where('status', '==', Status.visiteur)).get().subscribe(a => {
        this.messagesVisiteurs = a.docs.map(A => {
          const a = A.data() as Actualite;
          a.id = A.id;
          return a;
        })
        this.emitActualites();
      });
      this.angularFirestore.collection('Actualites', a => a.where('status', '==', Status.valide)).get().subscribe(a => {
        this.actualites = a.docs.map(A => {
          const a = A.data() as Actualite;
          a.id = A.id;
          return a;
        })
        this.emitActualites();
      });
    }

    getActualitesNonSelect() {
      return this.angularFirestore.collection('Actualites', a => a.where('status', '==', Status.initial)).get();
    }

    getActualite(id: string) {
      return this.angularFirestore.collection('Actualites').doc(id).get();
    }
  
    AddActualite(a: Actualite) {
      this.angularFirestore.collection('Actualites').add({
        auteur: a.auteur,
        titre: a.titre,
        sousTitre: a.sousTitre,
        texte: a.texte,
        date: a.date,
        photo: a.photo,
        status: a.status
      }).then(() => {
        this.getActualites();
      });
    }

    UpdateActualite(a: Actualite) {
      this.angularFirestore.collection('Actualites').doc(a.id).update({
        titre: a.titre,
        sousTitre: a.sousTitre,
        texte: a.texte,
      }).then(() => {
        this.getActualites();
      });
    }

    SupprimeActualite(a: Actualite) {
      this.angularFirestore.collection('Actualites').doc(a.id).update({
        status: Status.supprime
      }).then(() => {
        this.getActualites();
      });
    }

    DesactiveActualite(a: Actualite) {
      this.angularFirestore.collection('Actualites').doc(a.id).update({
        status: Status.initial
      }).then(() => {
        this.getActualites();
      });
    }

    ValideActualite(a: Actualite) {
      this.angularFirestore.collection('Actualites').doc(a.id).update({
        status: Status.valide
      }).then(() => {
        this.getActualites();
      });
    }
  }
