import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Theme } from '../modeles/themes';
import { Status } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  public themes: Theme[] = [];
  public currentTheme: Theme | undefined;

  constructor(private angularFirestore: AngularFirestore) { }

  getThemes(): void {
    this.angularFirestore.collection('Themes', t => t.where('status', '==', Status.valide)).get().subscribe(t => {
      this.themes = t.docs.map(T => {
        const V = T.data() as Theme;
        V.id = T.id;
        return V;
      })
    });
    if(this.themes.length > 0 && this.currentTheme == undefined) {
      this.currentTheme = this.themes[0];
    }
  }

  getTheme(id: string): Observable<firebase.default.firestore.DocumentSnapshot<unknown>> {
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
    this.themes.splice(0);
    this.currentTheme = undefined;
  }

}
