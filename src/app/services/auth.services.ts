import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Login, Token } from '../auth/login/login';

const AUTH_TOKEN = 'AUTH_TOKEN';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) {}
    
    getAuthToken(): string {
        return sessionStorage.getItem(AUTH_TOKEN);
    }

    setAuthToken(token: string) {
        sessionStorage.setItem(AUTH_TOKEN, token);
    }
    signOut() {
        window.sessionStorage.clear();
    }
    authenticate(login: Login): Observable<Token> {
        const formData: FormData = new FormData();
        formData.append(`grant_type`, `${login.grant_type}`);
        formData.append('username', `${login.username}:${login.username}`);
        formData.append('password', login.password);
        const headers = new HttpHeaders()
        headers.append(
            'Authorization',
            btoa("portal-api-services:12345678")
        );
        headers.append(
            'content-type', 'application/json;charset=UTF-8'
        )
        return this.http.post<Token>('/aig-uaa/oauth/token', formData, { headers: headers })
    } 
}