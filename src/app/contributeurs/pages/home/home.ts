import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Banniere } from '../../components/ui/banniere/banniere';

@Component({
  selector: 'app-home',
  imports: [Banniere],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
