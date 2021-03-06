import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CountryService } from 'src/app/services/country.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { LeadTime, LeadTimeTriggerKey } from 'src/app/types/lead-time';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public leadTime: string;
  public event: any;
  public activeEvent: boolean;
  public activeTrigger: boolean;
  public newEvent: boolean;

  public state = {
    event: null,
    activeEvent: null,
    activeTrigger: null,
    newEvent: null,
    newEventEarlyTrigger: null,
    triggerLeadTime: null,
    firstLeadTime: null,
  };

  constructor(
    private timelineService: TimelineService,
    private apiService: ApiService,
    private countryService: CountryService,
  ) {}

  public async getTrigger() {
    this.state.event = await this.timelineService.getEvent();
    this.state.activeEvent = !!this.state.event;
    this.state.activeTrigger = this.state.event && !this.state.event?.end_date;
    this.state.newEvent =
      this.state.event?.start_date ===
      this.timelineService.state.today.format('YYYY-MM-DD');

    this.setAlertState();

    if (this.state.activeTrigger) {
      this.getFirstTriggerDate();
      this.getTriggerLeadTime();
    }
  }

  private setAlertState = () => {
    const dashboardElement = document.getElementById('ibf-dashboard-interface');
    if (this.state.activeTrigger) {
      dashboardElement.classList.add('trigger-alert');
    } else {
      dashboardElement.classList.remove('trigger-alert');
    }
  };

  private async getFirstTriggerDate() {
    const timesteps = await this.apiService.getTriggerPerLeadTime(
      this.countryService.activeCountry.countryCodeISO3,
    );
    let firstKey = null;
    Object.keys(timesteps).forEach((key) => {
      if (timesteps[key] == 1) {
        firstKey = !firstKey ? key : firstKey;
      }
    });
    this.state.firstLeadTime = firstKey;
    this.state.newEventEarlyTrigger =
      firstKey < LeadTimeTriggerKey[this.timelineService.activeLeadTime];
  }

  private async getTriggerLeadTime() {
    let triggerLeadTime = null;
    this.countryService.activeCountry.countryLeadTimes.forEach(
      (leadTime: LeadTime) => {
        if (
          !triggerLeadTime &&
          LeadTimeTriggerKey[leadTime] >= this.state.firstLeadTime
        ) {
          triggerLeadTime = LeadTimeTriggerKey[leadTime];
        }
      },
    );
    this.state.triggerLeadTime = triggerLeadTime;
  }
}
