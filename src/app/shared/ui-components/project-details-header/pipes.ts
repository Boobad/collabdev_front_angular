import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'secteurDisplay' })
export class SecteurDisplayPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'Inconnu';
    
    switch(value) {
      case 'SANTE': return 'Santé';
      case 'EDUCATION': return 'Éducation';
      case 'AGRICULTURE': return 'Agriculture';
      case 'TRANSPORTS': return 'Transports';
      case 'FINANCE': return 'Finance';
      case 'INFORMATIQUE': return 'Informatique';
      default: return value;
    }
  }
}

@Pipe({ name: 'statutDisplay' })
export class StatutDisplayPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'Inconnu';
    
    switch(value) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'EN_ATTENTE': return 'En attente';
      default: return value;
    }
  }
}
