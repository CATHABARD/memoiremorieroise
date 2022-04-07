import { Injectable } from '@angular/core';
import { User } from '../modeles/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private angularFirestore: AngularFirestore) { }

  getUsers() {
    return this.angularFirestore.collection('Users').get(); 
}

  getUser(id: string) {
      return this.angularFirestore.collection('Users').doc(id).get(); 
  }

  getUserByUid(uid: string ) {
    return this.angularFirestore.collection('Users/', u => u.where('uid', '==', uid)).get();
  }

  addUser(user: User) {
    return this.angularFirestore.collection('Users').add({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      status: user.status
    });
 
   }

  public changeDroitsUser(idUser: string, droits: number)  {
    console.log(idUser + '  '  + droits);
    this.angularFirestore.collection('Users').doc(idUser).update({
      status: droits
    });
  }

}
