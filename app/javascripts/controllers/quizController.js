App.Controller.quizController = Em.ArrayController.create({
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
			questionModel = App.Model.Question.create({
				question: question.question,
				type: 'radio',
				weightage: question.weight,
				options: question.answers
			});

		}else if(question.type === "fillin"){
            questionModel = App.Model.ImageQuestion.create({
                question: question.question,
                type: 'fillin',
                weightage: question.weight,
                imageURL: question.imageURL
            });
        }
        if(questionModel){
            this.set('currentQuestion', questionModel);
            App.Controller.timerController.reset();
            App.Controller.timerController.startTimer();
        }
        }
	},
    computeResult: function() {
        App.timerController.reset();
        var answered=this.get('content'),
        questions=quiz.questions;
        var i=0,score=0;
        for(i=0;i<answered.length;i++){
            if(answered[i].userAnswer==questions[i].correctAnswer){
                score+=answered[i].weight;
            }
        }
        //Loop through content to get the result
		$('div.questions').empty();
        //Change styling accordingly
        $('div.questions').html("<div class='container' style='color:white'>Thanks for Taking the quiz: You scored "+score+"</div>");
	},
	getTotalQuestionsLength: function() {
		return quiz.questions.length;
	}.property()
});
