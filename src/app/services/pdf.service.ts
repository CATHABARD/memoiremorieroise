import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Pdf } from '../modeles/pdf';
import { Status } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  public pdfs: Pdf[] = [];
  public pdfsAValider: Pdf[] = [];
  public currentPdf: Pdf | undefined;
  pdfSubject = new Subject<Pdf[]>();


  constructor(private angularFirestore: AngularFirestore) { 

  }

  emitPdf() {
    this.pdfSubject.next(this.pdfs);
  }


  getPdfs() {
    this.angularFirestore.collection('Pdf').get().subscribe((data: any) => {
      this.pdfs = data.docs.map((e: any) => {
        const a = e.data() as Pdf;
        a.id = e.id;
        return a;
      });
      if( this.pdfs.length > 0) {
        this.currentPdf = this.pdfs[0];
      }
    });

  }

  getPdf(id: string) {
    return this.angularFirestore.collection('Pdf').doc(id).get();
  }

  public getListePdfsValides() {
    this.angularFirestore.collection('listePdf', l => l.where('Status', '==', Status.valide)).get().subscribe(data => {
      this.pdfs = data.docs.map(e => {
        const a = e.data() as Pdf;
        a.id = e.id;
        return a;
      });
    });
    this.emitPdf();
  }

  public getListePdfAValider() {
    this.angularFirestore.collection('listePdf', l => l.where('Status', '==', Status.initial)).get().subscribe(data => {
      this.pdfsAValider = data.docs;
    });
  }

  public GetSinglePdf(id: string) {
    this.angularFirestore.collection('listePdf').doc(id).get().subscribe(data => {
      if (this.currentPdf == null) {
        this.currentPdf = new Pdf('', '', '', '', 0);
      }
      this.currentPdf.id = data.id;
      this.currentPdf = data.data() as Pdf;
      this.emitPdf();
    });
  }

  public addPdf(pdf: Pdf) {
        // console.log(pdf);
        this.angularFirestore.collection('listePdf').add({
          description: pdf.description,
          fichier: pdf.fichier,
          Status: Status.initial,
          titre: pdf.titre
        }).then(data => {
          },
        (error) => {
          console.log('Erreur ' + error);
        });
  }

  public validerPdf(p: Pdf)  {
    p.status = Status.valide;
    this.angularFirestore.collection('listePdf').doc(p.id).update({
      Status: p.status
    });
  }

  public rejeterPdf(p: Pdf)  {
    p.status = Status.rejete;
    this.angularFirestore.collection('listePdf').doc(p.id).update(p);
  }

  public supprimerPdf(p: Pdf) {
    p.status = Status.supprime;
    this.angularFirestore.collection('listePdf').doc(p.id).update(p);
  }

  public updatePdf(p: Pdf) {
    this.angularFirestore.collection('listePdf').doc(p.id).update(p);
  }


}
