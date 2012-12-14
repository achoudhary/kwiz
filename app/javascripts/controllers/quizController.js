App.Controller.quizController = Em.ArrayController.create({
    content: [],
    username: null,
    currentIndex: 0,
    questionsAttempted: 0,
    currentQuestion: null,
    init: function() {
        var that = this;
        quiz.questions.forEach(function(value) {
            if (value.type == 'fillin') {
                that.pushObject(App.Model.ImageQuestion.create({
                    description: value.question,
                    type: value.type,
                    weightage: value.weight,
                    options: null,
                    imageURL: value.imageURL
                }));
            } else {
                that.pushObject(App.Model.Question.create({
                    description: value.question,
                    type: value.type,
                    weightage: value.weight,
                    options: value.answers
                }));
            }
        });
    },
    optionSelected: function(value) {
        this.get('content')[this.get('currentIndex') - 1].userAnswer = value;
        $('button.next').attr('disabled', false);
    },
    startQuiz: function() {
        
            App.get('router').transitionTo('root.quiz');
            this.set('currentIndex', 0);
            this.loadNextQuestion();
        
    },
    newQuiz:function(){
        App.get('router').transitionTo('root.index');
    },
    endQuiz: function() {
        var prompt = confirm('Do you want to end the exam?');
        if (prompt) {
            this.computeResult();
        }
    },
    loadNextQuestion: function() {
        var that = this;
        $('button.next').attr('disabled', true);
        if (this.get('content').length == this.get('currentIndex')) {
            this.computeResult();
        } else {
            App.Controller.timerController.startTimer();
            var index = this.get('currentIndex'),
                question = this.get('content')[index];
            this.set('currentIndex', index + 1);
            this.set('currentQuestion', question);
            $(".options").empty();
            if (question.type == 'radio') {
                question.options.forEach(function(data) {
                    App.Views.Options.create({
                        title: data
                    }).appendTo('.options');

                })
            }

        }

    },
    computeResult: function() {

        App.Controller.timerController.reset();
        var answered = this.get('content'),
            questions = quiz.questions,
            i = 0,
            score = 0;
        for (i = 0; i < answered.length; i++) {
            if (answered[i].userAnswer == questions[i].correctAnswer) {
                score += answered[i].weightage;
            }
        }
        var that=this;
        App.Model.UserDetails=Em.Object.create({
            userName:that.get('username'),
            userScore:score
        });
        
        App.get('router').transitionTo('results');
        
    },
    getTotalQuestionsLength: function() {
        return this.get('content').length;
    }.property()
});