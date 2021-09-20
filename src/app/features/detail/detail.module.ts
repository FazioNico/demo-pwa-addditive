import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DetailComponent } from './detail.component';
import { RouterModule } from '@angular/router';
import { StatusPipe } from './pipes/status.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { WikiService } from './wiki.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [ 
    CommonModule, 
    IonicModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([{path: '', component: DetailComponent}]),
  ],
  declarations: [DetailComponent, StatusPipe],
  exports: [DetailComponent],
  providers: [WikiService]
})
export class DetailComponentModule {}
