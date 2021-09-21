import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Article } from '../modeles/article';
import { Theme } from '../modeles/themes';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private currentArticle: Article | undefined;
  private articlesAValider: Article[] = [];

  constructor(private angularFirestore: AngularFirestore) { }

  public addArticle(article: Article) {
    return this.angularFirestore.collection('Articles').add({
      auteur: article.auteur,
      titre: article.titre,
      texte: article.texte,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      photo: article.photo,
      legende: article.legende,
      status: Status.initial
    });
  }

  getArticles() {
      return this.angularFirestore.collection('Articles').get();
  }

  getArticle(id: string) {
    return this.angularFirestore.collection('Articles').doc(id).get();
  }

  getArticlesDuTheme(idTheme: string) {
    return this.angularFirestore.collection('Articles', a => a.where('idTheme', '==', idTheme)).get();
  }

  async getArticlesAValider() {
    this.angularFirestore.collection('Articles', a => a.where('status', '>', 0)).get().subscribe(Articles => {
      this.articlesAValider = Articles.docs as Article[];
    });
  }

  valideArticle(article: Article) {
    return this.angularFirestore.collection('Articles').doc(article.id).update({
      status: Status.valide
    });
  }

  rejeteArticle(article: Article) {
    return this.angularFirestore.collection('Articles').doc(article.id).update({
      status: Status.rejete
    });
  }

  ChangeCurrentArticle(a: Article) {
    this.currentArticle = a;
  }

  AddArticleToTheme(a: Article, t: Theme) {
    t.articles!.push(a);
    return this.addArticle(a);
  }

  updateArticle(article: Article) {
    if (article.photo === undefined) {
      return this.angularFirestore.collection('Articles').doc(article.id).update({
      titre: article.titre,
      texte: article.texte,
      legende: article.legende,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      status: article.status
    });
  } else {
    return this.angularFirestore.collection('Articles').doc(article.id).update({
      titre: article.titre,
      texte: article.texte,
      legende: article.legende,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      status: article.status,
      photo: article.photo
    });
  }
  }


}