App.timerController = Em.Object.create({
    timeLeft:":20",
    totalTime:20*1000,
    reset: function() {
        clearInterval(this.em);
        this.set('timeLeft',"00:20");
    },
    startTimer:function(){
        this._startedAt = new Date();
        var that=this;
        this.em=setInterval(function() {
         that.updateTimeLeft.apply(that);
         }, 1000);
    },
    updateTimeLeft:function(){
        var now = new Date(),
            diff = now - this._startedAt;
        if(diff>=this.get('totalTime')){
            clearInterval(this.em);
            App.quizController.loadNextQuestion();
        }
        this.set('timeLeft', this.formatTime(this.get('totalTime') - diff));
        var rotationDegrees = 360-(360*((this.get('totalTime')- diff)/this.get('totalTime')));
        $('.timer-hand').css('-webkit-transform', 'rotate('+rotationDegrees+'deg)');
        $('.timer-hand').css('-moz-transform', 'rotate('+rotationDegrees+'deg)');
        $('.timer-hand').css('-ms-transform', 'rotate('+rotationDegrees+'deg)');
        $('.start-timer-image').css('opacity',(this.get('totalTime')- diff)/this.get('totalTime'));
        $('.time-up-image').css('opacity',1-(this.get('totalTime')- diff)/this.get('totalTime'));
    },
    formatTime:function(str){
        var seconds = parseInt(Math.round(str/1000), 10),
            minutes = parseInt(seconds/60, 10);

        function pad(num) {
            if (num < 10) return '0' + num;
            else return num.toString();
        }
        return pad(minutes) + ':' + pad(seconds - minutes * 60);
    }
});
