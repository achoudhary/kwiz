App.Views.ImageQuestion = Ember.View.extend({
	url:'',
	defaultTemplate : Ember.Handlebars.compile('<img class="img" {{bindAttr src="url" }}/>')
});