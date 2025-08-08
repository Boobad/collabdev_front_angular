import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insufficient-coins-dialog',
  templateUrl: './app-insufficient-coins-dialog.html',
  styleUrls: ['./app-insufficient-coins-dialog.css']
})
export class AppInsufficientCoinsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppInsufficientCoinsDialog>,
    private router: Router
  ) {}

  onClose(): void {
    this.dialogRef.close(); // Ferme le dialogue sans action
    // Alternative avec retour de valeur :
    // this.dialogRef.close(false);
  }

  onBuyCoins(): void {
    this.dialogRef.close(); // Ferme d'abord le dialogue
    this.router.navigate(['/coins']); // Puis redirige
    // Alternative avec retour de valeur :
    // this.dialogRef.close(true);
    // this.router.navigate(['/buy-coins']);
  }
}
