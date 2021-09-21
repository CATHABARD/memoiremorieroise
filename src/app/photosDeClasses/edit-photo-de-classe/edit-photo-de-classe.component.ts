import { Component, OnInit, OnDestroy } from '@angular/core';
import { Photo } from '../../modeles/photo';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-edit-photo-de-classe',
  templateUrl: './edit-photo-de-classe.component.html',
  styleUrls: ['./edit-photo-de-classe.component.css']
})
export class EditPhotoDeClasseComponent implements OnInit, OnDestroy {
  public photo: Photo | undefined;

  constructor(private route: ActivatedRoute,
              private photosService: PhotosService) {

                const id = this.route.snapshot.params.id;
                this.photosService.getPhoto(id).subscribe((data: any) => {
                  this.photo = data.data() as Photo;
                  this.photo.id = data.id;
                },
                (error: any) => {
                  console.log('Erreur = ' + error.message);
                });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
