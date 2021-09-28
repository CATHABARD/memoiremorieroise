import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService, Droits, Status } from 'src/app/services/global.service';
import { Article } from '../../modeles/article';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ThemesService } from 'src/app/services/themes.service';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-liste-articles',
  templateUrl: './liste-articles.component.html',
  styleUrls: ['./liste-articles.component.css']
})
export class ListeArticlesComponent implements OnInit, OnDestroy {
  public article: Article | undefined;
  public isConnected = false;
  public canWrite = false;

  private userSubscription: Subscription;

  constructor(public globalService: GlobalService,
              public themesService: ThemesService,
              public articlesService: ArticlesService,
              public authService: AuthService,
              private router: Router,
              private matDialog: MatDialog) {

    this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
      if (u != null) {
        const d = u.status;
        if(d != undefined && (d & Status.valide) == Status.valide) {
          this.isConnected = true;
        }
        if (this.isConnected) {
          this.canWrite = false;
          // tslint:disable-next-line:no-bitwise
          if (d != undefined && (d & Droits.editArticle) == Droits.editArticle) {
            this.canWrite = true;
          } else {
            this.canWrite = false;
          }
        } else {
          this.canWrite = false;
        }
      }
    })
    authService.emitUserChanged();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if( this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }

  onEdit(a: Article) {
    this.router.navigate(['app-edit-article/', a.id]);
 }

  onAddArticle() {
    this.router.navigate(['app-add-article']);
  }

  onZoom(a: Article) {
    this.articlesService.currentArticle = a;
    const dialogRef = this.matDialog.open(DialogMaximiseArticleImageComponent, {
      height: '90%',
      width: '60%'
    });
  }
}

// ====================================================
//      Images maximisée dans une DialogBox
// =====================================================
@Component({
  selector: 'app-dialog-maximise-article-image',
  templateUrl: './article-dialog.html',
  styleUrls: ['./article-dialog.css']
})
export class DialogMaximiseArticleImageComponent {
  image: string;
  image2: string;
  legende: string;
  texte: string;
  titre: string;
  sousTitre: string = '';;

  constructor(private globalService: GlobalService,
              public articlesService: ArticlesService) {
      this.image = articlesService.currentArticle?.photo!;
      this.image2 = articlesService.currentArticle?.photo2!;
      this.legende = articlesService.currentArticle?.legende!;
      this.texte = articlesService.currentArticle?.texte!;
      this.titre = articlesService.currentArticle?.titre!;
  }

}
