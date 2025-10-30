import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Filters } from './filters/filters';
import { Footer } from './footer/footer';
import { MaterialsModule } from '../../materials/materials-module';



@NgModule({
  declarations: [
    Filters,
    Footer
  ],
  imports: [
    CommonModule,
    MaterialsModule
  ],
  exports: [
    Filters,
    Footer,
    MaterialsModule
  ]
})
export class SharedModule { }
