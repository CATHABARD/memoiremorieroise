import { Component, OnInit } from '@angular/core';
import { Actualite } from 'src/app/modeles/actualite';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-actualite',
  templateUrl: './add-actualite.component.html',
  styleUrls: ['./add-actualite.component.css']
})
export class AddActualiteComponent implements OnInit {
  public actualite: Actualite;

  constructor(private authService: AuthService) {
    this.actualite = new Actualite('', new Date().toString(), '', '', '', '', this.authService.getCurrentUser()?.id, '', 1);
  }

  ngOnInit(): void {

  }

}
