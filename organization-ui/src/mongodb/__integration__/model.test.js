import mongoose from 'mongoose';
import { InitMongoDb, CreateCompany } from '../model';

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany()
    }
}

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop()
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found') return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message)
        }
    }
}

describe("Company operations", function() {

    beforeAll(async () => {
        await InitMongoDb();
    });

    afterEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    });

    it('Should save Company', async done => {
        const mockAck = jest.fn();
        CreateCompany({companyName: "Test Company", aggregateId: "12345"}, mockAck);
        console.log("[info] Mock called with argument: " + mockAck.mock.calls);
        expect(mockAck).toHaveBeenCalled();
        done();
    });
});