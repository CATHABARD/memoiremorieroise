import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Theme } from '../modeles/themes';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  listeThemes: Theme[] = [];
  public currentTheme: Theme | undefined;

  constructor(private angularFirestore: AngularFirestore) { }

  getThemes() {
    return this.angularFirestore.collection('Themes').get();
  }

  getTheme(id: string) {
    return this.angularFirestore.collection('Themes').doc(id).get();
  }

  addTheme(theme: Theme) {
    return this.angularFirestore.collection('Themes').add({
      nom: theme.nom,
      status: theme.status,
    });
  }

  public changeCurrentTheme(t: Theme) {
    this.currentTheme = t;
  }

  VideListeThemes() {
    this.listeThemes.splice(0);
    this.currentTheme = undefined;
  }

}
