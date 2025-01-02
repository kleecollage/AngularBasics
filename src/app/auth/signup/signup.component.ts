import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from "rxjs";
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
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe( authStatus => {
        this.isLoading = false
      }
    );
  }

  onSignUp(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService
      .createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
