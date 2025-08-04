import { Component } from '@angular/core';
import { CardsBadgeDetail } from '../../components/ui/cards-badge-detail/cards-badge-detail';
import { CardsBadge } from '../../components/ui/cards-badge/cards-badge';

@Component({
  selector: 'app-recompense-badge',
  imports: [CardsBadgeDetail, CardsBadge],
  templateUrl: './recompense-badge.html',
  styleUrl: './recompense-badge.css',
})
export class RecompenseBadge {}
