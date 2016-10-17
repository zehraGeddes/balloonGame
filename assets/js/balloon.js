// $(document).ready(function(){
//   $(function() {
//     for (var i=0; i < 100; i++) {
//       $('#balloons').append("<div class='balloon balloon" + i + "'><div class='balloon-inner balloon'></div></div>");
//     }
//   });
// });

var Game;

Game = {
  level: 0,
  counter: 3,
  points: 0,
  balloons: function(){ return Math.floor((Math.random() * 51) + 50); },
  velocity: function(){ return Math.max(500, Math.round(2000 - Math.pow(this.level*100, 1.2))); },
  alter: false,
  single: '.balloon',
  balloonsWrapper: '#balloons',
  counterWrapper: '#counter',
  msgWrapper: '#msg',
  levelWrapper: '#level',
  gameWrapper: '#game',
  Utils: {
    animationEndEvent: "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },

  Assets: {
    balloons: [
      {message: "Sorry Babe"},
      {message: "Oh no!"},
      {message: "Better next time"},
      {message: "Don't worry it will be ok"},
      {message: "Ok I am getting emotional"},
      {message: "Please don't cry"}
    ],
    rareBalloons: [
      {message: 'You are one lucky girl', prize: 'gift card'},
      {message: 'Awesome job', prize: 'gift card2'},
      {message: 'Wow you win', prize: 'gift card3'}
    ],
    balloonsAnim: ['anim1', 'anim2', 'anim3', 'anim4'],
    msgs_lost: ['Sorry babe, bad luck. You should try again tomorrow',
    'Sorry babe, bad luck. You should try again tomorrow',
    'Sorry babe, bad luck. You should try again tomorrow',
    'Sorry babe, bad luck. You should try again tomorrow'],
    msgs_win: ['Yeah!', 'You rocks!', 'Amazing!', 'Perfect!']
  },
  _startEvents: function(){
    $(this.counterWrapper)
    .unbind('count0')
    .bind('count0', function(){
      // Game.level++;
      // localStorage.setItem('bLevel', Game.level);
      var $game_text = Game.Assets.msgs_lost[Game.Utils.getRandomInt(0, Game.Assets.msgs_lost.length-1)]
      if(parseInt(localStorage.bGameStatus) == 1 ){
        $game_text = Game.Assets.msgs_win[Game.Utils.getRandomInt(0, Game.Assets.msgs_win.length-1)]
      }
      $(Game.msgWrapper)
      .text($game_text)
      .addClass('displayMsg')
      .on(Game.Utils.animationEndEvent, function(){
        $(this).removeClass('displayMsg');
        $(Game.gameWrapper).trigger('end').trigger('endLevel' + (Game.level - 1));
        // Game.start();

      });
      Game._allBalloonsGone();

    });

    $(this.single).not('.speedOut')
    .unbind('click')
    .bind('click', function(e){

      var balloon_type = $(e.currentTarget).data('type'),
          rare = $(e.currentTarget).data('rare'),
          balloon;
      if(rare == 1){
        balloon = Game.Assets.rareBalloons[balloon_type];
        // Game._allBalloons(0);
      } else {
        balloon = Game.Assets.balloons[balloon_type];
      }
      Game._addPoint(e.pageX, e.pageY, balloon, rare);
      Game._clickEffect(e.pageX, e.pageY);
      Game._updateCounter(false);
      Game._balloon_gone($(this));

    });

    $(this.gameWrapper)
    .unbind('end')
    .bind('end', function(){
      Game._alterStop();
    });
  },

  _addPoint: function(x, y, balloon, rare){
    var point = $("<div class='click-message'></div>");
    point.css('left', x).css('top', y);

    if(rare == 1){
      point.addClass('gain');
      point.html(balloon.message +"<br/>You win a " + balloon.prize).css('text-align', 'center');
      Game.level = 1;

    } else {
      point.addClass('loss');
      point.html(balloon.message);
    }
    point.prependTo('html');
    localStorage.setItem('bGameStatus', Game.level);
    // this.points = this.points + balloon.points;
    // this._updateInfo();
  },

  _clickEffect: function(x, y){
    var click = $("<div class='click'></div>");
    click.css('left', x).css('top', y);
    click.prependTo('html');
  },

  _updateCounter: function(setup){
    if(setup){
      this.counter = Game.counter;
    } else {
      this.counter--;
    }

    $(this.counterWrapper).trigger('count' + this.counter.toString());
    $(this.counterWrapper).text(this.counter);
  },

  _getRandomBalloon: function(){
    return this.Utils.getRandomInt(0, this.Assets.balloons.length-1);
  },
  _getBalloonInfo: function(id){
    return this.Assets.balloons[id];
  },
  _getRandomRareBalloon: function(){
    return this.Utils.getRandomInt(0, this.Assets.rareBalloons.length-1);
  },

  _getRareBalloonNo: function(){
    return this.Assets.rareBalloons.length;
  },

  _getRareBalloonInfo: function(id){
    return this.Assets.rareBalloons[id];
  },

  _allBalloonsGone: function(id){
    $(this.single).not('.speedOut').each(function(){
      Game._balloon_gone($(this));
    });

  },

  _balloon_gone: function(balloon){
    balloon.addClass('speedOut').on(Game.Utils.animationEndEvent, function(){ $(this).remove(); });
  },

  _alterBalloons: function(){

    var lucky = [];

    for (var i = 0; i < Game._getRareBalloonNo(); i++) {
      lucky[i] = Game.Utils.getRandomInt(0, $(this.single).toArray().length);
    }
    $(this.single).not('.speedOut').each(function(index, element){
      var rBalloon, newBalloon, rare;
        rBalloon = Game._getRandomRareBalloon();

      if ($.inArray(index, lucky) != -1){
        rBalloon = Game._getRandomRareBalloon();
        newBalloon = Game._getRareBalloonInfo(rBalloon);
        $(this).css('background-color', 'rgba(0,0,0,0.75)');
        rare = 1;
      } else {
        rBalloon = Game._getRandomBalloon();
        rare = 0;
      }
      $(this).data('type', rBalloon)
      .data('rare', rare);
    });
  },

  _alterStart: function(){
    Game._alterBalloons();
  },

  _alterStop: function(){
    clearInterval(this.alter);
  },

  _drawBalloons: function(){
    var maxTop = $(this.balloonsWrapper).height() - 65;
    var maxLeft = $(this.balloonsWrapper).width() - 45;
    var balloons = this.balloons();
    console.log(balloons)
    for (i = 0; i < balloons; i++) {
      var rBalloon = this._getRandomBalloon();
      var r = {
        top: this.Utils.getRandomInt(0, maxTop),
        left: this.Utils.getRandomInt(0, maxLeft),
        balloon: this._getBalloonInfo(rBalloon),
        anim: this.Assets.balloonsAnim[this.Utils.getRandomInt(0, this.Assets.balloonsAnim.length-1)]
      }
      var balloon = $("<div class='balloon target-balloon'></div>");
      balloon.addClass(r.anim);
      balloon.data('type', rBalloon);
      balloon.data('rare', 0);
      balloon.css('top', r.top + 'px');
      balloon.css('left', r.left + 'px');
      balloon.appendTo(this.balloonsWrapper);
    }
  },

  // _startMessage: function(){
  //   var layer = $('<div class="layer"><div id="msg"></div></div>').addClass('loaded');
  //   var $message_text = '<h1 class="welcome-message">Hey Babe welcome to our game<span class="blink">|</span></h1>';
  //
  //   // $('').appendTo(layer);
  //   //
  //   // layer.appendTo(this.gameWrapper).on(Game.Utils.animationEndEvent, function(){
  //   //   $message = $('#msg');
  //   //   $message.addClass('displayMsg').html($message_text);
  //       // $message
  //       // $('.welcome-message').addClass('active');
  //     // })
  //
  //     // $('<div id="msg">test</div>').addClass('displayMsg').appendTo(layer);
  //     // this._drawBalloons();
  //     // this._updateCounter(true);
  //     // // this._updateInfo();
  //     // this._startEvents();
  //     // this._alterStart();
  //   })
  // },

  start: function(){
    $(this.gameWrapper).trigger('start');
    this._drawBalloons();
    this._updateCounter(true);
    // this._updateInfo();
    this._startEvents();
    this._alterStart();

  }
};

$(document).ready(function(){
  Game.start();
});
