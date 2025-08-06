import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Banniere } from '../../components/ui/banniere/banniere';
import { CardProjectActif } from '../../components/ui/card-project-actif/card-project-actif';
import { ProjectsRecommander } from '../../components/ui/projects-recommander/projects-recommander';
import { CardBadges } from '../../components/ui/card-badges/card-badges';
import { Navebar } from "../../components/shared/navebar/navebar";
import { Sidebar } from "../../components/shared/sidebar/sidebar";

@Component({
  selector: 'app-home',
  imports: [Banniere, CardProjectActif, ProjectsRecommander, CardBadges, Navebar, Sidebar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
