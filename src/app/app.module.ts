import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
// import { BreakpointObserver } from '@angular/cdk/layout/breakpoints-observer';
import {OverlayModule} from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Material 
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule } from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { MaterialFileInputModule } from 'ngx-mat-file-input';

// AngularFire
import { AngularFireModule } from '@angular/fire/compat/';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';

import { AccueilComponent } from './accueil/accueil.component';
import { DroitsFormComponent } from './administration/droits-form/droits-form.component';
import { DroitsComponent } from './administration/droits/droits.component';
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
import { MessagesComponent } from './messages/messages.component';
import { AddPdfComponent } from './pdf/addPdf/add-pdf/add-pdf.component';
import { EditPdfComponent } from './pdf/editPdf/edit-pdf/edit-pdf.component';
import { ListePdfComponent } from './pdf/listePdf/liste-pdf.component';
import { AddPhotoDeClasseComponent } from './photosDeClasses/add-photo-de-classe/add-photo-de-classe.component';
import { AlbumComponent, DialogMaximiseImageComponent } from './photosDeClasses/album/album.component';
import { EditPhotoDeClasseComponent } from './photosDeClasses/edit-photo-de-classe/edit-photo-de-classe.component';
import { PhotosDeClasseFormComponent } from './photosDeClasses/photos-de-classe-form/photos-de-classe-form.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UnvalidateUserMessageComponent } from './unvalidate-user-message/unvalidate-user-message.component';
import { PdfFormComponent } from './pdf/pdf-form/pdf-form.component';
import { FrameComponent } from './frame/frame.component';
import { AddActualiteComponent } from './administration/add-actualite/add-actualite.component';
import { EditActualiteComponent } from './administration/edit-actualite/edit-actualite.component';
import { ActualiteFormComponent } from './administration/actualite-form/actualite-form.component';
import { GestionActualiteComponent } from './administration/gestion-actualite/gestion-actualite.component';
import { CarouselComponent } from './administration/carousel/carousel.component';
import { CarouselFormComponent } from './administration/carousel-form/carousel-form.component';
import { AddPhotoCarouselComponent } from './administration/add-photo-carousel/add-photo-carousel.component';
import { EditPhotoAlbumComponent } from './PhotosMorieres/edit-photo-album/edit-photo-album.component';
import { AddPhotoAlbumComponent } from './PhotosMorieres/add-photo-album/add-photo-album.component';
import { PhotoAlbumFormComponent } from './PhotosMorieres/photo-album-form/photo-album-form.component';
import { AlbumPhotosComponent, DialogMaximisePhotoMorieresComponent } from './PhotosMorieres/album-photos/album-photos.component';

import { GlobalService } from './services/global.service';
import { ArticlesService } from './services/articles.service';
import { AuthService } from './services/auth.service';
import { ImagesService } from './services/images.service';
import { MessagesService } from './services/messages.service';
import { PdfService } from './services/pdf.service';
import { PhotosService } from './services/photos.service';
import { UsersService } from './services/users.services';

import { SafePipe } from './safe.pipe';
import { ConnexionsComponent } from './administration/connexions/connexions.component';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    AccueilComponent,
    DroitsFormComponent,
    DroitsComponent,
    HomeAdministrationComponent,
    ListeMessagesComponent,
    ValiderArticlesComponent,
    AddArticleComponent,
    ArticleFormComponent,
    EditArticleComponent,
    DialogMaximiseImageComponent,
    AlbumComponent,
    DialogMaximiseArticleImageComponent,
    ListeArticlesComponent,
    SignInComponent,
    SignUpComponent,
    UserDatasComponent,
    MessagesComponent,
    AddPdfComponent,
    EditPdfComponent,
    ListePdfComponent,
    AddPhotoDeClasseComponent,
    EditPhotoDeClasseComponent,
    PhotosDeClasseFormComponent,
    UnvalidateUserMessageComponent,
    PdfFormComponent,
    SafePipe,
    AddActualiteComponent,
    EditActualiteComponent,
    ActualiteFormComponent,
    GestionActualiteComponent,
    CarouselComponent,
    CarouselFormComponent,
    AddPhotoCarouselComponent,
    AlbumPhotosComponent,
    EditPhotoAlbumComponent,
    AddPhotoAlbumComponent,
    PhotoAlbumFormComponent,
    DialogMaximisePhotoMorieresComponent,
    ConnexionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    ReactiveFormsModule,
    // BreakpointObserver,
    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    // Material 
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MaterialFileInputModule
  ],
  providers: [
    GlobalService,
    ArticlesService,
    AuthService,
    AuthGuardService,
    ImagesService,
    MessagesService,
    PdfService,
    PhotosService,
    UsersService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
