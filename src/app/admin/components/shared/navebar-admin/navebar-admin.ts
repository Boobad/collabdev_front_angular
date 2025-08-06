import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navebar-admin',
  imports: [CommonModule],
  templateUrl: './navebar-admin.html',
  styleUrl: './navebar-admin.css'
})
export class NavebarAdmin {
showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  
}
