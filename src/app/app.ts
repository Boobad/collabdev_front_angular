import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { ModalCreateProject } from './contributeurs/components/ui/modal-create-project/modal-create-project';

@Component({
  selector: 'app-root',
  imports: [Sidebar,Navebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
  
}
