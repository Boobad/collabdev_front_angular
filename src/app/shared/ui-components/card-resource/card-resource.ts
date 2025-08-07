import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-resource',
  imports: [FormsModule, DatePipe, CommonModule],
  templateUrl: './card-resource.html',
  styleUrl: './card-resource.css'
})
export class CardResource {
  selectedFilter: string = 'name';

  resources = [
    {
      title: 'Rapport d’étude patient 2025',
      contributor: 'Bakary Diallo',
      uploadDate: new Date('2025-08-01'),
      fileUrl: 'assets/resources/rapport-2025.pdf'
    },
    {
      title: 'Guide utilisateur v2',
      contributor: 'Mohamed Traoré',
      uploadDate: new Date('2025-07-25'),
      fileUrl: 'assets/resources/guide-v2.pdf'
    },
    {
      title: 'Base de données médicale',
      contributor: 'Tenen Sylla',
      uploadDate: new Date('2025-07-10'),
      fileUrl: 'assets/resources/db.zip'
    }
  ];

  filteredResources = [...this.resources];

  applyFilter() {
    switch (this.selectedFilter) {
      case 'name':
        this.filteredResources.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        this.filteredResources.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
        break;
      case 'contributor':
        this.filteredResources.sort((a, b) => a.contributor.localeCompare(b.contributor));
        break;
    }
  }

  downloadResource(resource: any) {
    const link = document.createElement('a');
    link.href = resource.fileUrl;
    link.download = resource.title;
    link.click();
  }
}
