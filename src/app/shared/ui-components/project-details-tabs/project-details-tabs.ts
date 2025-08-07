import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TachesTab } from '../taches-tab/taches-tab';
import { ApercuTab } from '../apercu-tab/apercu-tab';
import { EquipesDetailsTab } from '../equipes-details-tab/equipes-details-tab';
import { DiscussionDetailsTab } from '../discussion-details-tab/discussion-details-tab';

@Component({
  selector: 'app-project-details-tabs',
  standalone: true,
  imports: [CommonModule,TachesTab,ApercuTab,EquipesDetailsTab,DiscussionDetailsTab],
  templateUrl: './project-details-tabs.html',
  styleUrls: ['./project-details-tabs.css']
})
export class ProjectDetailsTabs {
  activeTab: string = 'overview';

  setTab(tab: string) {
    this.activeTab = tab;
  }

}
