import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Connexion } from 'src/app/modeles/connexion';
import { ConnexionsService } from 'src/app/services/connexions.service';
import { VueService } from 'src/app/services/vue.service';
import { Vue } from 'src/app/modeles/vue';
import { UsersService } from 'src/app/services/users.services';
import { User } from 'src/app/modeles/user';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-connexions',
  templateUrl: './connexions.component.html',
  styleUrls: ['./connexions.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConnexionsComponent implements OnInit {
  Data: Connection[] = [];
  connexions: Connexion[] = [];
  views: View[] = [];
  dataSource: Connection[] = [];
  columnsToDisplay = ['date', 'email', 'id'];
  expandedElement: Connection | null = null;

  constructor(public connexionsService: ConnexionsService,
    private vuesService: VueService,
    private usersService: UsersService) {

      let user: User;

      this.connexionsService.getConnexions().subscribe(c => {
        this.connexions = c.docs.map(C => {
          let connexion = C.data() as Connexion;
          connexion.id = C.id;
          return connexion;
        });
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Enumération des connexions
        this.connexions.forEach(C => {
          // recherche du user
          this.usersService.getUser(C.idUser!).subscribe(u => {
            user = u.data() as User;
            if(user)
              user.id = u.id;
              this.Data.push({
              id: C.id!,
              email: user!.email!,
              date: new Date(C.date!).toLocaleDateString() + ' ' + new Date(C.date!).toLocaleTimeString(),
              vues: []
            });
          },
          (error) => {
            console.log(error) ;
          },
          () => {
            this.Data.sort((D1: Connection, D2: Connection) => {
              if(new Date(D1.date!) > new Date(D2.date!)) {
                return 1;
              }
              if(new Date(D1.date!) < new Date(D2.date!)) {
                return -1;
              }
              return 0;
            });        
            
            this.Data.forEach(D => {
            // rechercher la liste des pages visitées
            this.getViewsOfConnection(D);
          });
          // fin this.Data.forEach(D => {
        });
      });
    });
  }

  private getViewsOfConnection(D: Connection) {

    let vues: Vue[];
    this.vuesService.getVuesConnexion(D.id).subscribe(V => {
      vues = V.docs.map(v => {
        let vue = v.data() as Vue;
        vue.id = v.id;
        return vue;
      });
      // met les vues des connexions dans l'ordre de heureDebut
      vues = vues.sort((V1: Vue, V2: Vue) => {
        if(new Date(V1.heureDebut!) > new Date(V2.heureDebut!)) {
          return 1;
        }
        if(new Date(V1.heureDebut!) < new Date(V2.heureDebut!)) {
          return -1;
        }
        return 0;
      });
      D.vues = [];
      vues.forEach(V => {
        // console.log(D);
        V.duree = ((new Date(V.heureFin!).getTime() - new Date(V.heureDebut!).getTime()) / 1000);
        D.vues.push({
          id: V.id!,
          page: V.page!,
          debut: new Date(V.heureDebut!).toLocaleTimeString(),
          idConnection: D.id,
          duree: V.duree!.toFixed(0)
        })
      });
      vues = [];
    },
    (error) => {
      console.log(error);
    },
    () => {
      this.dataSource = this.Data;
    })
  }

  ngOnInit(): void {
  }

  onDeleteAllConnexions(): any {
    this.connexionsService.deleteAll();
    this.vuesService.deleteAll();
  }

}

export interface Connection {
  id: string;
  email: string;
  date: string;
  vues: View[];
}

export interface View {
  id: string;
  page: string;
  debut: string;
  idConnection: string;
  duree: string;
}

