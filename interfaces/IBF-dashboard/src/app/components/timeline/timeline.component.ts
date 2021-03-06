import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Country } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  private countrySubscription: Subscription;

  constructor(
    private countryService: CountryService,
    public timelineService: TimelineService,
  ) {}

  ngOnInit() {
    this.countrySubscription = this.countryService
      .getCountrySubscription()
      .subscribe(async (country: Country) => {
        await this.timelineService.loadTimeStepButtons();
      });
  }

  ngOnDestroy() {
    this.countrySubscription.unsubscribe();
  }
}
