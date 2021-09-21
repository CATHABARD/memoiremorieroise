import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pdf } from '../../../modeles/pdf';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrls: ['./edit-pdf.component.scss']
})
export class EditPdfComponent implements OnInit, OnDestroy {
  pdf = new Pdf('', '','', '', 0);
  pdfSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private pdfService: PdfService) {
                this.pdfSubscription = this.pdfService.pdfSubject.pipe(shareReplay(1)).subscribe((pdfs) => {
                  if (pdfs.length > 0) {
                    this.pdf = this.pdfService.currentPdf!;
                  }
                });
              }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.pdfService.GetSinglePdf(id);
  }

  ngOnDestroy() {
    this.pdfSubscription.unsubscribe() ;
}


}
