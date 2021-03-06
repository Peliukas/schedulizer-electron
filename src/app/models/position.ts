import PouchDB from 'pouchdb';


export class Position {
    data: any;
    db: any;

    constructor() {
        this.data = {
            _id: '',
            job_title: '',
            pay: ''
        };
        this.db = new PouchDB('Positions');
    }

    public setValues(data: any) {
        this.data._id = data._id;
        this.data.job_title = data.job_title;
        this.data.pay = data.pay;
        return true;
    }


    public save() {
        try {
            this.db.put(this.data);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    public delete() {
        this.db.get(this.data._id).then(doc => {
            doc._deleted = true;
            return this.db.put(doc);
        }, reason => {
            return reason;
        });
    }

    public async find(id: any) {
        this.db.get(id)
            .then(job => {
                this.data = job;
            });
        return this.db.get(id);
    }

    public findAll() {
        return this.db.allDocs(({include_docs: true}));
    }


}
