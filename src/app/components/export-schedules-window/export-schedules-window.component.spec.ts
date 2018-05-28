import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportSchedulesWindowComponent} from './export-schedules-window.component';

describe('ExportSchedulesWindowComponent', () => {
    let component: ExportSchedulesWindowComponent;
    let fixture: ComponentFixture<ExportSchedulesWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportSchedulesWindowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportSchedulesWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
