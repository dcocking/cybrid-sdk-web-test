import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import {
  BehaviorSubject,
  catchError,
  map,
  of,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  timer
} from 'rxjs';

// Client
import {
  AssetBankModel,
  PricesService,
  SymbolPriceBankModel
} from '@cybrid/cybrid-api-bank-angular';

// Services
import {
  AssetService,
  EventService,
  CODE,
  LEVEL,
  ErrorService,
  ConfigService,
  ComponentConfig,
  RoutingService
} from '@services';

// Utility
import { symbolSplit } from '@utility';

export interface SymbolPrice extends SymbolPriceBankModel {
  asset: AssetBankModel;
  counter_asset: AssetBankModel;
}

@Component({
  selector: 'app-price-list',
  templateUrl: 'price-list.component.html',
  styleUrls: ['price-list.component.scss']
})
export class PriceListComponent implements OnInit, AfterViewChecked, OnDestroy {
  config$ = this.configService.getConfig$();
  isLoading$ = new BehaviorSubject(true);
  isRecoverable$ = new BehaviorSubject(true);
  refreshSub: Subscription = new Subscription();
  private unsubscribe$ = new Subject();

  dataSource: MatTableDataSource<SymbolPrice> = new MatTableDataSource();
  displayedColumns: string[] = ['symbol', 'price'];
  filterControl: UntypedFormControl = new UntypedFormControl();
  getPricesError = false;

  constructor(
    private errorService: ErrorService,
    private eventService: EventService,
    public configService: ConfigService,
    private routingService: RoutingService,
    private assetService: AssetService,
    private pricesService: PricesService
  ) {}

  ngOnInit() {
    this.eventService.handleEvent(
      LEVEL.INFO,
      CODE.COMPONENT_INIT,
      'Initializing price list component'
    );
    this.initFilterForm();
    this.getPrices();
    this.refreshData();
  }

  ngAfterViewChecked(): void {
    this.dataSource.filterPredicate = this.filterPredicate;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }

  initFilterForm(): void {
    this.filterControl = new UntypedFormControl();
    this.filterControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: string) => {
          this.dataSource.filter = value.toLowerCase();
        }
      });
  }

  filterPredicate(data: SymbolPrice, filter: string): boolean {
    return (
      data.asset.name.toLowerCase().indexOf(filter) != -1 ||
      data.asset.code.toLowerCase().indexOf(filter) != -1
    );
  }

  getPrices(): void {
    this.pricesService
      .listPrices()
      .pipe(
        takeUntil(this.unsubscribe$),
        map((list) => {
          if (this.refreshSub.closed) {
            this.refreshData();
          }
          this.isLoading$.next(false);
          const data: Array<SymbolPrice> = [];
          list.forEach((model) => {
            if (model.symbol) {
              const [asset, counter_asset] = symbolSplit(model.symbol);
              const symbol: SymbolPrice = {
                asset: this.assetService.getAsset(asset),
                counter_asset: this.assetService.getAsset(counter_asset),
                symbol: model.symbol,
                buy_price: model.buy_price,
                sell_price: model.sell_price,
                buy_price_last_updated_at: model.buy_price_last_updated_at,
                sell_price_last_updated_at: model.sell_price_last_updated_at
              };
              data.push(symbol);
            }
          });
          this.eventService.handleEvent(
            LEVEL.INFO,
            CODE.DATA_REFRESHED,
            'Price list successfully updated'
          );
          this.dataSource.data = data;
          this.getPricesError = false;
        }),
        catchError((err) => {
          this.eventService.handleEvent(
            LEVEL.ERROR,
            CODE.DATA_ERROR,
            'There was an error fetching price list'
          );
          this.errorService.handleError(
            new Error('There was an error fetching price list')
          );
          this.refreshSub.unsubscribe();
          this.dataSource.data = [];
          this.getPricesError = true;
          return of(err);
        })
      )
      .subscribe();
  }

  refreshData(): void {
    this.refreshSub = this.configService
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
            'Refreshing price list...'
          );
          this.getPrices();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  onRowClick(code: string): void {
    this.config$
      .pipe(
        take(1),
        map((config: ComponentConfig) => {
          if (config.routing) {
            const extras: NavigationExtras = {
              queryParams: {
                code: code
              }
            };
            this.routingService.handleRoute({
              route: 'trade',
              origin: 'price-list',
              extras
            });
          }
        })
      )
      .subscribe();
  }
}
