import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CountryService } from 'src/app/services/country.service';

@Injectable({
  providedIn: 'root',
})
export class EapActionsService {
  private triggeredAreaSubject = new BehaviorSubject<any[]>([]);
  private triggeredAreas: any[];
  private eventId: number;

  constructor(
    private countryService: CountryService,
    private apiService: ApiService,
  ) {}

  async loadAreasOfFocus() {
    return await this.apiService.getAreasOfFocus();
  }

  async loadDistrictsAndActions() {
    const event = await this.apiService.getEvent(
      this.countryService.activeCountry.countryCodeISO3,
    );
    if (event) {
      this.eventId = event?.id * 1;

      this.triggeredAreas = await this.apiService.getTriggeredAreas(
        this.eventId,
      );

      for (let area of this.triggeredAreas) {
        area.eapActions = await this.apiService.getEapActions(
          this.countryService.activeCountry.countryCodeISO3,
          area.pcode,
          this.eventId,
        );
      }
      this.triggeredAreaSubject.next(this.triggeredAreas);
    }
  }

  getTriggeredAreas(): Observable<any[]> {
    return this.triggeredAreaSubject.asObservable();
  }

  async checkEapAction(
    action: string,
    countryCodeISO3: string,
    status: boolean,
    pcode: string,
  ) {
    await this.apiService.checkEapAction(
      action,
      countryCodeISO3,
      status,
      pcode,
      this.eventId,
    );
  }
}
