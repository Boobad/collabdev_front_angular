import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TransactionsService } from '../../../core/transactions.service';


@Component({
  selector: 'app-coins-tab',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './coins-tab.html',
  styleUrls: ['./coins-tab.css']
})
export class CoinsTab implements OnInit {
  transactions: any[] = [];

  constructor(private transactionsService: TransactionsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId')) || 0;
    this.loadTransactions(userId);
  }

  loadTransactions(userId: number) {
    this.transactionsService.getUserTransactions(userId).subscribe(
      res => { this.transactions = res; this.cdr.detectChanges(); },
      err => console.error('Erreur chargement historique', err)
    );
  }

  getStatusClass(tx: any) {
    if(tx.status.toLowerCase() === 'complété') return 'status-completed';
    if(tx.status.toLowerCase() === 'échoué') return 'status-failed';
    return 'status-pending';
  }
}
