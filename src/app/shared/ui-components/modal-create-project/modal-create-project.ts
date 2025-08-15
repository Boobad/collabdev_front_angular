import { Component } from '@angular/core';
import { ProjectPayload, ProjectsService } from '../../../core/projects-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-create-project',
  imports: [CommonModule],
  templateUrl: './modal-create-project.html',
  styleUrls: ['./modal-create-project.css']
})
export class ModalCreateProject {
  selectedFile: File | null = null;
  fileName: string = 'Aucun fichier sélectionné';
  isSubmitting: boolean = false;
  lastCreatedProjectId: string | null = null;

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  openModal(): void {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.add('active');
  }

  closeModal(): void {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.fileName = 'Aucun fichier sélectionné';
    }
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting = true;

    const form = event.target as HTMLFormElement;

    // Récupération des valeurs
    const titre = (form.querySelector('#projectTitle') as HTMLInputElement).value.trim();
    const description = (form.querySelector('#projectDescription') as HTMLTextAreaElement).value.trim();
    const domaine = (form.querySelector('#projectDomain') as HTMLSelectElement).value.toUpperCase();
    const secteur = (form.querySelector('#projectSector') as HTMLSelectElement).value.toUpperCase();
    const role = (form.querySelector('input[name="projectRole"]:checked') as HTMLInputElement)?.value || 'PORTEUR_DE_PROJET';

    if (!titre || !description || !secteur) {
      alert('Veuillez remplir les champs obligatoires');
      this.isSubmitting = false;
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Utilisateur non connecté');
      this.isSubmitting = false;
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const userId = user.id;

      const projectPayload: ProjectPayload = { titre, description, domaine, secteur, role };

      // Création du FormData pour l’upload multipart
      const formData = new FormData();
      formData.append('projet', new Blob([JSON.stringify(projectPayload)], { type: 'application/json' }));
      if (this.selectedFile) {
        formData.append('cahierDesCharges', this.selectedFile, this.selectedFile.name);
      }

      this.projectsService.createProjectMultipart(userId, formData).subscribe({
        next: (response: any) => {
          this.lastCreatedProjectId = response.id;
          this.showSuccessModal();
          this.resetForm(form);
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('Erreur création projet:', err);
          alert(`Erreur lors de la création du projet: ${err.error?.message || err.message}`);
          this.isSubmitting = false;
        }
      });

    } catch (error: any) {
      console.error('Erreur inattendue:', error);
      alert('Une erreur inattendue est survenue');
      this.isSubmitting = false;
    }
  }

  showSuccessModal(): void {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
  }

  closeSuccessModal(): void {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
  }

  viewProject(): void {
    if (this.lastCreatedProjectId) {
      this.router.navigate(['/projects', this.lastCreatedProjectId]);
    }
    this.closeSuccessModal();
  }

  private resetForm(form: HTMLFormElement): void {
    form.reset();
    this.selectedFile = null;
    this.fileName = 'Aucun fichier sélectionné';
  }
}
