import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationExtras } from '@angular/router';

import {
  BehaviorSubject,
  catchError,
  map,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  takeUntil,
  timer,
  combineLatest
} from 'rxjs';

// Services
import {
  AccountService,
  Account,
  ComponentConfig,
  LEVEL,
  CODE,
  ConfigService,
  EventService,
  ErrorService,
  AssetService,
  Asset,
  RoutingData,
  RoutingService
} from '@services';
import {
  AccountBankModel,
  AccountsService
} from '@cybrid/cybrid-api-bank-angular';

interface AccountData {
  balance: number;
  fiatAccount: AccountBankModel;
}

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  dataSource = new MatTableDataSource<Account>();
  displayedColumns: string[] = ['asset', 'balance'];
  getAccountsError = false;

  balance$ = new ReplaySubject<number>(1);
  fiatAccount$: ReplaySubject<AccountBankModel> =
    new ReplaySubject<AccountBankModel>(1);
  currentFiat!: Asset;

  accountData$ = combineLatest([this.balance$, this.fiatAccount$]).pipe(
    map(([balance, fiatAccount]) => {
      return <AccountData>{
        balance,
        fiatAccount
      };
    })
  );

  isLoading$ = new BehaviorSubject(true);
  isRecoverable$ = new BehaviorSubject(true);
  private unsubscribe$ = new Subject();

  routingData: RoutingData = {
    route: 'price-list',
    origin: 'account-list'
  };

  constructor(
    public configService: ConfigService,
    private assetService: AssetService,
    private eventService: EventService,
    private errorService: ErrorService,
    private accountService: AccountService,
    private accountsService: AccountsService,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.eventService.handleEvent(
      LEVEL.INFO,
      CODE.COMPONENT_INIT,
      'Initializing account-list component'
    );
    this.getAccounts();
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }

  getAccounts(): void {
    this.accountService
      .getPortfolio()
      .pipe(
        map((accountOverview) => {
          this.currentFiat = this.assetService.getAsset(
            accountOverview.fiatAccount.asset!
          );

          this.balance$.next(accountOverview.balance);
          this.fiatAccount$.next(accountOverview.fiatAccount);
          this.dataSource.data = accountOverview.accounts;
          this.getAccountsError = false;

          this.eventService.handleEvent(
            LEVEL.INFO,
            CODE.DATA_REFRESHED,
            'Accounts successfully updated'
          );

          this.isLoading$.next(false);
        }),
        takeUntil(this.unsubscribe$),
        catchError((err) => {
          this.eventService.handleEvent(
            LEVEL.ERROR,
            CODE.DATA_ERROR,
            'There was an error fetching accounts'
          );

          this.errorService.handleError(
            new Error('There was an error fetching accounts')
          );

          this.dataSource.data = [];
          this.getAccountsError = true;
          return of(err);
        })
      )
      .subscribe();
  }

  refreshData(): void {
    this.configService
      .getConfig$()
      .pipe(
        take(1),
        switchMap((cfg: ComponentConfig) => {
          return timer(cfg.refreshInterval, cfg.refreshInterval);
        }),
        map(() => {
          this.eventService.handleEvent(
            LEVEL.INFO,
            CODE.DATA_FETCHING,
            'Refreshing accounts...'
          );
          this.getAccounts();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  onRowClick(accountGuid: string): void {
    this.configService
      .getConfig$()
      .pipe(
        take(1),
        map((config: ComponentConfig) => {
          if (config.routing) {
            const extras: NavigationExtras = {
              queryParams: {
                accountGuid: accountGuid
              }
            };
            this.routingService.handleRoute({
              route: 'account-details',
              origin: 'account-list',
              extras
            });
          }
        })
      )
      .subscribe();
  }

  sortingDataAccessor(account: Account, columnDef: string) {
    switch (columnDef) {
      case 'asset':
        return account.account.asset!;
      case 'balance':
        return account.value!;
      default:
        return '';
    }
  }
}
