import { Component, signal } from '@angular/core';
import { TaskDetails } from "./contributeurs/pages/task-details/task-details";
import { WorkspaceProject } from "./contributeurs/pages/workspace-project/workspace-project";

@Component({
  selector: 'app-root',
  imports: [TaskDetails, WorkspaceProject],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
