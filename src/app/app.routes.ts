import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Api } from './api/api';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'crud',
    pathMatch: 'full',
  },
  {
    path: 'crud',
    component: Users,
  },
  {
    path: 'api',
    component: Api,
  },
];
