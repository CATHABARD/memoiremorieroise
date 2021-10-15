import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actualite } from 'src/app/modeles/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';

@Component({
  selector: 'app-edit-actualite',
  templateUrl: './edit-actualite.component.html',
  styleUrls: ['./edit-actualite.component.css']
})
export class EditActualiteComponent implements OnInit {
  public actualite: Actualite | undefined;

  constructor(private route: ActivatedRoute,
              private actualiteService: ActualiteService) {
    const id = this.route.snapshot.params.id;
      
    console.log(id);
    this.actualiteService.getActualite(id).subscribe((d: any) => {
      this.actualite = d.data() as Actualite;
      this.actualite.id = d.id;
    },
    (error: any) => {
      console.log('Erreur = ' + error);
    });
}

  ngOnInit(): void {
  }

}
