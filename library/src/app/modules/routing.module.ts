import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  PriceListComponent,
  TradeComponent,
  AccountListComponent,
  AccountDetailsComponent,
  IdentityVerificationComponent,
  BankAccountConnectComponent,
  TransferComponent,
  BankAccountListComponent
} from '@components';

import { ComponentGuard } from '@guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  {
    path: 'app',
    children: [
      {
        path: 'price-list',
        component: PriceListComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'trade',
        component: TradeComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'account-list',
        component: AccountListComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'account-details',
        component: AccountDetailsComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'identity-verification',
        component: IdentityVerificationComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'bank-account-connect',
        component: BankAccountConnectComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'bank-account-list',
        component: BankAccountListComponent,
        canActivate: [ComponentGuard]
      },
      {
        path: 'transfer',
        component: TransferComponent,
        canActivate: [ComponentGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'app'
  }
];

@NgModule({
  imports: [RouterTestingModule.withRoutes(routes)],
  exports: [RouterTestingModule],
  providers: [ComponentGuard]
})
export class RoutingModule {}
