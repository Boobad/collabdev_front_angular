import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})
export class ForgetPassword {
 constructor(private router: Router) {} 

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
