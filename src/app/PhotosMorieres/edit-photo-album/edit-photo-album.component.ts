import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoMorieres } from 'src/app/modeles/photosMorières';
import { PhotoMorieresService } from 'src/app/services/photo-morieres.service';

@Component({
  selector: 'app-edit-photo-album',
  templateUrl: './edit-photo-album.component.html',
  styleUrls: ['./edit-photo-album.component.css']
})
export class EditPhotoAlbumComponent implements OnInit {
  photo: PhotoMorieres | undefined;

  constructor(private route: ActivatedRoute,
              private photosMorieresService: PhotoMorieresService) {
                const id = this.route.snapshot.params.id;
        photosMorieresService.getPhotoMorieres(id).subscribe(p => {
          this.photo = p.data() as PhotoMorieres;
          this.photo.id = p.id;
        })
   }

  ngOnInit(): void {
  }

}
