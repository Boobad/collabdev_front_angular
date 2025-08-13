import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CoinsTab } from '../../../../shared/ui-components/coins-tab/coins-tab';
import { CoinsService } from '../../../../core/coins-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



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

  constructor(private coinsService: CoinsService, private cdr: ChangeDetectorRef) {}

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
  submitPayment() {
    // Validation
    if (!this.selectedProvider) {
      alert('Veuillez sélectionner un opérateur.');
      return;
    }
    
    if (!this.phoneNumber.match(/^\+?[0-9]{8,15}$/)) {
      alert('Veuillez entrer un numéro de téléphone valide.');
      return;
    }
    
    if (this.coinsToBuy <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    // Simulation de paiement
    const paymentData = {
      provider: this.selectedProvider,
      phone: this.phoneNumber,
      coins: this.coinsToBuy,
      amount: this.coinsToBuy * this.pricePerCoin
    };

    console.log('Paiement en cours:', paymentData);
    
    // Après un paiement réussi
    this.totalCoins += this.coinsToBuy;
    this.coinsService.setCoinsValue(this.totalCoins);
    
    // Réinitialisation
    this.resetForm();
    this.closeModal();
    
    alert(`Paiement réussi! Vous avez acheté ${paymentData.coins} coins.`);
  }
}