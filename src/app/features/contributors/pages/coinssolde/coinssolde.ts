
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CoinsTab } from '../../../../shared/ui-components/coins-tab/coins-tab';
import { CoinsService } from '../../../../core/coins-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrangeMoneyService } from '../../../../core/OrangeMoneyService';




@Component({
  selector: 'app-coinssolde',
  standalone: true,
  imports: [CoinsTab, FormsModule, CommonModule],
  templateUrl: './coinssolde.html',
  styleUrls: ['./coinssolde.css']
})
export class Coinssolde implements OnInit {
  // Icônes
 

  totalCoins: number = 0;
  isModalOpen = false;
  coinsToBuy: number = 1;
  selectedProvider: string = '';
  phoneNumber: string = '';
  pricePerCoin: number = 10; // Prix en FCFA par coin

  constructor(private orangeMoneyService: OrangeMoneyService, private coinsService: CoinsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.coinsService.coinsValue$.subscribe(value => {
      this.totalCoins = value;
      this.cdr.detectChanges();
    });
  }

  // Ouvrir la modal
  openModal() {
    this.isModalOpen = true;
  }

  // Fermer la modal
  closeModal(event?: Event) {
    if (event) event.stopPropagation();
    this.isModalOpen = false;
    this.resetForm();
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.coinsToBuy = 1;
    this.selectedProvider = '';
    this.phoneNumber = '';
  }

  // Ajuster la quantité de coins
  adjustCoins(change: number): void {
    const newValue = this.coinsToBuy + change;
    if (newValue >= 1) {
      this.coinsToBuy = newValue;
    }
  }

  // Soumettre le paiement
async submitPayment() {
  if (!this.selectedProvider) {
    alert('Veuillez sélectionner un opérateur.');
    return;
  }

  if (!this.phoneNumber.match(/^\+?[0-9]{8,15}$/)) {
    alert('Numéro de téléphone invalide.');
    return;
  }

  const amount = this.coinsToBuy * this.pricePerCoin;
  const orderId = 'ORDER_' + Date.now();

  if (this.selectedProvider === 'orange') {
    const transaction = await this.orangeMoneyService.createTransaction({
      merchant_key: '99410dd1',
      currency: 'XOF',
      order_id: orderId,
      amount: amount,
      return_url: 'https://tonsite.com/success',
      cancel_url: 'https://tonsite.com/cancel',
      notif_url: 'https://doremimali.com/api/success.php',
      lang: 'fr',
      reference: 'DoReMi Mali'
    });

    if (transaction && transaction.payment_url) {
      window.open(transaction.payment_url, '_blank');
    } else {
      alert('Erreur création transaction Orange Money.');
    }
  }
}

} 