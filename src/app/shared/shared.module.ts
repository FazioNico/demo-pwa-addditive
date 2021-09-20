import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelPipe } from './pipes/level.pipe';



@NgModule({
  declarations: [
    LevelPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LevelPipe
  ]
})
export class SharedModule { }
