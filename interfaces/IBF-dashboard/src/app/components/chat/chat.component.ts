import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/app/services/country.service';
import { EapActionsService } from 'src/app/services/eap-actions.service';
import { EventService } from 'src/app/services/event.service';
import { EapAction } from 'src/app/types/eap-action';
import { IndicatorName } from 'src/app/types/indicator-group';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy {
  public triggeredAreas: any[];

  private eapActionSubscription: Subscription;
  private countrySubscription: Subscription;

  public IndicatorName = IndicatorName;
  public eapActions: EapAction[];
  public changedActions: EapAction[] = [];
  public submitDisabled = true;

  public leadTime: string;

  constructor(
    private countryService: CountryService,
    private eapActionsService: EapActionsService,
    public eventService: EventService,
    private alertController: AlertController,
  ) {
    this.countrySubscription = this.countryService
      .getCountrySubscription()
      .subscribe((_) => {
        this.eapActionsService.loadDistrictsAndActions();
        this.eventService.getTrigger();
      });

    this.eapActionSubscription = this.eapActionsService
      .getTriggeredAreas()
      .subscribe((newAreas) => {
        this.triggeredAreas = newAreas;
        this.triggeredAreas.forEach((area) => (area.submitDisabled = true));
      });
  }

  ngOnDestroy() {
    this.eapActionSubscription.unsubscribe();
    this.countrySubscription.unsubscribe();
  }

  public changeAction(pcode: string, action: string, checkbox: boolean) {
    const area = this.triggeredAreas.find((i) => i.pcode === pcode);
    const changedAction = area.eapActions.find((i) => i.action === action);
    changedAction.checked = checkbox;
    if (!this.changedActions.includes(changedAction)) {
      this.changedActions.push(changedAction);
    }
    this.triggeredAreas.find((i) => i.pcode === pcode).submitDisabled = false;
  }

  public async submitEapAction(pcode: string) {
    this.triggeredAreas.find((i) => i.pcode === pcode).submitDisabled = true;

    try {
      const submitEAPActionResult = await Promise.all(
        this.changedActions.map(async (action) => {
          if (action.pcode === pcode) {
            return this.eapActionsService.checkEapAction(
              action.action,
              this.countryService.activeCountry.countryCode,
              action.checked,
              action.pcode,
            );
          } else {
            return Promise.resolve();
          }
        }),
      );

      this.changedActions = this.changedActions.filter(
        (i) => i.pcode !== pcode,
      );

      this.actionResult(
        'EAP action(s) updated in database.',
        window.location.reload,
      );
    } catch (e) {
      this.actionResult('Failed to update EAP action(s) updated in database.');
    }
  }

  private async actionResult(resultMessage: string, callback?: () => void) {
    const alert = await this.alertController.create({
      message: resultMessage,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss(true);
            if (callback) {
              callback();
            }
            return false;
          },
        },
      ],
    });

    await alert.present();
  }
}
