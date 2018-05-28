import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadWindowComponent} from './upload-window.component';

describe('UploadWindowComponent', () => {
    let component: UploadWindowComponent;
    let fixture: ComponentFixture<UploadWindowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadWindowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
