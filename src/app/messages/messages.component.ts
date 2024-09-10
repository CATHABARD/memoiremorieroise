import { Component, OnInit, Inject } from '@angular/core';
import { Validators, UntypedFormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface MessageData {
  email: string;
}
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  messageForm = this.formBuilder.group({
    message: ['', [Validators.required, Validators.maxLength(150)]]
  });
  errorMessage: string = '';
  email: string;

  constructor(public formBuilder: UntypedFormBuilder,
              public matDialogRef: MatDialogRef<MessagesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MessageData) {
      this.email = data.email;
    }

  close() {
    this.matDialogRef.close();
  }

  save() {
    if (this.messageForm.status == 'VALID') {
      this.matDialogRef.close(this.messageForm.value);
    } else {
      alert('Saisie invalide.');
    }
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'message':
        if (this.messageForm.controls.message.touched && this.messageForm.controls.message.hasError('required')) {
          msg = 'Vous devez saisir un message';
        }
        if (this.messageForm.controls.message.touched && this.messageForm.controls.message.hasError('maxlength')) {
          msg = 'Le message doit comporter au maximum 150 caractères';
        }
        break;
    }
    return msg;
  }}
