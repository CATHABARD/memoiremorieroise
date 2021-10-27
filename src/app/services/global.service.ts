import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {}

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
