import { Injectable, ɵsetCurrentInjector } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Connexion } from '../modeles/connexion';
import { User } from '../modeles/user';
import { Vue } from '../modeles/vue';
import { AuthService } from '../services/auth.service';
import { ConnexionsService } from './connexions.service';
import { UsersService } from './users.services';
import { VueService } from './vue.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private currentConnexion = '';
  private currentIdVue = '';
  private userSubscription: Subscription;

  constructor(private connexionService: ConnexionsService, 
              private vueService: VueService,
              private authService: AuthService,
              private router: Router,
              private usersService: UsersService) {
                this.userSubscription = this.authService.authSubject.subscribe(u => {
                  if(u)
                    this.connectUser(u.id!);
                });

  }

  ConnecteVisiteur() {
    let currentUser = new User(this.authService.getVisiteur().id,
    'Visiteur',
    'Visiteur',
    'Visiteur',
    'Visiteur',
    true,
    Status.visiteur);
    this.connexionService.addConnexion(currentUser).then(C => {
      this.currentConnexion = C.id;
      this.nouvelleVue('Accueil');
      this.router.navigate(['app-acceuil']);
    });
  }

  private connectUser(idUser: string) {
    // changer l'id de user dans la connexion
    if(this.currentConnexion != '') {
      this.connexionService.updateConnexion(new Connexion(this.currentConnexion, idUser, undefined, true));
    }
  }

  nouvelleVue(vue: string) {
    if(this.currentConnexion != '') {
      if(this.vueService.currentIdVue != '') {
        this.finDeVue();
      }
      this.vueService.addVue(this.currentConnexion, vue);
    }
  }

  finDeVue() {
    if(this.currentConnexion != '') {
      this.vueService.finDeVue();
    }
  }

}

export enum Droits {
  visiteur = 1,
  moderateur = 0x1C,
  editArticle = 4,
  editPhotosDeClasse = 8,
  editPdf = 0x10,
  administrateur = 0xFF
}

export enum Status {
  initial = 0,
  valide = 1,
  rejete = 0x100,
  supprime = 0x1000,
  visiteur = 0x10000,
}
