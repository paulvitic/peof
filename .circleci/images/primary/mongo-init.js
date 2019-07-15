db.auth('root', 'password');

org = db.getSiblingDB('organization');

org.createUser({
    user: 'organization',
    pwd: 'password',
    roles: [ "readWrite" ]
});

org.company.createIndex({ aggregateId: 1 });
org.company.createIndex({ timestamp: 1 });

orgView = db.getSiblingDB('orgView');

orgView.createUser({
    user: 'orgView',
    pwd: 'password',
    roles: [ "readWrite" ]
});

orgView.company.createIndex({ aggregateId: 1 },{ unique: true });

