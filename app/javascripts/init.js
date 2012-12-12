var quiz={
    title: "IQ Tester",
    questions: [
    {
        question: "Two ducks and two dogs have a total of fourteen legs.",
        answers: [
        "true", "false"
        ],
        weight: 2,
        type: "radio"
    },
    {
        question: "Which number should come next in the series? 1 - 1 - 2 - 3 - 5 - 8 - 13",
        answers: [
        8, 13, 21, 26, 31
        ],
        weight: 2,
        type: "radio"
    },
    {
        question: "Which one of the five is least like the other four?",
        answers: [
        "dog", "mouse", "lion", "snake", "elephant"
        ],
        weight: 4,
        type: "radio"
    },
    {
        question: "Mary, who is sixteen years old, is four times as old as her brother. How old will Mary be when she is twice as old as her brother?",
        answers: [
        20, 24, 25, 26, 28
        ],
        weight: 4,
        type: "radio"
    },
    {
        question: "Which one of the numbers does not belong in the following series? 2 - 3 - 6 - 7 - 8 - 14 - 15 - 30",
        answers: [
        3, 7, 8, 15, 30
        ],
        weight: 4,
        type: "radio"
    },
    {
        question: "Which one of the five choices makes the best comparison? Finger is to Hand as Leaf is to:",
        answers: [
        "twig", "tree", "branch", "blossom", "branch"
        ],
        weight: 5,
        type: "radio"
    },
    {
        question: "If you rearrange the letters CIFAIPC you would have the name of a(n):",
        answers: [
        "city", "animal", "ocean", "river", "country"
        ],
        weight: 2,
        type: "radio"
    },
    {
        question: "Choose the number that is 1/4 of 1/2 of 1/5 of 200:",
        answers: [
        2, 5, 10, 25, 50
        ],
        weight: 4,
        type: "radio"
    },
    {
        question: "John needs 13 bottles of water from the store. John can only carry 3 at a time. What's the minimum number of trips John needs to make to the store?",
        answers: [
        2, 4, 4.5, 5, 6
        ],
        weight: 6,
        type: "radio"
    },
    {
        question: "Who is the famous personality?",
        imageURL: "http://ia.media-imdb.com/images/M/MV5BMTIwMzAwMzg1MV5BMl5BanBnXkFtZTYwMjc4ODQ2._V1._SX214_CR0,0,214,314_.jpg",
        weight: 8,
        type: "fillin"
    }
    ],
    time: 120, //If null, its not a timer base quiz. Value will be in seconds
    randomized: true //If true, the questions will be displayed in random.
};

App = Em.Application.create();

/**************************
* Models
**************************/
Question = Em.Object.extend({
	question: null,
	type: null,
	weight: null,
	userAnswer: null,
	answer: null
});

FillinQuestion = Question.extend({
	isFillin:true
});

ImageFillinQuestion = FillinQuestion.extend({
	imageURL: null
});

RadioQuestionModel = Question.extend({
	options: null
});

/**************************
* Views
**************************/
App.SearchTextField = Em.TextField.extend({
	insertNewline:function(){
        console.log('hello', this);
        App.quizController.startQuiz();
    }
});

Ember.RadioButton=Ember.View.extend({
    title:null,
    defaultTemplate: Ember.Handlebars.compile('<div class="option-container"><div class="option-image"><img src="../images/blue-tick.png" /></div><div class="option-text">{{title}}</div></div>'),
    click:function(event){
    	var elem=event.srcElement || event.target;
    	$(".options .selected").each(function(){
    		$(this).removeClass('selected');
    	});
    	$(elem).parents('.radio-option').addClass("selected");
    	$('button.next').attr('disabled',false);
    	App.quizController.currentQuestion.userAnswer=this.get('title');
    }
});
/*******************************
 * Controller
 */
App.quizController = Em.ArrayController.create({
	content: [],
	username: null,
	currentIndex:0,
	questionsAttempted:0,
	currentQuestion: null,
	startQuiz: function() {
	    this.set('currentIndex', 0);
	    this.loadNextQuestion();
	},
	endQuiz:function(){
        var prompt=confirm('Do you want to end the exam?');
	   if(prompt){
        this.computeResult();
        }
	},
	loadNextQuestion: function() {
        if(this.get('currentIndex')){
            this.pushObject(this.get('currentQuestion'));
        }
        if(this.get('content').length==quiz.questions.length){
            this.computeResult();
        }else{
		var index = this.get('currentIndex');
		this.set('currentIndex', index+1);
		var question = quiz.questions[index];
		$('button.next').attr('disabled',true);
        var questionModel;
		if(question.type === "radio") {
			questionModel = RadioQuestionModel.create({
				question: question.question,
				type: 'radio',
				weight: question.weight,
				answer: null,
				userAnswer: null,
				options: question.answers
			});
			
		}else if(question.type === "fillin"){
            questionModel = ImageFillinQuestion.create({
                question: question.question,
                type: 'fillin',
                weight: question.weight,
                answer: null,
                userAnswer: null,
                imageURL: question.imageURL
            });
        }
        if(questionModel){
            this.set('currentQuestion', questionModel);
            App.timerController.reset();
            App.timerController.startTimer();
        }
        }
	},
	computeResult: function() {
        //Loop through content to get the result
		$('div.questions').empty();
        //Change styling accordingly
        $('div.questions').html("<div class='container'>Thanks for Taking the quiz: You scored </div>");
	},
	getTotalQuestionsLength: function() {
		return quiz.questions.length;
	}.property()
});

App.timerController = Em.Object.create({
	timeLeft:":20",
    totalTime:20*1000,
	reset: function() {
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
