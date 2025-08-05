import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';
import { ForgetPassword } from "./contributeurs/pages/forget-password/forget-password";
import { Login } from './contributeurs/pages/login/login';
import { Home } from "./contributeurs/pages/home/home";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navebar, Sidebar, RouterLink, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
}
