import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ 
    CommonModule, 
    IonicModule,
    RouterModule.forChild([{ path: '', component: SearchComponent }]),
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent]
})
export class SearchComponentModule {}
