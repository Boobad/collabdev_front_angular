import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demarrage-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demarrage-quiz.html',
  styleUrls: ['./demarrage-quiz.css'],
})
export class DemarrageQuiz {
  constructor(private router: Router) {}

  startQuiz() {
    // Redirige vers une route fictive pour le quiz (à ajuster selon votre logique)
    this.router.navigate(['/quiz']);
  }
}
