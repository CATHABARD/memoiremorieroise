import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { PhotosService } from './photos.service';

describe('AppComponent', () => {
    let service: AuthService;

    beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        MatDialogModule
      ],
      declarations: [
      ],
      providers: [
        GlobalService,
        PhotosService
      ]
    })
    service = TestBed.inject(AuthService);
  });

  it('Crétaion de authService', () => {
    expect(service).toBeTruthy();
  });

  it('Chargement de Visiteur', () => {
    const visiteur = service.getCurrentUser();
    expect(visiteur).toBeUndefined();
  });

});
