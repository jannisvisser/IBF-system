import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { LogosComponent } from './logos.component';

describe('LogosComponent', () => {
  let component: LogosComponent;
  let fixture: ComponentFixture<LogosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogosComponent],
      imports: [IonicModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
