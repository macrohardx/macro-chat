import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import { AppStates } from './infrastructure/app.states'

@NgModule({
  imports: [UIRouterModule.forRoot({
    states: AppStates,
    useHash: false,
    otherwise: { state: 'home'}
  })],
  exports: [UIRouterModule]
})
export class AppRoutingModule { }
