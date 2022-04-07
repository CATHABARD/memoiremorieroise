import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Droits, GlobalService } from 'src/app/services/global.service';
import { PhotoMorieres } from '../../modeles/photosMorières';
import { PhotoMorieresService } from '../../services/photo-morieres.service';
import { AddPhotoAlbumComponent } from '../add-photo-album/add-photo-album.component';

@Component({
  selector: 'app-album-photos',
  templateUrl: './album-photos.component.html',
  styleUrls: ['./album-photos.component.css']
})
export class AlbumPhotosComponent implements OnInit, OnDestroy {
  public photos: PhotoMorieres[] = [];
  public isConnected = false;
  public canWrite = false;

  photoCourante = 0;
  readonly pasPhotos = 4;
  pageCourantePhoto = 1;
  nbPagesPhotos = 0;
  private photosSubscription: Subscription;
  private photosCarouselSubscription:  Subscription | undefined;
  private authSubscription: Subscription | undefined;

  constructor(public photosMorieresService: PhotoMorieresService,
              private router: Router,
              private globalService: GlobalService,
              private authService: AuthService,
              private matDialog: MatDialog) {

                this.authSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
                  this.canWrite = false;
                  if (u != null) {
                    const d = u.status;
                    if(d != undefined && d >= Droits.visiteur) {
                      this.isConnected = true;
                    }
                    if (this.isConnected) {
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

                this.photosSubscription = this.photosMorieresService.photoMorieresSubject.pipe(shareReplay(1)).subscribe(photos => {
                  this.photos = photos as PhotoMorieres[];
                  this.nbPagesPhotos = Math.ceil(photos.length / this.pasPhotos);
                })
                this.photosMorieresService.getPhotosMorieres();
               }

  
  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.globalService.finDeVue();
    if(this.authSubscription != null) {
      this.authSubscription.unsubscribe();
    }
    if(this.photosSubscription != null) {
      this.photosSubscription.unsubscribe();
    }
    if(this.photosCarouselSubscription != null) {
      this.photosCarouselSubscription.unsubscribe();
    }
  }

  onAddPhoto() {
    this.router.navigate(['app-Add-photo-album']);
  }

  onEdit(p: PhotoMorieres) {
    this.router.navigate(['app-edit-photo-album/', p.id]);
  }

  onDecrementePhoto() {
    this.photoCourante -= this.pasPhotos;
    this.pageCourantePhoto = Math.ceil(this.photoCourante / this.pasPhotos) + 1; 
  }

  onIncrementePhoto() {
    this.photoCourante += this.pasPhotos;
    this.pageCourantePhoto = Math.ceil(this.photoCourante / this.pasPhotos) + 1;
  }

  onZoom(p: PhotoMorieres)
  {
    this.photosMorieresService.photo = p;
    const dialogRef = this.matDialog.open(DialogMaximisePhotoMorieresComponent, {
      height: '90%',
      width: '60%'
    });
  }

}

// ====================================================
//      Images maximisée dans une DialogBox
// =====================================================
@Component({
  selector: 'app-dialog-maximise-photo',
  templateUrl: './photo-morieres-dialog.html',
  styleUrls: ['./photo-morieres-dialog.css']
})
export class DialogMaximisePhotoMorieresComponent {
  image: string;
  texte: string;
  titre: string;

  constructor(public photosMorieresService: PhotoMorieresService) {
      this.image = photosMorieresService.photo?.photo!;
      this.texte = photosMorieresService.photo?.texte!;
      this.titre = photosMorieresService.photo?.titre!;
  }

}
