import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Article } from '../modeles/article';
import { Theme } from '../modeles/themes';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';
import { UsersService } from './users.services';
import { User } from '../modeles/user';
import { ThemesService } from './themes.service';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  public currentArticle: Article | undefined;
  public articles: Article[] = [];
  public articlesSubject = new Subject<Article[]>();

  constructor(private angularFirestore: AngularFirestore,
              private usersService: UsersService,
              private themesService: ThemesService) { }

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

  getArticlesCurrentTheme() {
    this.angularFirestore.collection('Articles', a => a.where('idTheme', '==', this.themesService.currentTheme!.id).where('status', '==', Status.valide)).get().subscribe(a => {
      this.themesService.currentTheme!.articles = a.docs.map(A => {
        const d = A.data() as Article;
        d.id = A.id;
        return d;
      });
      // Trier sur le champ date
      this.themesService.currentTheme!.articles.sort((t1, t2) => {
        if(new Date(t1.date!) > new Date(t2.date!)) {
          return -1;
        } else {
          if(new Date(t1.date!) < new Date(t2.date!)) {
            return 1;
          } else {
            return 0;
          }
      }
      });
      // recherche du nom de l'auteur
      this.themesService.currentTheme!.articles!.forEach(a => {
        this.usersService.getUserByUid(a.auteur!.trim()).subscribe(u => {
          u.docs.filter((U: any) => {
            a.nomAuteur = (U.data() as User).prenom;
          });
        })
      })
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
    console.log(article.id);
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