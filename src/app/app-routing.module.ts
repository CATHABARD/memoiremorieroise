import { componentFactoryName } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActualiteFormComponent } from './administration/actualite-form/actualite-form.component';
import { AddActualiteComponent } from './administration/add-actualite/add-actualite.component';
import { AddPhotoCarouselComponent } from './administration/add-photo-carousel/add-photo-carousel.component';
import { CarouselFormComponent } from './administration/carousel-form/carousel-form.component';
import { DroitsFormComponent } from './administration/droits-form/droits-form.component';
import { DroitsComponent } from './administration/droits/droits.component';
import { EditActualiteComponent } from './administration/edit-actualite/edit-actualite.component';
import { GestionActualiteComponent } from './administration/gestion-actualite/gestion-actualite.component';
import { HomeAdministrationComponent } from './administration/home-administration/home-administration.component';
import { ListeMessagesComponent } from './administration/liste-messages/liste-messages.component';
import { ValiderArticlesComponent } from './administration/valider-articles/valider-articles.component';
import { AddArticleComponent } from './articles/add-article/add-article.component';

import { ArticleFormComponent } from './articles/article-form/article-form.component';
import { EditArticleComponent } from './articles/edit-article/edit-article.component';
import { DialogMaximiseArticleImageComponent, ListeArticlesComponent } from './articles/liste-articles/liste-articles.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserDatasComponent } from './auth/user-datas/user-datas.component';
import { FrameComponent } from './frame/frame.component';
import { MessagesComponent } from './messages/messages.component';
import { AddPdfComponent } from './pdf/addPdf/add-pdf/add-pdf.component';
import { EditPdfComponent } from './pdf/editPdf/edit-pdf/edit-pdf.component';
import { ListePdfComponent } from './pdf/listePdf/liste-pdf.component';
import { AddPhotoDeClasseComponent } from './photosDeClasses/add-photo-de-classe/add-photo-de-classe.component';
import { AlbumComponent } from './photosDeClasses/album/album.component';
import { EditPhotoDeClasseComponent } from './photosDeClasses/edit-photo-de-classe/edit-photo-de-classe.component';
import { PhotosDeClasseFormComponent } from './photosDeClasses/photos-de-classe-form/photos-de-classe-form.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UnvalidateUserMessageComponent } from './unvalidate-user-message/unvalidate-user-message.component';

const routes: Routes = [
  { path: 'app-accueil', component: AccueilComponent },
  { path: 'app-frame', component: FrameComponent },
  { path: 'app-sign-in', component: SignInComponent},
  { path: 'app-sign-up', component: SignUpComponent},
  { path: 'app-user-data', component: UserDatasComponent},
  { path: 'app-unvalidate-user-message', component: UnvalidateUserMessageComponent},
  { path: 'app-liste-pdf', component: ListePdfComponent},
  { path: 'app-edit-pdf/:id', canActivate: [AuthGuardService], component: EditPdfComponent},
  { path: 'app-add-pdf', canActivate: [AuthGuardService], component: AddPdfComponent},
  { path: 'app-liste-articles', component: ListeArticlesComponent},
  { path: 'app-edit-article/:id', canActivate: [AuthGuardService], component: EditArticleComponent},
  { path: 'app-add-article', canActivate: [AuthGuardService], component: AddArticleComponent},
  { path: 'app-article-form', canActivate: [AuthGuardService], component: ArticleFormComponent},
  { path: 'app-dialog-maximise-article-image', component: DialogMaximiseArticleImageComponent},
  { path: 'app-article-form', canActivate: [AuthGuardService], component: ArticleFormComponent},
  { path: 'app-album', component: AlbumComponent},
  { path: 'app-edit-photo-de-classe/:id', canActivate: [AuthGuardService], component: EditPhotoDeClasseComponent},
  { path: 'app-add-photo-de-classe', canActivate: [AuthGuardService], component: AddPhotoDeClasseComponent},
  { path: 'app-photos-de-classe-form', canActivate: [AuthGuardService], component: PhotosDeClasseFormComponent},
  { path: 'app-droits', canActivate: [AuthGuardService], component: DroitsComponent},
  { path: 'app-droits-form', canActivate: [AuthGuardService], component: DroitsFormComponent},
  { path: 'app-home-administration', canActivate: [AuthGuardService], component: HomeAdministrationComponent},
  { path: 'app-liste-messages', component: ListeMessagesComponent},
  { path: 'app-valider-articles', canActivate: [AuthGuardService], component: ValiderArticlesComponent},
  { path: 'app-messages', canActivate: [AuthGuardService], component: MessagesComponent},
  { path: 'app-add-actualite', canActivate: [AuthGuardService], component: AddActualiteComponent},
  { path: 'app-edit-actualite/:id', canActivate: [AuthGuardService], component: EditActualiteComponent},
  { path: 'app-gestion-actualite', canActivate: [AuthGuardService], component: GestionActualiteComponent},
  { path: 'app-actualite-form', canActivate: [AuthGuardService], component: ActualiteFormComponent},
  { path: 'app-carousel-form', canActivate: [AuthGuardService], component: CarouselFormComponent},
  { path: 'app-add-photo-carousel', canActivate: [AuthGuardService], component: AddPhotoCarouselComponent},
  { path: '', redirectTo: 'app-accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'app-accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
