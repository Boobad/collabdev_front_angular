import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css'],
})
export class Quiz implements OnInit, OnDestroy {
  currentQuestion = 0;
  userAnswers: { [key: number]: number } = {};
  timeLeft = 300; // 5 minutes en secondes
  timerInterval: any;
  score = 0;
  quizCompleted = false;
  hasAttempted = false; // Suivi de la tentative unique
  progress = 0; // Progression en pourcentage
  questionCountText = ''; // Texte du compteur de questions

  quizData = [
    {
      question:
        'Quelle est la principale différence entre React Native et Flutter ?',
      subtitle:
        'Sélectionnez la réponse qui décrit le mieux la différence fondamentale entre ces deux frameworks.',
      options: [
        {
          text: 'React Native utilise JavaScript, Flutter utilise Dart',
          description:
            'Les deux frameworks utilisent des langages de programmation différents',
          correct: true,
        },
        {
          text: 'React Native est plus rapide que Flutter',
          description: 'Performance supérieure de React Native',
          correct: false,
        },
        {
          text: 'Flutter est développé par Facebook, React Native par Google',
          description: 'Différence au niveau des entreprises développeuses',
          correct: false,
        },
        {
          text: "Il n'y a pas de différence significative",
          description: 'Les deux frameworks sont identiques',
          correct: false,
        },
      ],
    },
    {
      question: "Qu'est-ce que le Virtual DOM dans React ?",
      subtitle: 'Choisissez la définition la plus précise du Virtual DOM.',
      options: [
        {
          text: 'Une copie en mémoire du DOM réel',
          description:
            'Représentation virtuelle pour optimiser les performances',
          correct: true,
        },
        {
          text: 'Un serveur virtuel pour React',
          description: 'Infrastructure de déploiement',
          correct: false,
        },
        {
          text: 'Une base de données virtuelle',
          description: 'Système de stockage de données',
          correct: false,
        },
        {
          text: 'Un framework CSS',
          description: 'Outil de stylisation',
          correct: false,
        },
      ],
    },
    // Pas d'autres questions ajoutées, donc 2 au total
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.hasAttempted) {
      this.endQuiz();
      return;
    }
    this.startTimer();
    this.renderQuestion();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.endQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    const timerElement = document.getElementById('timeDisplay') as HTMLElement;
    if (timerElement) timerElement.textContent = timeString;

    const timer = document.getElementById('timer');
    const timerIcon = document.getElementById('timerIcon');
    if (timer && timerIcon && this.timeLeft <= 60) {
      timer.classList.add('warning');
      timerIcon.classList.add('warning');
    }
  }

  renderQuestion() {
    if (this.currentQuestion >= this.quizData.length || this.hasAttempted) {
      this.endQuiz();
      return;
    }
    this.updateProgress();
  }

  saveAnswer(answerIndex: number) {
    this.userAnswers[this.currentQuestion] = answerIndex;
  }

  nextQuestion() {
    if (this.currentQuestion < this.quizData.length - 1) {
      this.currentQuestion++;
      this.renderQuestion();
    } else {
      this.endQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.renderQuestion();
    }
  }

  updateProgress() {
    this.progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;
    this.questionCountText = `Question ${this.currentQuestion + 1} sur ${
      this.quizData.length
    }`;
  }

  endQuiz() {
    clearInterval(this.timerInterval);
    this.quizCompleted = true;
    this.hasAttempted = true;

    let correctAnswers = 0;
    for (let i = 0; i < this.quizData.length; i++) {
      if (this.userAnswers[i] !== undefined) {
        const question = this.quizData[i];
        if (question.options[this.userAnswers[i]]?.correct) {
          correctAnswers++;
        }
      }
    }

    this.score = Math.round((correctAnswers / this.quizData.length) * 100);
  }

  getCorrectAnswers(): number {
    let correctAnswers = 0;
    for (let i = 0; i < this.quizData.length; i++) {
      if (this.userAnswers[i] !== undefined) {
        const question = this.quizData[i];
        if (question.options[this.userAnswers[i]]?.correct) {
          correctAnswers++;
        }
      }
    }
    return correctAnswers;
  }

  getTimeUsed(): string {
    const timeUsed = 300 - this.timeLeft;
    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  retryQuiz() {
    this.router.navigate(['/projects']);
  }
}
