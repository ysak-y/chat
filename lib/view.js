

var SendButton = Backbone.View.extend({

	el: "#sendButton",
	initialize: function(){
		console.log("sendButton init");
		_.bindAll(this, "render");
	},
	events: {
		"click": "sendMessage"
	},
	sendMessage: function(){
		console.log("sendButton");
		this.$el.trigger("sendMessage");	
	} 
});

var StampButton = Backbone.View.extend({
	el: "#stampButton",
	initialize: function(){
		_.bindAll(this, "render");
	},
	events: {
		"click": "openStampWindow"
	},
	openStampWindow: function(){
		$("#stampFieldContainer").toggle();	
	}
});

var Stamp = Backbone.View.extend({
	tagName: "td",
	initialize: function(src){
		_.bindAll(this, "render");
		this.src = src;
		this.render();
	},
	events: {
		"click": "clickStamp"
	},
	render: function(){
		
		var img = document.createElement("img");
		img.src = "./img/" + this.src + ".png";
		img.setAttribute("class", "stamp");

		var div = document.createElement("div");
		div.setAttribute("class", "mdl-cell mdl-cell--2-col");
		div.appendChild(img);

		this.el.appendChild(div);
		return this;
	},
	clickStamp: function(){
		this.$el.trigger("clickStamp", [this.src]);	
	}
});

var StampField = Backbone.View.extend({
	el: "#stampField",
	initialize: function(socket){
		_.bindAll(this, "render");
		this.socket = socket;
		this.render();
	},
	events: {
		"clickStamp": "sendStamp",
	},
	render: function(){
		this.$el.children().remove();	
		
		var tr = document.createElement("tr");
		var stamps = new StampModel().get("stamps");

		for(var i in stamps){
			var stamp = new Stamp(stamps[i]);
			tr.appendChild(stamp.el);
		}

		this.el.appendChild(tr);

		return this;
	},
	sendStamp: function(e, s){
		console.log(s);
		this.socket.emit("pushMessage", [s, ID]);
	}
});

var TextBox = Backbone.View.extend({
	el: "#textBox",
	initialize: function(){
		console.log("textBox init");
		_.bindAll(this, "render");
	},
	events: {
		"keydown": "sendMessage"
	},
	sendMessage: function(e){
		if(e.keyCode === 13 && e.metaKey){
			console.log("textBox");
			this.$el.trigger("sendMessage");	
		}
	}
});

var Footer = Backbone.View.extend({
	el: "#footer",
	initialize: function(socket){
		this.socket = socket;
		this.textBox = new TextBox();
		this.sendButton = new SendButton();
		this.stampButton = new StampButton();
		this.stampField = new StampField(this.socket);		
	},
	events: {
		"sendMessage": "pushMessage",
	},
	pushMessage: function(){
		var txt = this.textBox.$el.val();
		if (txt !== ""){
			console.log("message pushed");
			this.socket.emit("pushMessage", [txt, ID]);
		}
		this.textBox.$el.val("");
	}
});

var Message = Backbone.View.extend({
	tagName: "tr",
	initialize: function(model){
		this.text = model[0];
		this.id = model[1];
		this.type = model[2];
		
		if (this.id === ID){
			this.pos = "right";
		}
		else{
			this.pos = "left";
		}

		_.bindAll(this, "render");
		this.render();
	},
	render: function(){
		var txt = this.text;
		var td = document.createElement("td");
		var obj;

		if (this.type == "text"){
		
			obj = document.createElement("div");
			obj.appendChild(document.createTextNode(txt));
			obj.setAttribute("class", this.pos + " " + this.pos + "_balloon");
			
		}
		else{
			obj = document.createElement("img");
			obj.src = "./img/" + txt + ".png";
			obj.setAttribute("class", "stampInMessageField " + this.pos);
		}
		td.appendChild(obj);
		this.el.appendChild(td);
		return this;
	}
});

var MessageField = Backbone.View.extend({
	el: "#messageField",
	initialize: function(socket, model){
		
		_.bindAll(this, "render");
		var it = this; 
		this.model = model;

		this.socket = socket;
		this.socket.on("reloadMessage", function(model){
			it.model = model;
			it.render();
		});

		this.render();

	},
	render: function(){
		
		this.$el.children().remove();
		var stamp_model = new StampModel();
		for (var i in this.model){
			var message = this.model[i];
			var type = "";
			if (stamp_model.isStamp(message[0])){
				type = "stamp";
			}
			else{
				type = "text";
			}
			var balloon = new Message([message[0], message[1], type]);
			this.el.appendChild(balloon.el);
		}

		return this;
	},
});

var NameText = Backbone.View.extend({
	el: "#nameText",
	initialize: function(){
		this.id = ID;
		_.bindAll(this, "render");	
		this.render();
	},
	render: function(){
		this.$el.text(this.id.slice(0, 8));
		return this;
	}
});
