import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../modeles/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Droits, Status } from './global.service';
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
                      password: 'MyPepita51'}

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
        this.currentUser = new User('',
                                    newUser.uid,
                                    'Visiteur',
                                    'Visiteur',
                                    'Visiteur',
                                    true,
                                    Status.initial);
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
    return this.visiteur.email;
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
  return new Promise((resolve, reject) => {
    this.angularFireAuth.createUserWithEmailAndPassword(user!.email!.trim(), password.trim()).then(u => {
        u.user!.updateProfile({displayName: user.nom + '/' + user.prenom});
          user.uid = u.user!.uid;
          u.user!.sendEmailVerification().then(() => {
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

  updateCurrentUser(u: User) {
    // firebase.default.auth().onAuthStateChanged(U => U?.updateProfile({displayName: u.nom + '/' + u.prenom}));
  }


  SignInUser(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(user => {
          // Vérifier si le mail a bien été validé
          if (user.user!.emailVerified) {
            this.emitUserChanged();
          } else { // mail non validé
            this.router.navigate(['app-unvalidate-user-message']);
          }
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
          this.getUserFromDB(user.user).subscribe((u: any) => {
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

  getUserFromDB(user: firebase.default.User ) {
    return this.angularFirestore.collection('Users/', u => u.where('uid', '==', user.uid)).get();
  }


}
