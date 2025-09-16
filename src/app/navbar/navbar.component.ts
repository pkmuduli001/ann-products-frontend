import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'aws-amplify/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userEmail: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
      this.isAdmin = state.isAdmin;
      this.userEmail = state.email;
    });

    // Restore state on refresh
    this.authService.restoreUser();
  }

  async logout() {
    await signOut();
    this.authService.clearUser();
    this.router.navigate(['/']);
  }
}
