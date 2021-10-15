import { Component, OnInit, Input } from '@angular/core';
import { Pdf } from '../../modeles/pdf';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService, Status } from 'src/app/services/global.service';
import { Location } from '@angular/common';
import { PdfService } from 'src/app/services/pdf.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-pdf-form',
  templateUrl: './pdf-form.component.html',
  styleUrls: ['./pdf-form.component.css']
})
export class PdfFormComponent implements OnInit {
  @Input() pdf: Pdf | undefined;
  form: FormGroup;
  errorMessage: string = '';

  readonly maxSize = 100000;
  fileIsUploading = false;
  downloadURL: string = '';
  fileUploaded: boolean = false;
  uploadPercent: number | undefined;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              public globalService: GlobalService,
              private pdfService: PdfService,
              private angularFireStorage: AngularFireStorage) {

                this.form = this.formBuilder.group({
                  fichier: [''],
                  progressbar: ['Progression'],
                  titre: ['', [Validators.required, Validators.maxLength(50)]],
                  description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
                });
              }

  ngOnInit() {
    if (this.pdf == undefined || this.pdf.id == '') {
      this.pdf = new Pdf('', '', '', '', 0);
      this.fileUploaded = false;
    } else {
      this.fileUploaded = true;
    }
    this.form.controls.fichier.setValue(this.pdf.fichier);
    this.form.controls.titre.setValue(this.pdf.titre);
    this.form.controls.description.setValue(this.pdf.description);
}

  onUpload(event: any) {
    this.fileIsUploading = true;
    const file = event.target.files[0];
    const filePath = 'listePdf/' + new Date().toJSON() + '_' + event.target.files[0].name;
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(filePath, file);

    task.percentageChanges().subscribe(val => {
      this.uploadPercent = val;
    });
     task.then(() => {
      this.fileIsUploading = false;
      this.fileUploaded = true;
      fileRef.getDownloadURL().subscribe(name => {
        this.downloadURL = name;
      })
    })
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'pdf':
        if (this.form?.controls.fichier.touched) {
          msg = this.form.controls.fichier.hasError('maxSize') ? 'Vous devez sélectionner un fichier de moins de 16mo' : '';
        }
        break;
      case 'titre':
        if (this.form?.controls.titre.touched) {
          msg = this.form.controls.titre.hasError('required') ? 'Vous devez saisir un titre' : '';
        }
        if ( this.form?.get('titre')?.hasError('maxlength')) {
          msg += 'le titre doit comporter au plus 50 caractères';
        }
        break;
      case 'description':
        if (this.form?.get('description')?.touched) {
          if ( this.form?.get('description')?.hasError('required')) {
            msg = this.form.controls.description.hasError('required') ? 'Vous devez saisir une description du contenu du document' : '';
          }
          if ( this.form?.get('description')?.hasError('minlength')) {
            msg += 'la description doit comporter au moins 10 caractères';
          }
          if ( this.form?.get('description')?.hasError('maxlength')) {
            msg += 'la description doit comporter au plus 100 caractères';
          }
        }
      }
    return msg;
  }

  onSubmit() {
    this.pdf!.titre = this.form?.get('titre')?.value;
    this.pdf!.description = this.form?.get('description')?.value;

    if (this.pdf?.id  === '') {
      this.pdf.fichier = this.downloadURL;
      this.pdf.status = Status.initial;
      this.pdfService.addPdf(this.pdf);
    } else {
      this.pdfService.updatePdf(this.pdf!);
    }
    this.location.back();
  }
}
