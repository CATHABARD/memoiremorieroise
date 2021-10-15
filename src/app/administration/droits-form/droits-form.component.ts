import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../modeles/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Droits } from 'src/app/services/global.service';
import { DragDropRegistry } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-droits-form',
  templateUrl: './droits-form.component.html',
  styleUrls: ['./droits-form.component.scss']
})
export class DroitsFormComponent implements OnInit {
  form: FormGroup;
  status = 0;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<DroitsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number) {
                this.form = this.formBuilder.group({
                  visiteur: true,
                  moderateur: false,
                  editArticle: false,
                  editPhotosDeClasse: false,
                  editPdf: false,
                  administrateur: false
                });
    }

  ngOnInit() {
    const d = this.data;
    const result = (d & (Droits.administrateur.valueOf() as number));
    this.form.controls.visiteur.setValue((d & Droits.visiteur) === Droits.visiteur);
    this.form.controls.administrateur.setValue((d & Droits.administrateur) === Droits.administrateur);
    this.form.controls.editArticle.setValue((d & Droits.editArticle) === Droits.editArticle);
    this.form.controls.editPhotosDeClasse.setValue((d & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse);
    this.form.controls.editPdf.setValue((d & Droits.editPdf) === Droits.editPdf);
    this.form.controls.moderateur.setValue((d & Droits.moderateur) === Droits.moderateur);
  }

  onSave() {
    if (this.form?.get('visiteur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status! |= Droits.visiteur;
    }
    if (this.form?.get('moderateur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status |= Droits.moderateur;
    }
    if (this.form?.get('editArticle')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status |= Droits.editArticle;
    }
    if (this.form?.get('editPhotosDeClasse')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status |= Droits.editPhotosDeClasse;
    }
    if (this.form?.get('editPdf')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status |= Droits.editPdf;
    }
    if (this.form?.get('administrateur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.status |= Droits.administrateur;
    }
    console.log(this.status);
    this.dialogRef.close(this.status);
  }

  onClose() {
    this.dialogRef.close();
  }

}
