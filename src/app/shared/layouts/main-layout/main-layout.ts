import { Component } from '@angular/core';
import { Sidebar } from "../../sidebar/sidebar";
import { Navebar } from "../../navebar/navebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Sidebar, Navebar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
