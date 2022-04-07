import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Connexion } from '../modeles/connexion';
import { User } from '../modeles/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConnexionsService implements OnInit, OnDestroy {
  private authSubscription: Subscription | undefined;

  constructor(private angularFirestore: AngularFirestore,
              public authService: AuthService) {
                this.authSubscription = this.authService.authSubject.subscribe(auth => {
                })
              }

  ngOnInit() {

  }

  ngOnDestroy() {
    if(this.authSubscription != null) {
      this.authSubscription.unsubscribe();
    }
  }

  public getConnexions() {
    return this.angularFirestore.collection('Connexions', c => c.orderBy('date', 'asc')).get();
  }

  public getConnexion(id: string) {
    return this.angularFirestore.collection('Connexions').doc(id).get();
  }

  updateConnexion(c: Connexion) {
    return this.angularFirestore.collection('Connexions').doc(c.id).update({
      idUser: c.idUser,
      identifie: c.identifie
    });
  }

  addConnexion(user: User) {
    return this.angularFirestore.collection('Connexions').add({
      date: new Date().toJSON(),
      idUser: user.id,
      identifie: false
    });
  }

  deleteAll() {
    let connexions: Connexion[] = [];
    this.angularFirestore.collection('Connexions').get().subscribe(c => {
      connexions = c.docs.map(C => {
        let Co = C.data() as Connexion;
        Co.id = C.id;
        return Co;
      })
      connexions.forEach(c => {
        this.angularFirestore.collection('Connexions').doc(c.id).delete().then();
      });
    });
  }
}
