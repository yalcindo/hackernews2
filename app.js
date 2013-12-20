
/**
 * Module dependencies.
 */
 var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
writeStream.write('url,'+'\n');
console.log("something");
var writeLinks=function(nextPage)
{
	
	request("https://news.ycombinator.com" + nextPage,function(err,response,body)
	{
	  	if (!err && response.statusCode == 200) {
			$ =cheerio.load(body);
	       
			$("span.comhead").each(function(i,el){
				var a=$(this).prev();
				var link=a.attr('href');
				console.log(link);
			 	writeStream.write(link+','+'\n');
			});
       
			var nextPage=$('.title').last().find('a').attr("href");
			nextPage==="news2" ? nextPage= "/"+nextPage : nextPage=nextPage;
   		
		   if(nextPage)
		    {
		   		// setTimeout(writeLinks(nextPage),3000);
		   		writeLinks(nextPage)
		   }
  		}

	});
}

writeLinks(" ");

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
