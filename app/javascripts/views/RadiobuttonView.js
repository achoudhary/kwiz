App.Views.Options=Ember.View.extend({
    title:null,
    defaultTemplate: Ember.Handlebars.compile('<div class="radio-option"><div class="option-container"><div class="option-image"><img src="../images/blue-tick.png" /></div><div class="option-text">{{title}}</div></div></div>'),
    click:function(event){
    	var elem=event.srcElement || event.target;
    	$(".options .selected").each(function(){
    		$(this).removeClass('selected');
    	});
    	$(elem).parents('.radio-option').addClass("selected");
    	App.Controller.quizController.optionSelected(this.get('title'));
    }
});