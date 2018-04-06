import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModelListViewComponent} from './model-list-view.component';

describe('ModelListViewComponent', () => {
    let component: ModelListViewComponent;
    let fixture: ComponentFixture<ModelListViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModelListViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModelListViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
