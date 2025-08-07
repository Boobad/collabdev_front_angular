import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsTabs } from '../../../../shared/ui-components/project-details-tabs/project-details-tabs';
import { ProjectDetailsHeader } from '../../../../shared/ui-components/project-details-header/project-details-header';

@Component({
  selector: 'app-details-pages',
  imports: [ProjectDetailsHeader,ProjectDetailsTabs,CommonModule],
  templateUrl: './details-pages.html',
  styleUrl: './details-pages.css'
})
export class DetailsPages {

}
