'use strict';

/**
 * Helper
 */
module.exports = {

  /**
   *
   */
  ucWords(string) {
    return string.replace('/\w\S*/g', (str) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()); // eslint-disable-line no-useless-escape
  },

  /**
    * Formats the number to local-en
    */
  formatNumber(x) {
    return x.toLocaleString('en');
  },
  /**
    * Formats the byte size to human-readable format
    */
  formatBytes(bytes, decimals) {
    const b = parseInt(bytes, 10);
    if (b === 0) {
      return '0 Byte';
    }
    const k = 1024;
    const dm = decimals + 1 || 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return `${(b / Math.pow(k, i)).toPrecision(dm)} ${sizes[i]}`; // eslint-disable-line no-restricted-properties
  },
  /**
    * Formats the number to local-en
    */
  parseTelegramCommand(message) {

    // eg command : /coinprice BTC:AUD
    const tokens = message.split(' ');
    if (!tokens[0].match(/^\//)) {

      // Failure condition if the first token is not a Telegram command
      return null;
    }
    
    const command = [];
    const cmd = tokens.shift();
    const match = cmd.match(/\/(\w*)/);
    
    if (match.length > 0) {
       command[match[1]] = tokens;
     }
    return command;
  },
  parseCommand(message) {

    // eg command : /coinprice BTC:AUD
    const tokens = message.split(' ');
    if (!tokens[0].match(/^\//)) {

      // Failure condition if the first token is not a Telegram command
      return null;
    }
    
    const command = [];
    const cmd = tokens.shift();
    const match = cmd.match(/\/(\w*)/);
    
    if (match.length > 0) {
       command[match[1]] = tokens;
     }
    return command;
  },
  getMessage(message) {
    let m = '';
    if (message) {
      m = message.toString().trim();
    } else {
      m = '';
    }
    return (m.length > 0 ? m : 'N/A');
  },
  formatMessage(title, description, fields) {
    let message = '';

    if (title !="" && title.length > 0) {
      message = `<strong>${title}</strong>\n`;
    }
    if (description != "" && description.length > 0) {
      message += `<em>${description}</em>\n`;
    }
    if (fields != "" && fields.length > 0) {
      message += `<pre>${this.parseFields(fields)}</pre>`;
    }

    return message;
  },
  parseFields(fields) {
    const data = [];
    fields.forEach((entry) => {
      if (entry.title && entry.title.length > 0) {
        data.push(`${entry.title}: ${entry.value}`);
      }
    });

    return data.join("\n"); // eslint-disable-line quotes
  },
  validateIp(ip) {
    const matcher = /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/;
    return matcher.test(ip);
  },
};
