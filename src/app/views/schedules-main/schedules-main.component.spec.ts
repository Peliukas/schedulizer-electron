import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SchedulesMainComponent} from './schedules-main.component';

describe('SchedulesMainComponent', () => {
    let component: SchedulesMainComponent;
    let fixture: ComponentFixture<SchedulesMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SchedulesMainComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SchedulesMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
