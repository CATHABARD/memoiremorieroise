import { Injectable } from '@angular/core';
import { User } from '../modeles/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private angulatFirestore: AngularFirestore) { }

  getUsers() {
    return this.angulatFirestore.collection('Users').get(); 
}

  getUser(id: string) {
      return this.angulatFirestore.collection('Users').doc(id).get(); 
  }

  getUserByUid(uid: string) {
    return this.angulatFirestore.collection('Users', u => u.where('uid', '==', uid)).get(); 
  }

  addUser(user: User) {
    return this.angulatFirestore.collection('Users').add({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      status: user.status
    });
 
   }

  public changeDroitsUser(idUser: string, droits: number)  {
    this.angulatFirestore.collection('Users').doc(idUser).update({
      status: droits
    });
  }

}
