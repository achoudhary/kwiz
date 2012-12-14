App.Views.SearchTextField = Em.TextField.extend({
    insertNewline: function() {
        App.Controller.quizController.startQuiz();
    },
    keyUp: function(evt) {
        if(this.value&&this.value.length>3){
            $('button.start').attr('disabled',false);
        }else{
            $('button.start').attr('disabled',true);
        }
    }
});

App.Views.AnswerField = Em.TextField.extend({
    insertNewline: function() {
        App.Controller.quizController.loadNextQuestion();
    },
    placeholder: "Enter your answer here",
    keyUp: function(evt) {
        $('button.next').attr('disabled',false);
        App.Controller.quizController.optionSelected(this.value);
    }
});