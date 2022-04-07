import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vue } from '../modeles/vue';

@Injectable({
  providedIn: 'root'
})
export class VueService {
  public currentIdVue = '';

  constructor(private angularFirestore: AngularFirestore) {

  }

  ngOnInit() {
  }

  getVuesConnexion(idConnexion: string) {
    return this.angularFirestore.collection('Vues', v => v.where('idConnexion', '==', idConnexion)).get();
  }

  addVue(idConnexion: string, page: string) {
    this.angularFirestore.collection('Vues').add({
      idConnexion: idConnexion,
      heureDebut: new Date().toJSON(),
      heureFin: '',
      page: page
    }).then(v => {
      this.currentIdVue =  v.id;
    })
  }

  finDeVue() {
    if(this.currentIdVue == '')
      return undefined;
    return this.angularFirestore.collection('Vues').doc(this.currentIdVue).update({
      heureFin: new Date().toJSON()
    });
  }

  deleteAll() {
    let vues: Vue[] = [];
    this.angularFirestore.collection('Vues').get().subscribe(c => {
      vues = c.docs.map(C => {
        let Co = C.data() as Vue;
        Co.id = C.id;
        return Co;
      })
      vues.forEach(c => {
        this.angularFirestore.collection('Vues').doc(c.id).delete().then();
      });
    });
  }

}
