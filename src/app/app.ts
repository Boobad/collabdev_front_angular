import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { ModalCreateProject } from './contributeurs/components/ui/modal-create-project/modal-create-project';
import { ProfilUser } from "./contributeurs/pages/profil-user/profil-user";


@Component({
  selector: 'app-root',
  imports: [ProfilUser, Navebar, Sidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
  
}
