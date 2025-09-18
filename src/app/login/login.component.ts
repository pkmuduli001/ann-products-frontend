import { Component } from '@angular/core';
import { signIn, signUp, fetchAuthSession, confirmSignUp } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email = '';
  password = '';
  code = '';   // for OTP
  message = '';
  awaitingVerification = false;

  constructor(private authService: AuthService,private router: Router) {}

  async signup() {
    try {
      await signUp({
        username: this.email,
        password: this.password,
        options: {
          userAttributes: {
            email: this.email,
          },
        },
      });
      this.awaitingVerification = true;
      this.message = '✅ Signup successful. Please check your email for the verification code.';
    } catch (err: any) {
      this.message = '❌ Signup failed: ' + err.message;
    }
  }

  async verifySignup() {
    try {
      await confirmSignUp({
        username: this.email,
        confirmationCode: this.code,
      });
      this.message = '✅ Verification successful! You can now log in.';
      this.awaitingVerification = false;
    } catch (err: any) {
      this.message = '❌ Verification failed: ' + err.message;
    }
  }


  async login() {
  try {
    const session = await signIn({ username: this.email, password: this.password });
    const tokens = await fetchAuthSession();
    const idToken = tokens.tokens?.idToken?.toString();
    if (idToken) {
      this.authService.setUserFromToken(idToken);
      
        this.message = '✅ Login successful! Redirecting...';
        this.router.navigate(['/']);
        
    }
  } catch (err: any) {
    this.message = '❌ Login failed: ' + err.message;
  }
}
 
}
