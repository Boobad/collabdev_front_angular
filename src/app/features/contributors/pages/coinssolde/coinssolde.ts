import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CoinsTab } from '../../../../shared/ui-components/coins-tab/coins-tab';
import { CoinsService } from '../../../../core/coins-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrangeMoneyService } from '../../../../core/OrangeMoneyService';
import { HttpClient } from '@angular/common/http';
import { TransactionsService } from '../../../../core/transactions.service';

@Component({
  selector: 'app-coinssolde',
  standalone: true,
  imports: [CoinsTab, FormsModule, CommonModule],
  templateUrl: './coinssolde.html',
  styleUrls: ['./coinssolde.css']
})
export class Coinssolde implements OnInit {
  totalCoins = 0;
  isModalOpen = false;
  coinsToBuy = 1;
  selectedProvider = '';
  phoneNumber = '';
  pricePerCoin = 10;
  transactions: any[] = [];

  constructor(
    private orangeMoneyService: OrangeMoneyService, 
    private coinsService: CoinsService, 
    private cdr: ChangeDetectorRef, 
    private http: HttpClient,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId')) || 0;
    this.coinsService.coinsValue$.subscribe(v => { this.totalCoins = v; this.cdr.detectChanges(); });
    this.loadTransactions(userId);
  }

  openModal() { this.isModalOpen = true; }
  closeModal(event?: Event) { if(event) event.stopPropagation(); this.isModalOpen=false; this.resetForm(); }
  resetForm() { this.coinsToBuy=1; this.selectedProvider=''; this.phoneNumber=''; }
  adjustCoins(change: number) { if(this.coinsToBuy+change >= 1) this.coinsToBuy += change; }

 loadTransactions(userId: number) {
  this.transactionsService.getUserTransactions(userId).subscribe(
    res => { 
      this.transactions = res; 
      this.cdr.detectChanges(); 
    },
    err => console.error('Erreur chargement historique', err)
  );
}


  async submitPayment() {
    if(!this.selectedProvider){ alert('Sélectionnez un opérateur.'); return; }
    if(!this.phoneNumber.match(/^\+?[0-9]{8,15}$/)){ alert('Numéro invalide.'); return; }

    const amount = this.coinsToBuy * this.pricePerCoin;
    const orderId = 'ORDER_' + Date.now();
    const userId = Number(localStorage.getItem('userId')) || 0;

    try {
      // Créer transaction dans DB
      const response: any = await this.http.post('https://e8c1f9829683.ngrok-free.app/api/transactions', {
        user_id: userId,
        provider: this.selectedProvider,
        phone_number: this.phoneNumber,
        coins: this.coinsToBuy,
        amount,
        order_id: orderId
      }).toPromise();

      console.log('Transaction enregistrée', response);
      this.loadTransactions(userId);

      // Orange Money
      if(this.selectedProvider==='orange'){
        const transaction = await this.orangeMoneyService.createTransaction({
          merchant_key: '99410dd1',
          currency: 'XOF',
          order_id: orderId,
          amount,
          return_url: 'https://tonsite.com/success',
          cancel_url: 'https://tonsite.com/cancel',
          notif_url: 'https://e8c1f9829683.ngrok-free.app/api/orange-notification',
          lang: 'fr',
          reference: 'DoReMi Mali'
        });

        if(transaction?.payment_url) window.open(transaction.payment_url,'_blank');
        else alert('Erreur création transaction Orange Money.');
      }

    } catch(err) {
      console.error('Erreur transaction', err);
      alert('Impossible d’enregistrer la transaction.');
    }
  }
}
