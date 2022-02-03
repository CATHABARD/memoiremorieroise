import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { Article } from '../modeles/article';
import { User } from '../modeles/user';
import { AuthService } from '../services/auth.service';
import { Droits, GlobalService, Status } from '../services/global.service';
import { Theme } from '../modeles/themes';
import { ThemesService } from '../services/themes.service';
import { MessagesComponent } from '../messages/messages.component';
import { Message } from '../modeles/message';
import { MessagesService } from '../services/messages.service';
import { ArticlesService } from '../services/articles.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent implements OnInit, OnDestroy {
  dialogResultSuscription: Subscription | undefined;

  userMail: string = 'Visiteur';
  userPassword: string = '';
  isAdmin = false;
  isAuth = false;
  showFiller = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map((result: BreakpointState) => result.matches)
  );

  private userSubscription: Subscription;

  constructor(private router: Router,
              public dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              public globalService: GlobalService,
              private messagesService: MessagesService,
              public themesService: ThemesService,
              public articlesService: ArticlesService,
              public authService: AuthService) {

                this.userSubscription = this.authService.authSubject.subscribe(u => {
                  let userDroits = 0;

                  if (u != undefined || u != null) {
                    if( u.email != 'Visiteur' && u.status as number > 0) {
                      this.userMail = u?.email!;
                      this.isAuth = true;
                      // console.log(u.email);
                    } else {
                      this.userMail = 'Visiteur';
                      this.isAuth = false;
                      // console.log(u.nom);
                    }
                    userDroits = u.status!;
                  } else {
                    this.isAuth = false;
                    this.userMail = 'Déconnecté';
                    // console.log('u.nom = null');
                  }
                  if ((userDroits & Droits.administrateur) === Droits.administrateur) {
                    this.isAdmin = true;
                  } else {
                    this.isAdmin = false;
                  }
                })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if( this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
    this.authService.SignOut();
  }

  onGoAccueil() {
    this.router.navigate(['app-acceuil']);
  }

  onClickAlbum(deb: number, fin: number) {

  }

  onOpenPdf() {
    this.router.navigate(['app-liste-pdf']);
  }

  onListeArticles(t: Theme) {
    this.themesService.changeCurrentTheme(t);
    this.articlesService.getArticlesCurrentTheme();
    this.router.navigate(['app-liste-articles']);
  }

  onEditAlbum(deb: number, fin: number) {
    this.router.navigate(['app-album'], {
      queryParams: {debut: deb, fin: fin}
    });
}

  onEditArticle(a: Article) {
    
  }

  onNewCompteDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(SignUpComponent);

    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }

    this.dialogResultSuscription =  dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        const user = new User('', '', data.nom, data.prenom, data.email, false, Status.initial);
        this.authService.createNewUser(user, data.password1);
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onConnectWidthGoogleDialog() {
    this.authService.connectWidthGoogle();
  }

  onConnectDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {email: this.userMail, password: this.userPassword };

    const dialogRef = this.dialog.open(SignInComponent, dialogConfig);

    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }

    this.dialogResultSuscription =  dialogRef.afterClosed().subscribe(data => {
      let u: any;
      if (data !== undefined && data.email !== undefined && data.password !== undefined ) {
        this.authService.SignInUser(data.email, data.password).then(user => {
          u = user;
        })
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onDisconnectDialog() {
    this.authService.SignOut();
    this.router.navigate(['app-accueil']);
    this.authService.emitUserChanged();
  }
  
  onMessage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '450px';
    dialogConfig.data = {email: this.authService.getCurrentUser()?.email};

    const dialogRef = this.dialog.open(MessagesComponent, dialogConfig);

    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }

    this.dialogResultSuscription = dialogRef.afterClosed().subscribe(data => {

      if (data && data.message) {
        const message = new Message(new Date(), dialogConfig.data.email, data.message, false, '');
        this.messagesService.addMessage(message);
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onAdmin() {
    this.router.navigate(['app-home-administration']);
  }

  onAlbumPhotos() {
    this.router.navigate(['app-album-photos']);
  }
}
