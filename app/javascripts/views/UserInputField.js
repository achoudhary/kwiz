App.SearchTextField = Em.TextField.extend({
    insertNewline:function(){
        console.log('hello', this);
        App.quizController.startQuiz();
    }
});