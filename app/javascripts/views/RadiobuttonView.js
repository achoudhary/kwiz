App.Views.Options=Ember.View.extend({
    title:null,
    defaultTemplate: Ember.Handlebars.compile('<div class="option-container"><div class="option-image"><img src="../images/blue-tick.png" /></div><div class="option-text">{{title}}</div></div>'),
    click:function(event){
    	var elem=event.srcElement || event.target;
    	$(".options .selected").each(function(){
    		$(this).removeClass('selected');
    	});
    	$(elem).parents('.radio-option').addClass("selected");
    	$('button.next').attr('disabled',false);
    	App.Controller.quizController.currentQuestion.userAnswer=this.get('title');
    }
});