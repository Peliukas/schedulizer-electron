import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageContentWrapperComponent} from './page-content-wrapper.component';

describe('PageContentWrapperComponent', () => {
    let component: PageContentWrapperComponent;
    let fixture: ComponentFixture<PageContentWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageContentWrapperComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageContentWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
