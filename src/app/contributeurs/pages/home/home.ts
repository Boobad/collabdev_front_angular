import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Banniere } from '../../components/ui/banniere/banniere';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Navebar } from "../../components/shared/navebar/navebar";

@Component({
  selector: 'app-home',
  imports: [Banniere, Sidebar, Navebar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
