import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CrudWindowComponent} from './crud-window.component';

describe('CrudWindowComponent', () => {
    let component: CrudWindowComponent;
    let fixture: ComponentFixture<CrudWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrudWindowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrudWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
