import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        this.router.navigate(['/admin-login']);
        return false;
      }

      // Decode JWT payload
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const groups = payload['cognito:groups'] || [];

      if (groups.includes('Admins')) {
        return true;
      } else {
        alert('Access denied: Admins only!');
        this.router.navigate(['/']);
        return false;
      }
    } catch (err) {
      console.error('Guard error:', err);
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}
