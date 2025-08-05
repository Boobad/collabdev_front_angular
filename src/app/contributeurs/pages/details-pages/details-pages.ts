import { Component } from '@angular/core';
import { ProjectDetailsHeader } from '../../components/ui/project-details-header/project-details-header';
import { ProjectDetailsTabs } from '../../components/ui/project-details-tabs/project-details-tabs';
import { ProjectDetailsContent } from '../../components/ui/project-details-content/project-details-content';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-pages',
  imports: [ProjectDetailsHeader,ProjectDetailsTabs,CommonModule],
  templateUrl: './details-pages.html',
  styleUrl: './details-pages.css'
})
export class DetailsPages {

}
