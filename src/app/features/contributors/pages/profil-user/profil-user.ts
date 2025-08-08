import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profil-user.html',
  styleUrls: ['./profil-user.css']
})
export class ProfilUser {
  profileImage: string | ArrayBuffer | null = 'profil.png';
  fileInput: HTMLInputElement | null = null;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (event) => this.onFileSelected(event));
    document.body.appendChild(this.fileInput);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
        this.cdRef.detectChanges(); // Force la détection des changements
        // Réinitialise le champ fichier pour permettre la sélection du même fichier
        if (this.fileInput) {
          this.fileInput.value = '';
        }
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  ngOnDestroy() {
    if (this.fileInput) {
      document.body.removeChild(this.fileInput);
    }
  }
}
