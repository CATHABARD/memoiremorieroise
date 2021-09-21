import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from '../../modeles/message';

@Component({
  selector: 'app-liste-messages',
  templateUrl: './liste-messages.component.html',
  styleUrls: ['./liste-messages.component.scss']
})
export class ListeMessagesComponent implements OnInit {
  displayedColumns: string[] = ['email', 'date', 'texte', 'action'];

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    this.messagesService.getMessagesNonLus();
  }

  onVu(row: any) {
    const message = new Message(row.date, row.email, row.texte, row.vu, row.id);
    this.messagesService.SoldeMessage(message);
  }

}
