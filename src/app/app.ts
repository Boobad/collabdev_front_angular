import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { ModalCreateProject } from './contributeurs/components/ui/modal-create-project/modal-create-project';
import { ListeDemandeParticipation } from './contributeurs/pages/liste-demande-participation/liste-demande-participation';

@Component({
  selector: 'app-root',
  imports: [Navebar, ListeDemandeParticipation, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
  
}
