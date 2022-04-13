import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MessageService } from 'primeng/api';
import { ToastrModule } from 'ngx-toastr';
import {UiSwitchModule } from 'ngx-ui-switch'
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptor } from './providers/helpers/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UiSwitchModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    AppRoutingModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
