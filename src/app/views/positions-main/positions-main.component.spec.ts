import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PositionsMainComponent} from './positions-main.component';

describe('PositionsMainComponent', () => {
    let component: PositionsMainComponent;
    let fixture: ComponentFixture<PositionsMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PositionsMainComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PositionsMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
