function countEmojis(message) {
    const emojiPattern = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  
    const emojiMatches = message.match(emojiPattern);
    return emojiMatches ? emojiMatches.length : 0;
  }

export default countEmojis;