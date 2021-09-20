import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { TabsComponent } from './tabs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ 
    CommonModule, 
    IonicModule,
    RouterModule.forChild([{ 
      path: '', 
      component: TabsComponent ,
      children: [
        {
          path: 'search', 
          loadChildren: () => import('../search/search.module').then(m => m.SearchComponentModule)
        },
        {
          path: 'list',
          children: [
            {
              path: ':id', 
              loadChildren: () => import('../detail/detail.module').then(m => m.DetailComponentModule)
            },
            {
              path: '',
              loadChildren: () => import('../list/list.module').then(m => m.ListComponentModule),
            },
          ]
        },
        {
          path: '', redirectTo: 'search', pathMatch: 'full'
        }
      ]
    }])
  ],
  declarations: [TabsComponent],
  exports: [TabsComponent]
})
export class TabsComponentModule {}
