import { Component } from '@angular/core';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService,private router: Router) {}

  async loginAsAdmin() {
  try {
    await signIn({ username: this.email, password: this.password });
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) return;

    const payload = JSON.parse(atob(idToken.split('.')[1]));
    if (payload['cognito:groups']?.includes('Admins')) {
      this.authService.setUserFromToken(idToken);
      this.message = '✅ Admin login successful! Redirecting...';
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.message = '❌ Access denied: You are not an admin.';
    }
  } catch (err: any) {
    this.message = '❌ Login failed: ' + err.message;
  }
 }
}
