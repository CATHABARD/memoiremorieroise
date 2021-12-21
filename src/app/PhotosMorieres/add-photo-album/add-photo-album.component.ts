import { Component, OnInit } from '@angular/core';
import { PhotoMorieres } from 'src/app/modeles/photosMorières';
import { Status } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-photo-album',
  templateUrl: './add-photo-album.component.html',
  styleUrls: ['./add-photo-album.component.css']
})
export class AddPhotoAlbumComponent implements OnInit {
  photo: PhotoMorieres

  constructor() {
    console.log('Add photo');
    this.photo = new PhotoMorieres('', '', '', '', '', '', '', Status.initial);
  }

  ngOnInit(): void {
  }

}
