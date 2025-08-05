import { Component, signal } from '@angular/core';
import { FormLogin } from './contributeurs/pages/form-login/form-login';
import { WorkspaceProject } from './contributeurs/pages/workspace-project/workspace-project';

@Component({
  selector: 'app-root',
  imports: [WorkspaceProject],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
