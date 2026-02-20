import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './app.tokens';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private readonly API = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,
  ) {}

  login(data: any) {
    return this.http.post<any>(`${this.API}/login`, data);
  }
}
