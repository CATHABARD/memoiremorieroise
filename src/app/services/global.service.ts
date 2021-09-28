import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Theme } from '../modeles/themes';
import { User } from '../modeles/user';
import { Subject, Subscription } from 'rxjs';
import { PhotosService } from './photos.service';
import { ArticlesService } from './articles.service';
import { UsersService } from './users.services';
import { ThemesService } from './themes.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public photos: Photo[] = [];

  public bytesTransfered: number = 0;

  private readonly userSubscription: Subscription | undefined;
  public readonly themeSubject = new Subject<void>();
  public readonly articlesDuThemeSubject = new Subject<void>();

  constructor(private authService: AuthService) {
      this.userSubscription = this.authService.authSubject.subscribe(u => {
      })
  }

  /*
  ngOnDestroy() {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  emitThemesChange() {
      this.themeSubject.next();
  }

  emitArticlesDuThemeChange() {
    this.articlesDuThemeSubject.next();
}

public initThemes() {
    return new Promise((resolve, reject) => {
        // Chargement des thèmes
       this.themesService.getThemes().subscribe(t => {
          this.themesService.themes = t.docs.map(e => {
          const T = e.data() as Theme;
          T.id = e. id;
          return T;
        })
        // chargement des articles des thèmes
        if (this.themesService.themes) {
          this.themesService.currentTheme = this.themesService.themes[0];
          this.themesService.themes.forEach(T => {
            // chargement des articles du thème t
            this.articlesService.getArticlesDuTheme(T.id!).subscribe(at => {
              T.articles = at.docs.map(e => {
                  const a = e.data() as Article;
                  a.id = e.id;
                  return a;
              });
              T.articles?.forEach(a => {
                if (a.auteur && a.auteur.length > 0) {
                  this.usersService.getUserByUid(a.auteur).subscribe(u => {
                    u.docs.filter(U => {
                      a.nomAuteur = (U.data() as User).prenom;
                    })
                  },
                  (error: any) => {
                    console.log('Erreur du chargement de l\'auteur.\n' + error.message);
                    reject(error.message);
                  });
                }
              }); // fin de la boucle des articles du thème

              // console.log('fin de chargement des articles du thème');
           },
           (error: any) => {
             console.log('Erreur du chargement des articles du thème :\n' + error.massage);
             reject(error.message);
           }) // recherche du nom de l'auteur de l'article
          }) // fin boucle articles thèmes
        }
        resolve(this.themesService.themes);
        this.emitThemesChange();
      },
      (error) => {
        console.log('Erreur dans le chergement des thèmes.\n' + error.message);
        reject(error);
      }) // fin bloc des thèmes
    });
  }

  initArticles() {
    return new Promise((resolve, reject) => {
      // Chargement de tous les articles
      this.articlesService.getArticles().subscribe(a => {
        this.articlesService.articles = a.docs.map(e => {
          const A = e.data() as Article;
          A.id = e.id;
          return A;
        });
        if (this.articlesService.articles) {
          this.articlesService.articles.forEach((A: Article) => {
            if (A.auteur && A.auteur.length > 0) {
              this.usersService.getUserByUid(A.auteur).subscribe((u: any) => {
                u.docs.filter((U: any) => {
                  A.nomAuteur = (U.data() as User).prenom;
                });
                resolve(this.articlesService.articles);
                this.emitArticlesDuThemeChange();
              },
              (error: any) => {
                console.log('Erreur dans le chargement des auteurs.\n' + error.message)
                reject(error);
              })
            }
          })
        }
      })
    })
  } */

}

export enum Droits {
  visiteur = 1,
  moderateur = 2,
  editArticle = 4,
  editPhotosDeClasse = 8,
  administrateur = 0xFF
}

export enum Status {
  initial = 0,
  valide = 1,
  rejete = 0x100,
  supprime = 0x1000,
  visiteur = 0x10000
}
