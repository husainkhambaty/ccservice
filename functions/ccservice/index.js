'use strict';

/**
 * Requires (Custom Modules)
 */
const rp = require('request-promise');
const helper = require('./helper');
const commands = require('./commands');
const telegramToken = require('./token');

/**
 * Send message to Telegram
 *
 * @param {int} chatId Chat ID
 * @param {string} message Message to send
 *
 * @return {object} Request Promise
 */
function sendMessageToTelegram(chatId, message) {
  console.log("DEBUG : Sending Message back to Telegram : " + message);
  return rp({
    method: 'POST',
    uri: `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    form: {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    },
  });
}

/**
 * Process Commands
 *
 * @param {object} message AWS Lambda Event
 *
 * @return {object} Request Promise
 */
function processCommands(message) {

  // Check if message isn't empty
  if (message) {
    const commandArguments = helper.parseTelegramCommand(message.trim());
    if (commandArguments === null) {
      return commands.error('Invalid Command');
    }

    const commandKeys = Object.keys(commandArguments);
    if (commandKeys.length === 0 && !commands[commandKeys[0]]) {
      return commands.error('Invalid Command');
    }

    const command = commandKeys[0];
    return commands[command](commandArguments[command]);
  }

  return commands.error('Event not specified');
}

/**
 * Main Lambda function
 *
 * @param {object} event AWS Lambda uses this parameter to pass in event data to the handler.
 * @param {object} context AWS Lambda uses this parameter to provide your handler the runtime information of the Lambda function that is executing.
 *
 * @return {object} Request Promise
 */

console.log('INFO : Calling the LAMBDA FUNCTION');

exports.handle = function(event, context, callback) {
  
  console.log('INFO : Processing event: %j', event);
  
  // Message
  let message;
  if (event.body.channel_post && event.body.channel_post.text) {
    message = event.body.channel_post.text;
  } else if (event.body.message && event.body.message.text) { // TODO: Handle edited message too
    message = event.body.message.text;
  }
  const processCommand = processCommands(message);

  // Chat ID
  let chatId;
  if (event.body.message && event.body.message.chat && event.body.message.chat.id) {
    chatId = event.body.message.chat.id;
  } else if (event.body.channel_post && event.body.channel_post.chat && event.body.channel_post.chat.id) {
    chatId = event.body.channel_post.chat.id;
  }

  if (chatId) {

    console.log("DEBUG : ChatID : " + chatId);

    processCommand.then((response) => {
      const processTelegram = sendMessageToTelegram(chatId, response);
      processTelegram.then(() => {
        context.succeed({"status" : "success"});
      }).catch(() => {
        context.fail();
      });

      context.succeed();

    }).catch((error) => {
      const processTelegram = sendMessageToTelegram(chatId, error.message);
      processTelegram.then(() => {
        context.succeed();
      }).catch(() => {
        context.fail();
      });
    });
  } else {
    processCommand.then(() => {
      context.succeed();
    }).catch(() => {
      context.fail();
    });
  }

  return processCommand;
}
