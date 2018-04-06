import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class StorageAdapterService {

    public db: any;

    constructor() {
        this.db = new PouchDB('schedulizerDB');
    }

    public addObject() {
        var doc = {
            '_id': 'mittens',
            'name': 'Mittens',
            'occupation': 'kitten',
            'age': 3,
            'hobbies': [
                'playing with balls of yarn',
                'chasing laser pointers',
                'lookin\' hella cute'
            ]
        };
        this.db.put(doc);
        console.log('doc added!');
    }


    public getObject() {
        return this.db.get('mittens').then(data => {
            console.log(data);
        });
    }


}
