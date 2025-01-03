import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observer, Subject } from "rxjs";
import { environment } from '../environments/environment';
import { AuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: "root" })
export class AuthService{
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    const observer: Observer<any> = {
      next: () => {
        this.router.navigate([BACKEND_URL + '/login']);
      },
      error: (error) => {
        this.authStatusListener.next(false);
      },
      complete: () => {
        console.log('Request completed');
      },
    };
    this.http
      .post(BACKEND_URL + '/signup', authData)
      .subscribe(observer);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    const observer: Observer<{ token: string; expiresIn: number; userId: string }> = {
      next: (response) => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          const currentTime = new Date();
          const expirationDate = new Date(currentTime.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);

          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.authStatusListener.next(false);
      },
      complete: () => {
        console.log('Login request completed');
      },
    };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(observer);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) return

    const currentTime = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - currentTime.getTime();
    // console.log("AuthInformation: " + authInformation.token);
    // console.log("expires in: " + expiresIn);

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }


  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) return null;

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

}