import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-liste-demande-participation',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './liste-demande-participation.html',
  styleUrls: ['./liste-demande-participation.css']
})
export class ListeDemandeParticipation {
   searchQuery = '';
  statusFilter = 'all';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  allCandidates = [
    {
      id: 1,
      name: 'Sogoba Nunu',
      email: 'ab94604191@gmail.com',
      date: '15/06/2023',
      status: 'pending',
      score: 85,
      notifications: 0
    },
    {
      id: 2,
      name: 'Malmartou Nunu',
      email: 'Malmartou@gmail.com',
      date: '22/02/2023',
      status: 'approved',
      score: 92,
      notifications: 1
    },
    {
      id: 3,
      name: 'B2o Nunu',
      email: 'bakarydiallo312@gmail.com',
      date: '22/02/2023',
      status: 'rejected',
      score: 45,
      notifications: 0
    },
    {
      id: 4,
      name: 'Alice Dupont',
      email: 'alice.dupont@example.com',
      date: '10/05/2023',
      status: 'pending',
      score: 78,
      notifications: 0
    },
    {
      id: 5,
      name: 'Jean Martin',
      email: 'jean.martin@example.com',
      date: '05/07/2023',
      status: 'approved',
      score: 88,
      notifications: 2
    }
  ];

  filteredCandidates = [...this.allCandidates];

  constructor(private router: Router) {
    this.calculateTotalPages();
  }

  // Navigation
  goBack() {
    this.router.navigate(['/dashboard']); // Adaptez selon votre routing
  }

  // Filtrage et recherche
  filterCandidates() {
    this.filteredCandidates = this.allCandidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || candidate.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  // Gestion des statuts
  updateStatus(id: number, status: 'approved' | 'rejected') {
    const candidate = this.allCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.status = status;
      this.filterCandidates();
    }
  }

  notify(id: number) {
    const candidate = this.allCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.notifications++;
    }
  }

  // Pagination
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredCandidates.length / this.itemsPerPage) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedCandidates() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCandidates.slice(start, start + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // Helpers
  getStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return statusTexts[status] || status;
  }
}
