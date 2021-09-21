import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Article } from '../modeles/article';
import { Message } from '../modeles/message';
import { Photo } from '../modeles/photo';
import { Theme } from '../modeles/themes';
import { User } from '../modeles/user';
import { Observable, Subject, Subscription } from 'rxjs';
import { PhotosService } from './photos.service';
import { ArticlesService } from './articles.service';
import { UsersService } from './users.services';
import { ThemesService } from './themes.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

export interface FilesUploadMetadata {
  uploadProgress: Observable<number | undefined>;
  downloadUrl: Observable<string>;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  allArticles: Article[] = [];

  public currentArticle: any;
  public ArticlesAValider: Article[] = [];
  public photos: Photo[] = [];
  public photosAValider: Photo[] = [];

  public listeMessagesNonLus: Message[] = [];
  public listeMessagesLus: Message[] = [];

  public bytesTransfered: number = 0;

  private readonly userSubscription: Subscription | undefined;
  public readonly dataSubject = new Subject<boolean>();

  constructor(private photosService: PhotosService,
              private articlesService: ArticlesService,
              private usersService: UsersService,
              private themesService: ThemesService,
              private authService: AuthService,
              private angularFirestore: AngularFirestore) {
      this.userSubscription = this.authService.authSubject.subscribe(u => {
        if(u.status != undefined && u.status >= Status.initial) {
          this.initData().then(() => {
            this.emitDataChange();
          })
        }

      })
  }

  ngOnDestroy() {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  emitDataChange() {
      this.dataSubject.next();
  }

  public initData() {
    return new Promise((resolve, reject) => {
        // Chargement des thèmes
       this.themesService.getThemes().subscribe(t => {
          this.themesService.listeThemes = t.docs.map(e => {
          const T = e.data() as Theme;
          T.id = e. id;
          return T;
        })
        // chargement des articles des thèmes
        if (this.themesService.listeThemes) {
          this.themesService.currentTheme = this.themesService.listeThemes[0];
          this.themesService.listeThemes.forEach(T => {
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
                    reject(error);
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
        resolve(this.themesService.listeThemes);
      },
      (error) => {
        console.log('Erreur dans le chergement des thèmes.\n' + error.message);
        reject(error);
      }) // fin bloc des thèmes
      // Chargement des photos
      this.photosService.getPhotos()// fin du chargement des photos
      // Chargement de tous les articles
      this.articlesService.getArticles().subscribe(a => {
        this.allArticles = a.docs.map(e => {
          const A = e.data() as Article;
          A.id = e.id;
          return A;
        });
        if (this.allArticles) {
          this.allArticles.forEach((A: Article) => {
            if (A.auteur && A.auteur.length > 0) {
              this.usersService.getUserByUid(A.auteur).subscribe((u: any) => {
                u.docs.filter((U: any) => {
                  A.nomAuteur = (U.data() as User).prenom;
                })
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
  }

  // Thèmes
  ref: any;
  task: any;
  uploadFile(event: any) {

  }

  // photos
  public getPhotosByPeriode(debut: number, fin: number) {
    return this.angularFirestore.collection('Photos').get();
  }

  // Liste d'images
  public getPhotosDeClasseFromStorage() {
    return this.angularFirestore.collection('Classes').get();
  }

  public GetSinglePhotoFromDB(id: string) {
    return this.angularFirestore.collection('Photos').doc(id).get();
  }

  public getPhotosAValider() {
    this.angularFirestore.collection('Photos', p => p.where('status', '==', 0)).get().subscribe(data => {
      this.photosAValider = data.docs;
    });
  }

  public validerPhoto(p: Photo) {
    return this.angularFirestore.collection('Photos').doc(p.id).update({
      status: Status.valide
    });
  }

  public rejeterPhoto(p: Photo) {
    return this.angularFirestore.collection('Photos').doc(p.id).update({
      status: Status.rejete
    });
  }


  // pdf
  // Messages
  public getMessagesNonLus() {
    this.angularFirestore.collection('Message', m => m.where('lu', '==', false)).get().subscribe(data => {
      this.listeMessagesNonLus = data.docs.map(e => {
        const p = e.data() as Message;
        p.id = e.id;
        return p;
      });
    });
  }

  public addMessage(message: Message) {
    this.angularFirestore.collection('Message').add({
        date: message.date.toJSON(),
        email: message.email,
        texte: message.texte,
        lu: message.lu
      }).catch(error => {
        console.log('Erreur ' + error);
      });
    }

  public SoldeMessage(m: Message) {
    this.angularFirestore.collection('Message').doc(m.id).update({
      lu: true
    });
  }

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
