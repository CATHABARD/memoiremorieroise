import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Pdf } from '../../modeles/pdf';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/modeles/user';
import { Subscription } from 'rxjs';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-liste-pdf',
  templateUrl: './liste-pdf.component.html',
  styleUrls: ['./liste-pdf.component.scss']
})
export class ListePdfComponent implements OnDestroy {
  url: string | undefined = '';
  canWrite = false;
  isConnected = false;
  listePdf: Pdf[] = [];
  private currentUser: User | undefined | null;
  private userSubscription: Subscription;
  private pdfsSubscription: Subscription;

  constructor(private router: Router,
              public globalService: GlobalService,
              public pdfService: PdfService,
              private authService: AuthService) {
                this.canWrite = false;
                
                this.userSubscription = this.authService.authSubject.subscribe(u => {
                  console.log(u.email);
                  if (u == null) {
                    console.log(' = null');
                    this.currentUser = null;
                    this.isConnected = false;
                  } else {
                    this.currentUser = authService.getCurrentUser();
                    console.log(this.currentUser);
                    this.isConnected = true;
                  }
                    if (this.isConnected && this.currentUser) {
                      const d = this.currentUser.status;
                      // tslint:disable-next-line:no-bitwise
                      if ((d! & Droits.editArticle) === Droits.editArticle) {
                        this.canWrite = true;
                      } else {
                        this.canWrite = false;
                      }
                  } else {
                    this.canWrite = false;
                  }
                });

                this.pdfService.getListePdfsValides();
                this.pdfsSubscription = this.pdfService.pdfSubject.subscribe(pdfs => {
                  this.listePdf = pdfs;
                });
                this.pdfService.emitPdf();
                if (this.currentUser != undefined) {
                    const d = this.currentUser.status;
                    // tslint:disable-next-line:no-bitwise
                    if ((d! & Droits.editArticle) === Droits.editArticle) {
                      this.canWrite = true;
                    } else {
                      this.canWrite = false;
                    }
                  }
                this.pdfService.getListePdfsValides();
            }

  ngOnDestroy() {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onAddPdf() {
    this.router.navigate(['app-add-pdf']);
  }

  onEditPdf(p: Pdf) {
    this.router.navigate(['app-edit-pdf/', p.id]);
  }

  onValiderPdf(p: Pdf) {
    this.pdfService.validerPdf(p);
  }

  onDeletePdf(p: Pdf) {
    this.pdfService.supprimerPdf(p);
  }

  onVoirPdf(p: Pdf) {
    (this.url === p.fichier) ? this.url = '' : (this.url = p.fichier);
  }
}
