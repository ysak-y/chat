
var StampModel = Backbone.Model.extend({
	defaults: {
		stamps: [
			"stamp1",
			"stamp2",
			"stamp3",
			"stamp4",
			"stamp5",
			"stamp6",
			"stamp7",
			"stamp8",
			"stamp9",
			"stamp10"
		]
	},
	isStamp: function(txt){
		if (this.get("stamps").indexOf(txt) === -1){
			return false;
		}
		else{
			return true;
		}
	}	
});
