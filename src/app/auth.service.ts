import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<{ isLoggedIn: boolean, isAdmin: boolean, email: string | null }>({
    isLoggedIn: false,
    isAdmin: false,
    email: null
  });

  authState$ = this.authState.asObservable();

   async getUserEmail(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      const payload = session.tokens?.idToken?.payload as any;
      return payload?.email ?? null;
    } catch {
      return null;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      return !!session.tokens?.idToken; // user has a token
    } catch {
      return false;
    }
  }

  // Call this after login
  setUserFromToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isAdmin = payload['cognito:groups']?.includes('Admins') || false;
    const email = payload.email || null;

    localStorage.setItem('token', token);

    this.authState.next({ isLoggedIn: true, isAdmin, email });
  }

  // Call this on logout
  clearUser() {
    localStorage.removeItem('token');
    this.authState.next({ isLoggedIn: false, isAdmin: false, email: null });
  }

  // Restore session on refresh
  restoreUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setUserFromToken(token);
    }
  }
}
