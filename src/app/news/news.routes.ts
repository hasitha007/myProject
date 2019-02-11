import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewsComponent } from './news.component';
import { NewsFormComponent } from './form/form.component';

const routes: Routes = [{
  path: 'news',
  children: [{
    path: '',
    component: NewsComponent,
  }, {
    path: 'add',
    component: NewsFormComponent,
  }, {
    path: ':id/edit',
    component: NewsFormComponent,
  }],
}];

export const newsRoutes: ModuleWithProviders = RouterModule.forChild(routes);
