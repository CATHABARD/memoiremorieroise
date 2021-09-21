import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, OnDestroy {
  currentUser: any;

  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {
                this.userSubscription = this.authService.authSubject.subscribe(u => {
                  this.currentUser = u;
                })
                this.authService.emitUserChanged();
                }

    ngOnDestroy() {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
        if (this.currentUser) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }
}