import { Component } from '@angular/core';
import { NavebarAdmin } from '../../navebar-admin/navebar-admin';
import { SidebarAdmin } from '../../sidebar-admin/sidebar-admin';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-admin-layout',
  imports: [NavebarAdmin, SidebarAdmin, RouterOutlet],
  templateUrl: './main-admin-layout.html',
  styleUrl: './main-admin-layout.css'
})
export class MainAdminLayout {

}
