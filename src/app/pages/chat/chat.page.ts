import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    ScrollingModule
  ],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  messages$: Observable<any[]>;
  newMsg = '';
  fromName = 'Chatty';


  constructor(private chatService: ChatService, private router: Router) {
    this.messages$ = this.chatService.getRecentMessages()
    .pipe(
      tap(messages => {
        console.log(messages);
      })
    );


  }

  ngOnInit() {
    // this.content.scrollToBottom();

  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom(300);

    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  callFunction(){
    this.content.scrollToBottom(0)
  }


  ngAfterViewInit() {
    // Set the initial scroll position to the bottom
    this.content.scrollToBottom();
  }

}
