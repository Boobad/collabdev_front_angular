import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-projet-admin',
  imports: [CommonModule],
  templateUrl: './projet-admin.html',
  styleUrl: './projet-admin.css'
})
export class ProjetAdmin {
 showMessage: boolean = false;
  isSuccess: boolean = true;

  onValidateClick() {
    this.isSuccess = true;
    this.showMessage = true;
  }

  onRejectClick() {
    this.isSuccess = false;
    this.showMessage = true;
  }

  hideMessage() {
    this.showMessage = false;
  }

}
