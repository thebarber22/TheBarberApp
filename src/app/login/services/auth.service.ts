import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../constants/app.constants';
import { Device } from '@capacitor/device';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const COMPANY_KEY = 'auth-company';
const USER_FIREBASE_TOKEN = 'firebase-token';
const LANGUAGE = 'language';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  obj : any;
  _storage;
  url  = environment.url;
  constructor(private http: HttpClient, private storage: Storage) { this.init(); }
 
  async init() {
		await this.storage.create().then()
    this._storage = this.storage;
  }

  signOut(): void {
    this._storage.clear()
  }

  public saveToken(token: string): void {
    this._storage.remove(TOKEN_KEY);
    this._storage.set(TOKEN_KEY, token);
  }

  getToken() {
    return this._storage.get(TOKEN_KEY)
  }


  public saveAuthResponse(response): void {
    if(response.accessToken != null) {
      this._storage.remove(USER_KEY);
      this._storage.remove(TOKEN_KEY);
      this._storage.set(TOKEN_KEY, response.accessToken);
      this._storage.set(USER_KEY, JSON.stringify(response.user));
    } else {
      this._storage.set(USER_KEY, JSON.stringify(response.user));
    }
  }

  public saveFirebaseToken(token : any) {
    if(token != null){
      this._storage.set(USER_FIREBASE_TOKEN, token);
    }
  } 

  public getFirebaseToken() {
     return this._storage.get(USER_FIREBASE_TOKEN)
  } 

  public saveUser(user): void {
    this._storage.remove(USER_KEY);
    this._storage.set(USER_KEY, JSON.stringify(user));
  }

  public saveLanguage(userId: any, lang: any): void {
    this._storage.remove(lang);
    this._storage.set(LANGUAGE, lang);

    this.changeUserLanguage(userId, lang).subscribe(data => {})
  }

  getLanguage() {
    return this._storage.get(LANGUAGE);
  }

  getUser() {
    return this._storage.get(USER_KEY)
  }

  getCurrentUser(userId): Observable<any> {
     return this.http.get(this.url + 'user/me/' + userId, httpOptions);
  }

  getUserById(userId): Observable<any> {
    if(userId != null && userId != ""){
      return this.http.get(this.url + 'user/' + userId, httpOptions);
    }
  }

  changeUserLanguage(userId, language): Observable<any> {
    if(userId != null && userId != ""){
      let queryParams = {"language":language};
      return this.http.get(this.url + 'user/change-user-language/' + userId, {params:queryParams});
    }
  }

  public removeUserFromStorage(){
    this._storage.remove(USER_KEY)
    this._storage.remove(TOKEN_KEY)
    return {};
  }


  public saveCompany(company): void {
    this._storage.remove(COMPANY_KEY);
    this._storage.set(COMPANY_KEY, JSON.stringify(company));
  }

  public getCompany(): any {
    return this._storage.get(COMPANY_KEY);
  }
  
}
