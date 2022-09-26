import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public miFormulario: FormGroup = this.fb.group({
    email: [{value: '', disabled: true}],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    address: [''],
    city: [''],
    country: [''],
    postalCode: [''],
    about: ['']
  });


  get user() {
    return this.authService.user;
  }

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.authService.infoUser().subscribe();
  }

  updateUser() {
    console.log('Información actualizada...');
    if (this.miFormulario.invalid){
      return
    }
    const {name, lastName, address, city, country, postalCode, about} = this.miFormulario.value;
    this.authService.updateUser(name, lastName, address, city, country, postalCode, about).subscribe();
  }

}
