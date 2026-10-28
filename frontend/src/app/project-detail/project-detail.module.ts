import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ProjectDetailPageRoutingModule } from './project-detail-routing.module';

import { ProjectDetailPage } from './project-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailPageRoutingModule
  ],
  declarations: [ProjectDetailPage]
})
export class ProjectDetailPageModule {}
