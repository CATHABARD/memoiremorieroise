import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../modeles/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Droits, GlobalService, Status } from './global.service';
import { UsersService } from './users.services';
import { UserDatasComponent } from '../auth/user-datas/user-datas.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as auth from '@firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly visiteur = {email: 'memoiremorieroise@gmail.com',
                      password: 'MyPepita51',
                      id: 'A7Yrrs0jeYEtOwazT5L1'}

  userId: string = '';
  private currentUser: User | undefined | null;
  private status: number | undefined;

  authSubject = new Subject<User>();

  constructor(public dialog: MatDialog,
              public router: Router,
              public ngZone: NgZone,
              private usersService: UsersService,
              private angularFirestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth) {

  this.status = 0;
  this.angularFireAuth.onAuthStateChanged(newUser => {
    if(newUser == null) {
      this.signInVisiteur().then(u => {
        this.emitUserChanged();
      })
    } else {
      if(newUser.email == this.visiteur.email) { // Visiteur est connecté
        this.currentUser = new User(this.visiteur.id,
                                    newUser.uid,
                                    'Visiteur',
                                    'Visiteur',
                                    'Visiteur',
                                    true,
                                    Status.visiteur);
          this.emitUserChanged();
        } else {
          let o = usersService.getUserByUid(newUser.uid).subscribe((user: any) => {
            if(user && user.docs.length > 0) {
              this.currentUser = new User(user.docs[0].id,
                                          newUser.uid,
                                          (user.docs[0].data() as User).nom,
                                          (user.docs[0].data() as User).prenom,
                                          (user.docs[0].data() as User).email,
                                          (user.docs[0].data() as User).emailVerified,
                                          (user.docs[0].data() as User).status);
              this.emitUserChanged();
              
            } else {
              // Il faudra enregistrer user dans DB
              this.emitUserChanged();
            }
          },
          (error: any) => {
            console.log(error.message);
          })
        }
      }
    });
  }

  public emitUserChanged() {
    this.authSubject.next(this.currentUser!);
  }

  getVisiteur() {
    return this.visiteur;
  }

  getCurrentUser() {
    return this.currentUser;
  }      

  getStatus() {
    return this.status;
  }
      
  signInVisiteur() {
    return this.SignInUser(this.visiteur.email, this.visiteur.password);
  }

  createNewUser(user: User, password: string) {
  //if(user.email == undefined || password == undefined)
    // return;
  return new Promise((resolve, reject) => {
    this.angularFireAuth.createUserWithEmailAndPassword(user!.email!.trim(), password.trim()).then(u => {
        u.user!.updateProfile({displayName: user.nom + '/' + user.prenom});
          user.uid = u.user!.uid;
          if(u.user)
            u.user.sendEmailVerification().then(() => {
              alert('Un email vous a été envoyé, merci de cliquer sur le lien qu\'il contien afin de valider vôtre inscription.');
          }).catch((error: any) => {
              console.log(error);
              reject(error);
            });
            this.angularFireAuth.signInWithEmailAndPassword(this.visiteur.email, this.visiteur.password).then(u => {
            });
            this.router.navigate(['app-accueil']);
            resolve(true);
          })
      })
  }

  SignInUser(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(user => {
          // Vérifier si le mail a bien été validé
          if (user.user!.emailVerified) {
            //  Controler si user est dans la base de données
            if(user.user) {
              // console.log('Vérifié.');
              this.usersService.getUserByUid(user.user.uid).subscribe(u => {
                let currentsUser: User[] = u.docs.map((U: any) => {
                  let user = U.data() as User;
                  user.id = U.id;
                  return user;
                });
                if(currentsUser && currentsUser.length > 0) {
                  // l'utilisateur est enregistré
                  this.currentUser = currentsUser[0];
                  this.emitUserChanged();
                } else {
                  // Il faut créer l'utilisateur dans la BD
                  if(user.user?.email != this.visiteur.email) {
                    this.currentUser = new User('', 
                                              user.user?.uid,
                                              user.user?.displayName?.substring(0, user.user.displayName?.indexOf('/')),
                                              user.user?.displayName?.substring(user.user.displayName?.indexOf('/') + 1), 
                                              user.user?.email!,
                                              true,
                                              Status.valide);
                    this.usersService.addUser(this.currentUser);
                    this.router.navigate(['app-accueil']);
                    this.emitUserChanged();
                  }
                }
              })
            }
          } else { // mail non validé
            this.router.navigate(['app-unvalidate-user-message']);
          }
          this.router.navigate(['app-accueil']);
        }).catch(error => {
        console.log(error.message);
        alert('Erreur de connexion, mail ou mot de passe incorrect ?');
      })
  }

  SignOut() {
    this.currentUser = undefined;
    this.angularFireAuth.signOut().then(() => {
    }).catch((error: any) => {
      console.log(error);
    }).finally(() => {
      this.signInVisiteur().then(() => {
        this.emitUserChanged();
      })
    })
  }  

  sendMailNewUser() {
    this.angularFireAuth.currentUser.then(u => {
      u?.sendEmailVerification();
    })
  }

  getCurrentAuthUser() {
    return this.angularFireAuth.currentUser;
  }

  ForgotPassword(Email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(Email).then(() => {
      alert('Un email de réinitialisation du mot de passe vous a été envoyé, vérifiez votre boîte de réception.');
    }).catch((error) => {
      alert('Erreur de connexion, avez-vous bien saisi l\'adresse ?.');
      console.log(error);
    });
  }

  connectWidthGoogle() {
    const provider = new auth.GoogleAuthProvider();
    let data = [];
    return this.angularFireAuth.signInWithPopup(provider).then(
      (user: any) => {
        if (this.currentUser == null) {
          this.currentUser = new User();
        }
        // Vérifier si le mail a bien été validé
        if (user.user?.emailVerified) {
          // mail validé
          this.currentUser.email = user.user.email?.toString();
          this.currentUser.emailVerified = true;
          this.currentUser.uid = user.user.uid;
          this.currentUser.nom = user.user.displayName?.substring(0, user.user.displayName?.indexOf('/'));
          this.currentUser.prenom = user.user.displayName?.substring(user.user.displayName?.indexOf('/') + 1);
          this.currentUser.status = Droits.visiteur;
          // Rechercher si user est dans la BD
          this.usersService.getUserByUid(user.user.uid).subscribe((u: any) => {
            data = u.docs.map((U: any) => {
              let user = U.data() as User;
              user.id = U.id;
            });
            // Ouverture de la dialogbox pour obtenir le nom et le prénom
            if (data.length === 0) {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.width = '500px';
              dialogConfig.data = {email: this.currentUser?.email };

              const dialogRef = this.dialog.open(UserDatasComponent, dialogConfig);

              dialogRef.afterClosed().subscribe(d => {
                this.currentUser!.nom = d.nom;
                this.currentUser!.prenom = d.prenom;
                this.usersService.addUser(this.currentUser!);
              });
             } else {
              this.router.navigate(['app-accueil']);
            }
          });
        } else { // mail non vérifié
          this.router.navigate(['app-unvalidate-user-message']);
        }
      },
      (error: any) => {
        console.log(error);
        alert('Erreur de connexion, adresse mail ou mot de passe incorrect ?');
      });
  }
}
