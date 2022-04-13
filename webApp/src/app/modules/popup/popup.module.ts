import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {PopupComponent} from './pages/popup/popup.component';
import {PopupRoutingModule} from './popup-routing.module';
import {UiSwitchModule} from "ngx-ui-switch";
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
     PopupRoutingModule,
     ToastModule,NgxPaginationModule,
     NgxSpinnerModule,
     ReactiveFormsModule,
     FormsModule,
     UiSwitchModule],

})
export class PopupModule {}
