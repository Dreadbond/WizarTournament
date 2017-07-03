import { Mongo } from 'meteor/mongo';

export const playersDb = new Mongo.Collection('players');
export const Actions   = new Mongo.Collection('actions');

