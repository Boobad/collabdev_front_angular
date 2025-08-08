import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppInsufficientCoinsDialog } from '../app-insufficient-coins-dialog/app-insufficient-coins-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects-recommander',
  imports: [AppInsufficientCoinsDialog],
  templateUrl: './projects-recommander.html',
  styleUrl: './projects-recommander.css'
})
export class ProjectsRecommander {
  userCoins: number = 50; // À remplacer par la valeur réelle de l'utilisateur
  projectCoins: number = 100; // Coins nécessaires pour ce projet

  constructor(private router: Router, private dialog: MatDialog) {}

  onJoinProject() {
    if (this.userCoins >= this.projectCoins) {
      this.router.navigate(['/formulaire-participation']);
    } else {
      this.openInsufficientCoinsModal();
    }
  }

  openInsufficientCoinsModal() {
    this.dialog.open(AppInsufficientCoinsDialog, {
      width: '300px',
      data: {
        requiredCoins: this.projectCoins,
        userCoins: this.userCoins
      }
    });
  }
}
