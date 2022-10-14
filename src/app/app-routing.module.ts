import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
    path: 'succ-appointment',
    loadChildren: () => import('./successful-appointment/succ-appointment.module').then( m => m.SuccAppointmentPageModule)
  },
  {
    path: 'employee/:userId',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
