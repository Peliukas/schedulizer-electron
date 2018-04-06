import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeesMainComponent} from './employees-main.component';

describe('EmployeesMainComponent', () => {
    let component: EmployeesMainComponent;
    let fixture: ComponentFixture<EmployeesMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EmployeesMainComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeesMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
