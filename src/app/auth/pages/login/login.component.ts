import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group( {
    email: ['', Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
    password: ['', Validators.required, Validators.minLength(6)]
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  save() {
    if(this.miFormulario.invalid){
      return
    }
    console.log(this.miFormulario.value);
    this.miFormulario.reset();
  }

}
