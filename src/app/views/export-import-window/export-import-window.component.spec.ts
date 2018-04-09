import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportImportWindowComponent} from './export-import-window.component';

describe('ExportImportWindowComponent', () => {
    let component: ExportImportWindowComponent;
    let fixture: ComponentFixture<ExportImportWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExportImportWindowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportImportWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
