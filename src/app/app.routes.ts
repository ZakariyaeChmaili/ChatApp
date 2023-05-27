import { Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';



export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),

  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then( m => m.ChatPage),
    canActivate:[AuthenticationGuard]
  },
];
