import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulaire-participation',
  templateUrl: './formulaire-participation.html',
  styleUrls: ['./formulaire-participation.scss']
})
export class ParticipationFormComponent implements OnInit {
  participationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.participationForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      portfolio: [''],
      specialty: [''],
      role: ['', [Validators.required]],
      motivation: ['', [Validators.required, Validators.minLength(600)]],
      experience: ['', [Validators.required, Validators.minLength(400)]]
    });
  }

  ngOnInit(): void {
    // Écoute les changements pour le comptage des caractères
    this.participationForm.get('motivation')?.valueChanges.subscribe(() => {
      // Le template gère déjà l'affichage
    });

    this.participationForm.get('experience')?.valueChanges.subscribe(() => {
      // Le template gère déjà l'affichage
    });
  }

  onSubmit(): void {
    if (this.participationForm.valid) {
      const formData = this.participationForm.value;
      const roleNames: { [key: string]: string } = {
        developer: 'Développeur',
        designer: 'Designer',
        manager: 'Chef de projet'
      };

      // En production, vous pourriez utiliser un service pour envoyer les données
      console.log('Formulaire soumis:', formData);
      
      // Redirection simulée
      alert(`Formulaire validé ! Préparation du test ${roleNames[formData.role]}...`);
      
      // En production: this.router.navigate(['/test', formData.role], { queryParams: { email: formData.email } });
    } else {
      // Marque tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.participationForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}