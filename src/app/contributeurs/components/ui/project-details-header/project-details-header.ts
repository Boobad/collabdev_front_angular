import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-details-header',
  imports: [],
  templateUrl: './project-details-header.html',
  styleUrl: './project-details-header.css'
})
export class ProjectDetailsHeader {
  constructor(private location: Location) {}

  goBack() {
    this.location.back(); // revient à la page précédente
  }
}
