import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../modeles/message';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as auth from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  listeMessagesNonLus: Message[] = [];
  pdfSubject = new Subject<Message[]>();


  constructor(private angularFirestore: AngularFirestore) { }

  emitMessage() {
    this.pdfSubject.next(this.listeMessagesNonLus);
  }

  public getMessagesNonLus() {
    this.angularFirestore.collection('Messages', m => m.where('lu', '==', false)).get().subscribe(data => {
      this.listeMessagesNonLus = data.docs.map(e => {
        const p = e.data() as Message;
        p.id = e.id;
        return p;
      });
    });
    this.emitMessage();
  }

  public addMessage(message: Message) {
    this.angularFirestore.collection('Messages').add({
        date: message.date.toJSON(),
        email: message.email,
        texte: message.texte,
        lu: message.lu
      }).catch(error => {
        console.log('Erreur ' + error);
      });
    }

  public SoldeMessage(m: Message) {
    this.angularFirestore.collection('Messages').doc(m.id).update({
      lu: true
    });
  }

}
