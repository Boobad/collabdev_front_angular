import { Component, signal } from '@angular/core';
import { SubmitContribution } from './contributeurs/pages/submit-contribution/submit-contribution';

@Component({
  selector: 'app-root',
  imports: [SubmitContribution],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
