import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path: 'sample-page',
    loadChildren: () => import('../../components/sample/sample.module').then(m => m.SampleModule)
  }
];
