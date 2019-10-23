import mongoose from 'mongoose';
import config from '../config';

export function InitMongoDb() {
  const { db: { host, port, name, user, password } } = config;
  const DB_URL = process.env.MONGODB_URI || `mongodb://${user}:${password}@${host}:${port}/${name}`;

  mongoose.connect(DB_URL, {useNewUrlParser: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('[info] connected to db.');
  });
}

const Company = mongoose.model('Company', {
  id:String,
  name:String
});

export const CreateCompany = (event, ack) => {
  Company.findOne({ 'name': event.companyName }, 'id name', function (err, company) {
    if (company) {
      console.log('[warn] company with name %s already exists with id %s', company.name, company.id);
    } else {
      new Company({ id:event.aggregateId, name:event.companyName })
        .save()
        .then(console.log('[info] company with name %s saved with id %s', event.companyName, event.aggregateId));
    }
  });
  ack(true);
};
