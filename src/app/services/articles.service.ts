import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Article } from '../modeles/article';
import { Theme } from '../modeles/themes';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  public currentArticle: Article | undefined;
  public articles: Article[] = [];
  public articlesSubject = new Subject<Article[]>();

  constructor(private angularFirestore: AngularFirestore) { }

  emitArticles() {
    this.articlesSubject.next(this.articles);
  }

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
      this.angularFirestore.collection('Articles', a => a.where('status', '>', Status.initial)).get().subscribe(a => {
        this.articles = a.docs.map(A => {
          const d = A.data() as Article;
          d.id = A.id;
          return d;
        })
        this.emitArticles();
      });
  }

  getArticle(id: string) {
    return this.angularFirestore.collection('Articles').doc(id).get();
  }

  getArticlesDuTheme(theme: Theme) {
    this.angularFirestore.collection('Articles', a => a.where('idTheme', '==', theme.id).where('status', '==', Status.valide)).get().subscribe(a => {
      theme.articles = a.docs.map(A => {
        const d = A.data() as Article;
        d.id = A.id;
        return d;
      });
    });
    if(this.articles.length > 0) {
      this.currentArticle = this.articles[0];
    }
  }

  getArticlesAValider(): Observable<firebase.default.firestore.QuerySnapshot<unknown>> {
    return this.angularFirestore.collection('Articles', a => a.where('status', '==', Status.initial)).get();
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