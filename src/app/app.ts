import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { PageContribution } from './contributeurs/pages/page-contribution/page-contribution';
import { RecompenseBadge } from './contributeurs/pages/recompense-badge/recompense-badge';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Navebar, RecompenseBadge, PageContribution, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
