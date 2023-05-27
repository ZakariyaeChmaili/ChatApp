import { TextFieldTypes } from './../../../node_modules/@ionic/core/dist/types/interface.d';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app';
import { switchMap, Observable, map, filter, combineLatest, take } from 'rxjs';
import { Timestamp } from '@firebase/firestore';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: any;
  // id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg?: boolean;
}

@Injectable({
  providedIn: 'root',
})
// export class ChatService {
//   currentUser: any = null;
//   private messagesCollection: AngularFirestoreCollection<Message>;
//   private PAGE_SIZE = 10;
//   public messages: Message[] = [];
//   constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
//     this.afAuth.onAuthStateChanged((user) => {
//       this.currentUser = user;
//     });

//     this.messagesCollection = afs.collection<Message>('messages', (ref) =>
//       ref.orderBy('createdAt', 'desc').limit(this.PAGE_SIZE)
//     );
//     this.getRecentMessages().subscribe((messages) => {
//       this.messages = messages;
//     });
//   }

//   getRecentMessages(): Observable<Message[]> {
//     return this.messagesCollection.valueChanges({ idField: 'id' }).pipe(
//       map((messages) => {
//         for (let m of messages) {
//           m.myMsg = this.currentUser.uid === m.from;
//         }
//         return messages.reverse();
//       })
//     );
//   }

//   addChatMessage(msg: any) {
//     return this.afs.collection('messages').add({
//       msg: msg,
//       from: this.currentUser.uid,
//       createdAt: Timestamp.fromDate(new Date()),
//     });
//   }
export class ChatService {
  currentUser: any = null;
  private messagesCollection: AngularFirestoreCollection<Message>;
  private PAGE_SIZE = 10;
  // public messages$: Observable<Message[]>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
            this.currentUser = user;
          });

    this.messagesCollection = this.afs.collection<Message>('messages', (ref) =>
      ref.orderBy('createdAt', 'desc').limit(this.PAGE_SIZE)
    );

    // this.messages$ = combineLatest([
    //   this.currentUser$,
    //   this.getRecentMessages(),
    // ]).pipe(
    //   map(([currentUser, messages]) => {
    //     // console.log(
    //     //   messages
    //     //     .map((m) => ({
    //     //       ...m,
    //     //       myMsg: currentUser.uid === m.from,
    //     //     }))
    //     //     .reverse()
    //     // );
    //     return messages
    //       .map((m) => ({
    //         ...m,
    //         myMsg: currentUser.uid === m.from,
    //       }))
    //       .reverse();
    //   })
    // );
  }

  getRecentMessages(): Observable<Message[]> {
    return this.messagesCollection.valueChanges({ idField: 'id' }).pipe(
      map((messages) => {
        console.log(messages);
        for (let m of messages) {
          m.myMsg = this.currentUser.uid === m.from;
        }
        // return messages;
        return messages.reverse();
      }
      )
    );
  }

  addChatMessage(msg: any) {
    return this.afs.collection('messages').add({
      msg: msg,
      from: this.currentUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
    });
  }

  async signup(user: any): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );

    const uid = credential.user?.uid;

    // this.afs.doc('test/1').set({
    //   test: 'test',
    // });
    return this.afs.doc(`users/${uid}`).set({
      uid,
      email: credential.user?.email,
      createAt: Timestamp.fromDate(new Date()),
    });
  }

  signIn(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  signOut(): Promise<void> {
    localStorage.removeItem('user');
    return this.afAuth.signOut();
  }

  // TODO Chat functionality

  updateChatMessage(msg: any) {
    let query = this.afs.collection('messages', (ref) =>
      ref.limit(this.PAGE_SIZE)
    );
  }

  // getChatMessages(lastVisible?: any): Observable<Message[]> {
  //   // let users:any = [];
  //   // return this.getUsers().pipe(
  //   //   switchMap(res => {
  //   //     users = res;
  //   //     let query= this.afs.collection('messages', ref =>
  //   //     ref.orderBy('createdAt','desc').limit(this.PAGE_SIZE)).snapshotChanges().subscribe({

  //   //     }) ;

  //   //     console.log('the users')
  //   //     console.log(users)
  //   //     console.log('the query')
  //   //     console.log(query)
  //   //     // if (lastVisible) {
  //   //     //   query = query.startAfter(lastVisible);
  //   //     // }

  //   //     return query;

  //   //   }),
  //   //   map(messages => {
  //   //     // Get the real name for each user
  //   //     for (let m of messages) {
  //   //       m.fromName = this.getUserForMsg(m.from, users);
  //   //       m.myMsg = this.currentUser.uid === m.from;
  //   //     }
  //   //     return messages
  //   //   })
  //   // )

  //   let query = this.afs
  //     .collection('messages', (ref) =>
  //       ref
  //         .orderBy('createdAt', 'desc')
  //         //  .startAfter(lastVisible || 0)
  //         .limit(this.PAGE_SIZE)
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((changes) => {
  //         let addedMessages = changes
  //           .filter((c) => c.type === 'modified')
  //           .map((c) => c.payload.doc.data() as Message);
  //         addedMessages.reverse();
  //         console.log(addedMessages);
  //         console.log(this.messages);
  //         this.messages = addedMessages.concat(this.messages);
  //         // this.messages.push(...addedMessages);
  //         return this.messages;
  //       })
  //     );
  //   return query;
  // }

  private getUsers() {
    return this.afs
      .collection('users')
      .valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  private getUserForMsg(msgFromId: any, users: User[]): string {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }
}
