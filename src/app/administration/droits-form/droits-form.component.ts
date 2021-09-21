import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../modeles/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Droits } from 'src/app/services/global.service';


@Component({
  selector: 'app-droits-form',
  templateUrl: './droits-form.component.html',
  styleUrls: ['./droits-form.component.scss']
})
export class DroitsFormComponent implements OnInit {
  form: FormGroup;
  user: User = new User('', '', '', '', '', false, 0);

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<DroitsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: User) {
                if (this.data) {
                  this.user = this.data;
                }
                this.form = this.formBuilder.group({
                  visiteur: true,
                  moderateur: false,
                  editArticle: false,
                  editPhotosDeClasse: false,
                  administrateur: false
                });
    }

  ngOnInit() {
  }

  onSave() {
    if (this.form?.get('visiteur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.user.status! |= Droits.visiteur;
    }
    if (this.form?.get('moderateur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.user.status! |= Droits.moderateur;
    }
    if (this.form?.get('editArticle')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.user.status! |= Droits.editArticle;
    }
    if (this.form?.get('editPhotosDeClasse')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.user.status! |= Droits.editPhotosDeClasse;
    }
    if (this.form?.get('administrateur')?.value) {
      // tslint:disable-next-line:no-bitwise
      this.user.status! |= Droits.administrateur;
    }
    this.dialogRef.close(this.user);
  }

  onClose() {
    this.dialogRef.close();
  }

}
