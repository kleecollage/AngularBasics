import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading = false;
  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.createUser(form.value.email, form.value.password)
  }
}
