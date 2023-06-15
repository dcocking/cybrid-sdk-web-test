import { Injectable, OnDestroy } from '@angular/core';

import {
  Observable,
  Subject,
  map,
  catchError,
  of,
  switchMap,
  combineLatest,
  take
} from 'rxjs';

// Client
import {
  AccountBankModel,
  AccountsService,
  AssetBankModel,
  PricesService,
  SymbolPriceBankModel
} from '@cybrid/cybrid-api-bank-angular';

// Services
import {
  AssetService,
  Asset,
  ConfigService,
  LEVEL,
  CODE,
  EventService,
  ErrorService
} from '@services';

// Utility
import { filterPrices, symbolBuild, symbolSplit } from '@utility';
import { AssetPipe } from '@pipes';

export interface Account {
  asset: Asset;
  counter_asset: Asset;
  price: SymbolPriceBankModel;
  value: number;
  account: AccountBankModel;
}

export interface AccountOverview {
  accounts: Account[];
  fiatAccount: AccountBankModel;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnDestroy {
  symbolSplit = symbolSplit;
  filterPrices = filterPrices;

  private unsubscribe$ = new Subject();

  constructor(
    private eventService: EventService,
    private errorService: ErrorService,
    private accountsService: AccountsService,
    private pricesService: PricesService,
    private assetService: AssetService,
    private assetPipe: AssetPipe,
    private configService: ConfigService
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }

  getAccounts(): Observable<AccountBankModel[]> {
    return this.configService.getConfig$().pipe(
      take(1),
      switchMap((config) => {
        return this.accountsService.listAccounts(
          '',
          '',
          '',
          '',
          config.customer
        );
      }),
      map((accounts) => accounts.objects),
      catchError((err) => {
        this.eventService.handleEvent(
          LEVEL.ERROR,
          CODE.DATA_ERROR,
          'There was an error fetching accounts'
        );

        this.errorService.handleError(
          new Error('There was an error fetching accounts')
        );
        return of(err);
      })
    );
  }

  // Returns asset and counter asset models
  getAccountAssets(assetCodes: string[]): Asset[] {
    const assets: Asset[] = [];
    assetCodes.forEach((code) => {
      assets.push(this.assetService.getAsset(code));
    });
    return assets;
  }

  // Returns approximate current market value of account in fiat
  getAccountValue(
    price: { amount: string; asset: AssetBankModel },
    balance: { amount: string; asset: AssetBankModel }
  ): number {
    const sellPrice = Number(
      this.assetPipe.transform(price.amount, price.asset, 'trade')
    );
    const platformBalance = Number(
      this.assetPipe.transform(balance.amount, balance.asset, 'trade')
    );
    return sellPrice * platformBalance;
  }

  getAccountDetails(
    accountGuid: string,
    counterAsset: string
  ): Observable<Account> {
    return combineLatest([
      this.getAccounts().pipe(
        map((accounts) => {
          return accounts.find((account) => {
            return accountGuid == account.guid;
          });
        }),
        catchError((err) => {
          return of(err);
        })
      ),
      this.pricesService.listPrices().pipe(
        catchError((err) => {
          return of(err);
        })
      )
    ]).pipe(
      map((combined) => {
        const [accountModel, pricesModel]: [
          accountModel: AccountBankModel,
          pricesModel: SymbolPriceBankModel[]
        ] = combined;

        const assetModel = this.assetService.getAsset(accountModel.asset!);
        const counterAssetModel = this.assetService.getAsset(counterAsset);
        const symbol = symbolBuild(
          accountModel.asset!,
          counterAssetModel.code!
        );

        const priceModel = pricesModel.find((price) => {
          return price.symbol == symbol;
        });

        const accountValue = this.getAccountValue(
          {
            amount: priceModel!.sell_price!,
            asset: counterAssetModel
          },
          {
            amount: accountModel.platform_balance!,
            asset: assetModel
          }
        );

        // Build extended account model
        return {
          asset: assetModel,
          counter_asset: counterAssetModel,
          price: priceModel!,
          value: accountValue,
          account: accountModel
        };
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }

  getPortfolio(): Observable<AccountOverview> {
    return combineLatest([
      this.getAccounts().pipe(
        catchError((err) => {
          return of(err);
        })
      ),
      this.pricesService.listPrices().pipe(
        catchError((err) => {
          return of(err);
        })
      )
    ]).pipe(
      map((combined) => {
        const [accounts, prices] = combined;
        const cryptoAccounts = accounts.filter(
          (account: AccountBankModel) =>
            account.type == AccountBankModel.TypeEnum.Trading
        );
        const fiatAccount: AccountBankModel = accounts.find(
          (account: AccountBankModel) =>
            account.type == AccountBankModel.TypeEnum.Fiat
        );

        let portfolioBalance = 0;
        let tradingAccounts: Account[] = [];

        cryptoAccounts.forEach((accountModel: AccountBankModel) => {
          const priceModel = this.filterPrices(prices, accountModel.asset!);
          const [assetModel, counterAssetModel] = this.getAccountAssets([
            accountModel.asset!,
            fiatAccount.asset!
          ]);

          const accountValue = this.getAccountValue(
            {
              amount: priceModel!.sell_price!,
              asset: counterAssetModel
            },
            {
              amount: accountModel.platform_balance!,
              asset: assetModel
            }
          );

          // Build extended account model
          const account: Account = {
            asset: assetModel,
            counter_asset: counterAssetModel,
            price: priceModel!,
            value: accountValue,
            account: accountModel
          };

          // Push extended account model to trading account array
          tradingAccounts.push(account);
        });

        // Sum of all trading account market values
        tradingAccounts.forEach((account) => {
          portfolioBalance = portfolioBalance + account.value!;
        });

        return {
          accounts: tradingAccounts,
          fiatAccount: fiatAccount,
          balance: portfolioBalance
        };
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }
}
