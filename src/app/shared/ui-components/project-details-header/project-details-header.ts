import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-details-header',
  imports: [RouterLink],
  templateUrl: './project-details-header.html',
  styleUrl: './project-details-header.css'
})
export class ProjectDetailsHeader {
  constructor(private location: Location) {}

  goBack() {
    this.location.back(); // revient à la page précédente
  }
}
