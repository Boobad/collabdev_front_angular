import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Question, Questionnaire, QuestionnaireEvaluation, QuestionnaireService } from '../../../../core/question-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-questionnaire-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule
  ],
  templateUrl: './questionnaire-management.html',
  styleUrls: ['./questionnaire-management.css']
})
export class QuestionnaireManagement implements OnInit {
  questionnaireForm!: FormGroup;
  evaluationForm!: FormGroup;
  projectId!: number;
  questionnaires: Questionnaire[] = [];
  selectedQuestionnaire: Questionnaire | null = null;
  viewMode: 'list' | 'create' | 'edit' | 'evaluate' = 'list';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionnaireService: QuestionnaireService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // <-- Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('idProjet')! || 2;
    this.initializeForms();
    this.loadQuestionnaires();

    // Détecter changements sur le FormArray questions
    this.questions.valueChanges.subscribe((questions) => {
      console.log('Questions updated:', questions);
      this.cdr.detectChanges(); // <-- Forcer détection
    });
  }

  private initializeForms(): void {
    this.questionnaireForm = this.fb.group({
      id: [0],
      titre: ['', Validators.required],
      description: [''],
      type: ['GESTIONNAIRE', Validators.required],
      dureeEstimee: [0, [Validators.required, Validators.min(1)]],
      contributeurId: [0, Validators.required],
      projetId: [this.projectId],
      questions: this.fb.array([])
    });

    this.evaluationForm = this.fb.group({
      reponses: this.fb.group({}),
      participantId: [0, Validators.required],
      commentaire: ['']
    });
  }

  get questions(): FormArray {
    return this.questionnaireForm.get('questions') as FormArray;
  }

  get responseControls(): FormGroup {
    return this.evaluationForm.get('reponses') as FormGroup;
  }

  loadQuestionnaires(): void {
    this.questionnaireService.getQuestionnairesByProject(this.projectId).subscribe({
      next: (data) => {
        console.log('Questionnaires loaded:', data);
        this.questionnaires = data;

        // Si on veut pré-remplir les questions du premier questionnaire
        if(data.length > 0){
          this.selectedQuestionnaire = data[0];
          this.questions.clear();
          data[0].questions.forEach(q => this.questions.push(this.initQuestion(q)));
          console.log('Questions loaded into FormArray:', this.questions.value);
          this.cdr.detectChanges(); // <-- Forcer Angular à mettre à jour
        }
      },
      error: (err) => {
        console.error('Failed to load questionnaires:', err);
        this.showError('Failed to load questionnaires');
      }
    });
  }

  initQuestion(question?: Question): FormGroup {
    return this.fb.group({
      id: [question?.id || 0],
      question: [question?.question || '', Validators.required],
      options: [question?.options || ['', '']], // au moins 2 options vides
      indexReponse: [question?.indexReponse?.map(String) || [], Validators.required]
    });
  }

  addQuestion(): void {
    const newQuestion = this.initQuestion();
    this.questions.push(newQuestion);
    console.log('Question added:', newQuestion.value);
    this.cdr.detectChanges();
  }

  removeQuestion(index: number): void {
    console.log('Removing question at index:', index, this.questions.at(index).value);
    this.questions.removeAt(index);
    this.cdr.detectChanges();
  }

  addOption(questionIndex: number): void {
    const options = this.questions.at(questionIndex).get('options')!.value as string[];
    options.push('');
    this.questions.at(questionIndex).get('options')!.setValue(options);
    console.log(`Option added to question ${questionIndex}:`, options);
    this.cdr.detectChanges();
  }

  toggleOption(questionIndex: number, optionIndex: number, event: any): void {
    const control = this.questions.at(questionIndex).get('indexReponse') as FormControl;
    const value = control.value as string[];
    if(event.checked){
      control.setValue([...value, optionIndex.toString()]);
    } else {
      control.setValue(value.filter(v => v !== optionIndex.toString()));
    }
    console.log(`Question ${questionIndex} selected options:`, control.value);
    this.cdr.detectChanges();
  }

  createQuestionnaire(): void {
    console.log('Create questionnaire clicked');
    this.viewMode = 'create';
    this.questionnaireForm.reset({
      id: 0,
      type: 'GESTIONNAIRE',
      dureeEstimee: 0,
      contributeurId: 0,
      projetId: this.projectId
    });
    this.questions.clear();
    this.addQuestion();
    this.cdr.detectChanges();
  }

  editQuestionnaire(questionnaire: Questionnaire): void {
    console.log('Edit questionnaire clicked:', questionnaire);
    this.viewMode = 'edit';
    this.selectedQuestionnaire = questionnaire;
    this.questionnaireForm.patchValue({ ...questionnaire, questions: [] });
    this.questions.clear();
    questionnaire.questions.forEach(q => this.questions.push(this.initQuestion(q)));
    this.cdr.detectChanges();
  }

  evaluateQuestionnaire(questionnaire: Questionnaire): void {
    console.log('Evaluate questionnaire clicked:', questionnaire);
    this.viewMode = 'evaluate';
    this.selectedQuestionnaire = questionnaire;
    this.evaluationForm.reset({ participantId: 0, commentaire: '' });

    const reponsesGroup = this.fb.group({});
    questionnaire.questions.forEach(q => {
      reponsesGroup.addControl(`question_${q.id}`, this.fb.control([], Validators.required));
    });
    this.evaluationForm.setControl('reponses', reponsesGroup);
    this.cdr.detectChanges();
  }

  submitQuestionnaire(): void {
    if (this.questionnaireForm.invalid) {
      console.log('Form invalid:', this.questionnaireForm.value);
      return;
    }

    const formData = this.questionnaireForm.value;
    formData.projetId = this.projectId;
    console.log('Submitting questionnaire:', formData);

    const request$ = formData.id === 0
      ? this.questionnaireService.createQuestionnaire(this.projectId, formData.contributeurId, formData)
      : this.questionnaireService.updateQuestionnaire(formData.id, formData);

    request$.subscribe({
      next: () => {
        console.log('Questionnaire saved successfully');
        this.showSuccess('Questionnaire saved successfully');
        this.viewMode = 'list';
        this.loadQuestionnaires();
      },
      error: (err) => {
        console.error('Failed to save questionnaire:', err);
        this.showError('Failed to save questionnaire');
      }
    });
  }

  submitEvaluation(): void {
    if (this.evaluationForm.invalid || !this.selectedQuestionnaire) {
      console.log('Evaluation form invalid:', this.evaluationForm.value);
      return;
    }

    const evaluationData: QuestionnaireEvaluation = {
      reponses: this.evaluationForm.value.reponses,
      participantId: this.evaluationForm.value.participantId,
      commentaire: this.evaluationForm.value.commentaire
    };
    console.log('Submitting evaluation:', evaluationData);

    this.questionnaireService.evaluateQuestionnaire(this.selectedQuestionnaire.id, evaluationData).subscribe({
      next: (result) => {
        console.log('Evaluation submitted. Score:', result.score);
        this.showSuccess(`Evaluation submitted. Score: ${result.score}`);
        this.viewMode = 'list';
      },
      error: (err) => {
        console.error('Failed to submit evaluation:', err);
        this.showError('Failed to submit evaluation');
      }
    });
  }

  cancel(): void {
    console.log('Cancel clicked');
    this.viewMode = 'list';
    this.selectedQuestionnaire = null;
    this.cdr.detectChanges();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
  updateOption(questionIndex: number, optionIndex: number, event: any): void {
  const options = [...this.questions.at(questionIndex).get('options')!.value];
  options[optionIndex] = event.target.value;
  this.questions.at(questionIndex).get('options')!.setValue(options);
}
}
