import { Component } from '@angular/core';
import { Home } from '../../../features/contributors/pages/home/home';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-404',
  imports: [Home,RouterLink],
  templateUrl: './error-404.html',
  styleUrl: './error-404.css'
})
export class Error404 {

}
