import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CODE, EventService, LEVEL } from '../event/event.service';
import { ComponentConfig, ConfigService } from '../config/config.service';
import { map, take } from 'rxjs';

export interface RoutingData {
  route: string;
  origin: string;
  extras?: NavigationExtras;
}

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  constructor(
    private router: Router,
    private eventService: EventService,
    private configService: ConfigService,
    private window: Window
  ) {}

  handleRoute(routingData: RoutingData): void {
    this.configService
      .getConfig$()
      .pipe(
        take(1),
        map((config: ComponentConfig) => {
          const path = 'app/' + routingData.route + this.window.location.search;

          if (config.routing || routingData.origin == 'cybrid-app') {
            this.eventService.handleEvent(
              LEVEL.INFO,
              CODE.ROUTING_START,
              'Routing to: ' + routingData.route,
              {
                origin: routingData.origin,
                default: routingData.route
              }
            );

            this.router.navigate([path], routingData.extras).then((res) => {
              if (res) {
                this.configService.setComponent(routingData.route);

                this.eventService.handleEvent(
                  LEVEL.INFO,
                  CODE.ROUTING_END,
                  'Successfully routed to: ' + routingData.route,
                  {
                    origin: routingData.origin,
                    default: routingData.route
                  }
                );
              }
            });
          } else {
            this.eventService.handleEvent(
              LEVEL.INFO,
              CODE.ROUTING_REQUEST,
              'Routing has been requested',
              {
                origin: routingData.origin,
                default: routingData.route
              }
            );
          }
        })
      )
      .subscribe();
  }
}
