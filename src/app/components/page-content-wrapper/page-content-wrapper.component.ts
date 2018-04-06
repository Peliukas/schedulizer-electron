import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-page-content-wrapper',
    templateUrl: './page-content-wrapper.component.html',
    styleUrls: ['./page-content-wrapper.component.css']
})
export class PageContentWrapperComponent implements OnInit {

    @Input() modelName: string;

    constructor() {
    }

    ngOnInit() {

    }

}
