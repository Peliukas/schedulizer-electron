import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarFreeDaySettingsComponent} from './calendar-free-day-settings.component';

describe('CalendarFreeDaySettingsComponent', () => {
    let component: CalendarFreeDaySettingsComponent;
    let fixture: ComponentFixture<CalendarFreeDaySettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CalendarFreeDaySettingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarFreeDaySettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
