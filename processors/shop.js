const axios = require('axios');
const mongoose = require('mongoose');
const connectToMongo = require('../connectors/mongo')

connectToMongo()
const ticketSchema = new mongoose.Schema({
  matchNumber: Number,
  roundNumber: Number,
  dateUtc: Date,
  location: String,
  availability: {
    category1: {
      available: Number,
      pending: Number,
      price: Number
    },
    category2: {
      available: Number,
      pending: Number,
      price: Number
    },
    category3: {
      available: Number,
      pending: Number,
      price: Number
    }
  },
  homeTeam: String,
  awayTeam: String,
  group: String
});
const Ticket = new mongoose.model('Ticket', ticketSchema)
const processPendingTicket = async (message) => {
  console.log('[processPendingTicket]', message)
  if (meta.action === 'TICKET_PENDING') {
    update = {
      $inc: {
        [`availability.category${category}.pending`]: -quantity
      }
    };
  await Ticket.updateOne({ matchNumber: matchNumber }, update);
  };
  return Promise.resolve('[processPendingTicket]')
}

const processCancelledTicket = async (message) => {
  console.log('[processCancelledTicket]', message)
  const { meta, body } = message;
  const { matchNumber, tickets } = body;
  const { category, quantity } = tickets;
  let update;
  if (meta.action === 'TICKET_CANCELLED') {
    update = {
      $inc: {
        [`availability.category${category}.available`]: quantity,
        [`availability.category${category}.pending`]: -quantity
      }
    };
    await Ticket.updateOne({ matchNumber: matchNumber }, update);

  };
  return Promise.resolve('[processCancelledTicket]')
}

const processReservedTicket = async (message) => {
  console.log('[processReservedTicket]', message)
  const { meta, body } = message;
  if (meta.action === 'TICKET_RESERVED') {
    const { matchNumber, tickets } = body;
    const { category, quantity } = tickets;
    const update = {
      $inc: {
        [`availability.category${category}.available`]: -quantity,
      },
      $set: {
        [`availability.category${category}.pending`]:0
      }
    };
    await Ticket.updateOne({ matchNumber: matchNumber }, update);
  }
  return Promise.resolve('[processReservedTicket]')
};

const processMasterlist = async (message) => {
  console.log('[processMasterlist]', message)
  return Promise.resolve('[processMasterlist]')
};

module.exports = {
  processPendingTicket,
  processReservedTicket,
  processCancelledTicket,
};
