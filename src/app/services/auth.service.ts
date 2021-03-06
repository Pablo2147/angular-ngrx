import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private user: Usuario;

  get userAuth() {
    return this.user;
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
    ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe(
          (firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this.user = user;
            this.store.dispatch( authActions.setUser({user}));
          });
      } else {
        this.user = null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItem());
      }
    });

  }

  crearUsuario( nombre: string, email: string, password: string ) {
    return this.auth.createUserWithEmailAndPassword( email, password )
            .then( ({ user }) => {

              const newUser = new Usuario( user.uid, nombre, user.email );

              return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });

            });

  }

  loginUsuario( email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
