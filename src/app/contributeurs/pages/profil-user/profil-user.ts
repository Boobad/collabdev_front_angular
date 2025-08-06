import { Component } from '@angular/core';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Navebar } from "../../components/shared/navebar/navebar";
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profil-user',
  imports: [RouterLink],
  templateUrl: './profil-user.html',
  styleUrl: './profil-user.css'
})
export class ProfilUser {

}
