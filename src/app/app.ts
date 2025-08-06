import { Component, signal } from '@angular/core';
import { TaskDetails } from "./contributeurs/pages/task-details/task-details";

@Component({
  selector: 'app-root',
  imports: [TaskDetails],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
