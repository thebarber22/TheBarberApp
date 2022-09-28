import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppConstants } from './constants/app.constants';
import { AuthService } from './services/auth.service';
import { Device } from '@capacitor/device';
import { HomeService } from '../home/services/home.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  isLoggedIn = false;
  isLoginFailed = false;
  currentUser: any;
  errorMessage: any;
  selectedSection : any;

  constructor(private homeService: HomeService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) { }

   ngOnInit() { 
    const token: string = this.route.snapshot.queryParamMap.get('token');  
  	if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.currentUser = this.authService.getUser();
    }
  	else if(token){
  		this.authService.saveToken(token);
  		this.authService.getCurrentUser().subscribe(data => { 
  		        this.login(data);
  		      },
  		      err => {
  		        this.errorMessage = err.error.message;
  		        this.isLoginFailed = true;
  		      }
  		  );
  	  }
   }

  removeAuthFromSession(){
    this.authService.signOut();
  }

  login(user): void {
      this.authService.saveUser(user);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.currentUser = this.authService.getUser();
      this.router.navigate(['/signup']);
  }

  goToSingIn(){
    this.router.navigate(['/signup']);
  }
}
