import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TachesTab } from '../taches-tab/taches-tab';
import { EquipesDetailsTab } from '../equipes-details-tab/equipes-details-tab';
import { DiscussionDetailsTab } from '../discussion-details-tab/discussion-details-tab';
import { ApercuTab } from '../apercu-tab/apercu-tab';
import { SettingsTab } from "../settings-tab/settings-tab";

type UserRole = 'ideateur' | 'gestionnaire';

@Component({
  selector: 'app-project-details-tabs',
  standalone: true,
  imports: [CommonModule, TachesTab, ApercuTab, EquipesDetailsTab, DiscussionDetailsTab, SettingsTab],
  templateUrl: './project-details-tabs.html',
  styleUrls: ['./project-details-tabs.css']
})
export class ProjectDetailsTabs {
  @Input() userRole: UserRole = 'gestionnaire'; // Rôle par défaut
  activeTab: string = 'overview';

  // Définition des onglets disponibles par rôle
  get availableTabs() {
    const commonTabs = [
      { id: 'overview', label: 'Aperçu', icon: 'fa-home' },
      { id: 'discussions', label: 'Discussions', icon: 'fa-comments' }
    ];

    if (this.userRole === 'gestionnaire') {
      return [
        ...commonTabs,

        { id: 'team', label: 'Équipe', icon: 'fa-users' },
        { id: 'settings', label: 'Paramètres', icon: 'fa-cog' }
      ];
    } else {
      return [
        ...commonTabs,
        { id: 'team', label: 'Équipe', icon: 'fa-users' }
      ];
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  isTabVisible(tabId: string): boolean {
    return this.availableTabs.some(tab => tab.id === tabId);
  }
}
