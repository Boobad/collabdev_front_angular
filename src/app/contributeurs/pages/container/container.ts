import { Component } from '@angular/core';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Navebar } from "../../components/shared/navebar/navebar";
import { RouterOutlet } from '@angular/router';
import { Home } from '../home/home';


@Component({
  selector: 'app-container',
  imports: [Sidebar, Navebar, RouterOutlet, Home],
  templateUrl: './container.html',
  styleUrl: './container.css'
})
export class Container {

}
