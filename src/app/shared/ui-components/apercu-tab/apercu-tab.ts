import { Component } from '@angular/core';
import { ResumerProjet } from '../resumer-projet/resumer-projet';
import { ProgressionTab } from '../progression-tab/progression-tab';
import { ActiviterRecentTab } from '../activiter-recent-tab/activiter-recent-tab';
import { EquipeProjetTab } from '../equipe-projet-tab/equipe-projet-tab';

@Component({
  selector: 'app-apercu-tab',
  imports: [ResumerProjet,ProgressionTab,ActiviterRecentTab,EquipeProjetTab],
  templateUrl: './apercu-tab.html',
  styleUrl: './apercu-tab.css'
})
export class ApercuTab {

}
