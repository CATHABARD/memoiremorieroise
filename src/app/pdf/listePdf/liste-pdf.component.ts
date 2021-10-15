import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Pdf } from '../../modeles/pdf';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/modeles/user';
import { Subscription } from 'rxjs';
import { PdfService } from 'src/app/services/pdf.service';
import { shareReplay } from 'rxjs/operators';

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
                
                this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
                  this.canWrite = false;
                  if (u != null) {
                    const d = u.status;
                    if(d != undefined && d >= Droits.visiteur) {
                      this.isConnected = true;
                    }
                    if (this.isConnected) {
                      if (d != undefined && (d & Droits.editPdf) == Droits.editPdf) {
                        this.canWrite = true;
                      } else {
                        this.canWrite = false;
                      }
                    } else {
                      this.canWrite = false;
                    }
                  }
                })
                authService.emitUserChanged();
            
                this.pdfService.getPdfsValides();
                this.pdfsSubscription = this.pdfService.pdfSubject.subscribe(pdfs => {
                  this.listePdf = pdfs;
                });
                if (this.currentUser != undefined) {
                    const d = this.currentUser.status;
                    // tslint:disable-next-line:no-bitwise
                    if ((d! & Droits.editArticle) === Droits.editArticle) {
                      this.canWrite = true;
                    } else {
                      this.canWrite = false;
                    }
                  }
            }

  ngOnDestroy() {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onAddPdf() {
    this.router.navigate(['app-add-pdf']);
    this.pdfService.getPdfsValides();
  }

  onEditPdf(p: Pdf) {
    this.router.navigate(['app-edit-pdf/', p.id]);
  }

  onValiderPdf(p: Pdf) {
    this.pdfService.validerPdf(p);
    this.pdfService.getPdfsValides();
  }

  onDeletePdf(p: Pdf) {
    this.pdfService.supprimerPdf(p);
    this.pdfService.getPdfsValides();
  }

  onVoirPdf(p: Pdf) {
    (this.url === p.fichier) ? this.url = '' : (this.url = p.fichier);
  }
}
