import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Banniere } from '../../../../shared/ui-components/banniere/banniere';
import { CardProjectActif } from '../../../../shared/ui-components/card-project-actif/card-project-actif';
import { ProjectsRecommander } from '../../../../shared/ui-components/projects-recommander/projects-recommander';
import { CardBadges } from '../../../../shared/ui-components/card-badges/card-badges';


@Component({
  selector: 'app-home',
  imports: [Banniere, CardProjectActif, ProjectsRecommander, CardBadges, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
