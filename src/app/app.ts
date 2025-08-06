import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { ModalCreateProject } from './contributeurs/components/ui/modal-create-project/modal-create-project';
import { ProfilUser } from "./contributeurs/pages/profil-user/profil-user";
import { PageGestionnaire } from './contributeurs/pages/page-gestionnaire/page-gestionnaire';


@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [ProfilUser, Navebar, Sidebar, RouterOutlet],
=======
  imports: [PageGestionnaire, Navebar, Sidebar],
>>>>>>> 42bfea48d0c2c8b619ac9c2e39c182dd6f67e95c
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
  
}
