import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './components/app/app.component';
import { RootComponent } from './components/root/root.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from './components/shared/image-cropper/image-cropper.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    RootComponent,
    UserSettingsComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularCropperjsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
