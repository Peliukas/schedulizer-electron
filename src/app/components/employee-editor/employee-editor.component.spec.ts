import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeEditorComponent} from './employee-editor.component';

describe('EmployeeEditorComponent', () => {
    let component: EmployeeEditorComponent;
    let fixture: ComponentFixture<EmployeeEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EmployeeEditorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
