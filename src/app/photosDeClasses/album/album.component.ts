import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService, Droits, Status } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { Photo } from '../../modeles/photo';
import { PhotosService } from 'src/app/services/photos.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.services';
import { User } from 'src/app/modeles/user';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {
  public selectedPhoto: Photo | undefined;
  public zoom = false;
  queryParamsSuscription: Subscription | undefined;
  public isConnected = false;
  public canWrite: boolean;

  listePhotos: Photo[] = [];
  listeSelectedPhotos: Photo[] = [];
  private photosSubscription: Subscription | undefined;

  debut = 0;
  fin = 0;

  private userSubscription: Subscription | undefined;

  constructor(public route: ActivatedRoute,
              private router: Router,
              public photosService: PhotosService,
              public globalService: GlobalService,
              private usersService: UsersService,
              private authService: AuthService,
              private matDialog: MatDialog) {
                this.canWrite = false;
  
                let d: number | undefined;
                this.canWrite = false;

                this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
                  // consolelog(u);
                  ((u.status! & Status.valide) == Status.valide)? this.isConnected = true : this.isConnected  =  false;
                  if (this.isConnected) {
                    d = u.status;
                    // tslint:disable-next-line:no-bitwise
                    if ((d! & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
                      this.canWrite = true;
                    } else {
                      this.canWrite = false;
                    }
                  } else {
                    this.canWrite = false;
                  }
            
                  // tslint:disable-next-line:no-bitwise
                  if ((d! & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
                    this.canWrite = true;
                  } else {
                    this.canWrite = false;
                  }
                })
                authService.emitUserChanged();
            
                this.queryParamsSuscription = this.route.queryParamMap.subscribe(param => {
                  if (param.has('debut') && param.has('fin')) {
                    this.debut = (param.get('debut') as unknown) as number;
                    this.fin = (param.get('fin') as unknown) as number;
                    this.CherchePhotos();
                  }
                },
                (error) => {
                  console.log('Erreur : ' + error.message);
                });

                this.photosSubscription = this.photosService.photoSubject.subscribe(photos => {
                  this.listePhotos = photos as Photo[];
                  this.CherchePhotos();
                })
                this.photosService.emitPhoto();
          
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.queryParamsSuscription != null) {
      this.queryParamsSuscription.unsubscribe();
    }
    if( this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
    if(this.photosSubscription != null) {
      this.photosSubscription.unsubscribe();
    }
  }

  CherchePhotos() {
    if (this.debut != 0 && this.fin != 0) {
      this.filtrePhotos();
      this.addPrenomAuteur();
    }
  }

  filtrePhotos() {
    this.listeSelectedPhotos.splice(0);
    this.listeSelectedPhotos = this.listePhotos.filter(p => {
      if(p.status == 1) {
        if(p.annee! >= this.debut && p.annee! <= this.fin) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      };
    });
  }

  addPrenomAuteur() {
    this.listeSelectedPhotos.forEach(p => {
      this.usersService.getUser(p.auteur!).subscribe(u => {
          const auteur = u.data() as User;
          p.nomAuteur = auteur.prenom;
      });
    });
  }

  onZoomImage() {
    this.zoom = true;
  }

  onDeZoomImage() {
    this.zoom = false;
  }

  onAddPhoto() {
    this.router.navigate(['app-add-photo-de-classe']);
  }

  onEdit(p: Photo) {
    this.router.navigate(['app-edit-photo-de-classe', p.id]);
  }

  onSurvol(p: Photo) {
    this.photosService.currentPhoto = p;
    const dialogRef = this.matDialog.open(DialogMaximiseImageComponent, {
      height: '100%',
      width: '55%'
    });
  }
}

// ====================================================
//      Images maximisée dans une DialogBox
// =====================================================
@Component({
  selector: 'app-dialog-maximise-image',
  templateUrl: './photo-dialog.html',
  styleUrls: ['./dialog-content-dialog.css']
})
export class DialogMaximiseImageComponent {
  image: string;
  listeEleves: string;
  titre: string;
  sousTitre: string;

  constructor(private photosService: PhotosService) {
    this.image = photosService.currentPhoto?.photo!;
    this.listeEleves = photosService.currentPhoto?.listeEleves!;
    this.titre = photosService.currentPhoto?.titre!;
    this.sousTitre = '' + photosService.currentPhoto?.annee!.toString();
  }

}
