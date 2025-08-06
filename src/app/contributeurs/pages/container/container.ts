import { Component } from '@angular/core';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Navebar } from "../../components/shared/navebar/navebar";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-container',
  imports: [Sidebar, Navebar, RouterOutlet],
  templateUrl: './container.html',
  styleUrl: './container.css'
})
export class Container {

}
