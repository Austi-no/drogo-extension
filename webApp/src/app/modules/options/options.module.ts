import { NgxSpinnerModule } from 'ngx-spinner';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {OptionsRoutingModule} from './options-routing.module';
import {OptionsComponent} from './pages/options/options.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [OptionsComponent],
  imports: [CommonModule,NgxPaginationModule, OptionsRoutingModule,NgxSpinnerModule, DropdownModule, FormsModule, ReactiveFormsModule]
})
export class OptionsModule {}
