import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [ 
    CommonModule, 
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ListComponent }])
  ],
  declarations: [
    ListComponent
  ],
})
export class ListComponentModule {}
