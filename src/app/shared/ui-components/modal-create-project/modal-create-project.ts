import { Component } from '@angular/core';
import { ProjectPayload, ProjectsService } from '../../../core/projects-service';

@Component({
  selector: 'app-modal-create-project',
  templateUrl: './modal-create-project.html',
  styleUrls: ['./modal-create-project.css']
})
export class ModalCreateProject {
  selectedFile: File | null = null;
  fileName: string = 'Aucun fichier sélectionné';
  isSubmitting: boolean = false;

  constructor(private projectsService: ProjectsService) {}

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
      this.fileName = this.selectedFile?.name || 'Fichier sélectionné';
    } else {
      this.selectedFile = null;
      this.fileName = 'Aucun fichier sélectionné';
    }
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting = true;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const titre = formData.get('projectTitle') as string;
    const description = formData.get('projectDescription') as string;
    const domaine = (formData.get('projectDomain') as string || '').toUpperCase();
    const secteur = (formData.get('projectSector') as string || '').toUpperCase();
    const role = (formData.get('projectRole') as string) || 'ideator';

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

      let fileUrl: string | undefined;
      if (this.selectedFile) {
        try {
          const uploadResponse = await this.projectsService.uploadFile(this.selectedFile).toPromise();
          fileUrl = uploadResponse?.fileUrl;
        } catch (uploadError) {
          console.error('Erreur lors de l\'upload:', uploadError);
          alert('Erreur lors de l\'upload du fichier');
          this.isSubmitting = false;
          return;
        }
      }

      const projectPayload: ProjectPayload = {
        titre: titre.trim(),
        description: description.trim(),
        domaine,
        secteur,
        urlCahierDeCharge: fileUrl,
        role
      };

      console.log('Payload à envoyer:', projectPayload);

      this.projectsService.createProject(userId, projectPayload).subscribe({
        next: () => {
          alert('Projet créé avec succès !');
          this.resetForm(form);
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur création projet:', err);
          alert(`Erreur lors de la création: ${err.error?.message || err.message}`);
        },
        complete: () => this.isSubmitting = false
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur inattendue est survenue');
      this.isSubmitting = false;
    }
  }

  private resetForm(form: HTMLFormElement): void {
    form.reset();
    this.selectedFile = null;
    this.fileName = 'Aucun fichier sélectionné';
  }
}
