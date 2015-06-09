'use strict';

var HighScore = (function (w) {
  var localStorage = w.localStorage;
  var key = 'RocketPrincess.HighScore';

  var get = function () {
    var score = localStorage.getItem(key) || 0;
    return parseInt(score);
  }

  var set = function (score) {
    score = score || 0;
    localStorage.setItem(key, score);
  }

  var setIfHighScore = function (score) {
    score = parseInt(score || 0);
    var storeScore = this.get();
    if (score > storeScore) {
      this.set(score);
    }
  };

  return {
    get: get,
    set: set,
    setIfHighScore: setIfHighScore
  }
})(window);

module.exports = HighScore;