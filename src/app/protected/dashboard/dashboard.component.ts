import { Component, OnInit, AfterViewInit } from '@angular/core';
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
    console.log('after', this.user);
  }

  ngOnInit(): void {
    console.log('init', this.user)
  }




}
