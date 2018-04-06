import {TestBed, inject} from '@angular/core/testing';

import {StorageAdapterService} from './storage-adapter.service';

describe('StorageAdapterService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StorageAdapterService]
        });
    });

    it('should be created', inject([StorageAdapterService], (service: StorageAdapterService) => {
        expect(service).toBeTruthy();
    }));
});
