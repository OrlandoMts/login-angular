import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // public user!: string;

  get user() {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.authService.infoUser().subscribe();
  }

  updateUser() {
    console.log('Información actualizada...')
  }




}
