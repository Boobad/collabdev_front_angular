import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wspace-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule],   // attention a ne pas mettre RouterLink ici
  templateUrl: './wspace-page-header.html',
  styleUrls: ['./wspace-page-header.css']
})
export class WspacePageHeader {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
