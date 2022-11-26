import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import { Device } from '@capacitor/device';
import { Storage } from '@ionic/storage-angular';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  obj : any;
  _storage
  constructor(private http: HttpClient, private storage: Storage) { this.init(); }
 
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  signOut(): void {
    this._storage.clear()
  }

  public saveToken(token: string): void {
    this._storage.remove(TOKEN_KEY);
    this._storage.set(TOKEN_KEY, token);
  }

  async getToken() {
    return this._storage.get(TOKEN_KEY)
  }


  public saveAuthResponse(response): void {
    if(response.accessToken != null) {
      console.log(response)
      this._storage.remove(USER_KEY);
      this._storage.remove(TOKEN_KEY);
      this._storage.set(TOKEN_KEY, response.accessToken);
      this._storage.set(USER_KEY, JSON.stringify(response.user));
    } else {
      this._storage.set(USER_KEY, JSON.stringify(response.user));
    }
  }

  public saveUser(user): void {
    this._storage.remove(USER_KEY);
    this._storage.set(USER_KEY, JSON.stringify(user));
  }

  getUser() {
    return this._storage.get(USER_KEY)
  }

  getCurrentUser(userId): Observable<any> {
     return this.http.get(AppConstants.API_URL + 'user/me/' + userId, httpOptions);
  }

  getUserById(userId): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user/' + userId, httpOptions);
  }

  public removeUserFromStorage(){
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  
}
