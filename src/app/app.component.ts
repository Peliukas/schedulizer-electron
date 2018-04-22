import {Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    selectedModelName: any;
    sidebarOpen: boolean;

    constructor(private _electronService: ElectronService) {

    }

    ngOnInit(): void {

        this.sidebarOpen = true;
        this.selectedModelName = 'employee';
        // let updateStatus = this._electronService.ipcRenderer.sendSync('check-for-updates');
        // console.log(updateStatus);
    }


}
