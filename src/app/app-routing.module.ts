import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SuccessScreenComponent } from './shared/success-screen/success-screen.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'timeline',
    loadChildren: () => import('./timeline/timeline.module').then( m => m.TimelinePageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationModule)
  },
  {
    path: 'employee/:userId',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeePageModule)
  },
  {
    path: 'scheduler',
    loadChildren: () => import('./scheduler/scheduler.module').then( m => m.SchedulerPageModule)
  },
  {
    path: 'hidden-login',
    loadChildren: () => import('./hidden-login/hidden-login.module').then( m => m.HiddenLoginPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  }, 
  {
    path: 'expired-subscription',
    loadChildren: () => import('./expired-subscription/expired-subscription.module').then( m => m.ExpiredSubscriptionPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
