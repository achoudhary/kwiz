App.Views.SearchTextField = Em.TextField.extend({
    insertNewline:function(){
        App.Controller.quizController.startQuiz();
    }
});