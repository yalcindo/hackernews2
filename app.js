
/**
 * Module dependencies.
 */
 var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");


writeStream.write('url,'+'title,'+'\n');
console.log("something");
var writeLinks=function(nextPage)
{
	
	request("https://news.ycombinator.com"+nextPage,function(err,response,body)
	{
	  	if (!err && response.statusCode == 200) {
			$ =cheerio.load(body);
	       
			$("span.comhead").each(function(i,el){
				var a=$(this).prev();
				var link=a.attr('href');
				var title=a.text();

			 	writeStream.write(title+','+link+','+'\n');
			 	var delay=3000;
			 	setTimeout(function(){
			 		console.log("it is working");
			 	writeStream.close();
			 	},delay);
			});
       
			var nextPage=$('.title').last().find('a').attr("href");
			nextPage==="news2" ? nextPage= "/"+nextPage : nextPage=nextPage;
   		 
		   if(nextPage)
		    {
		   		
		   		writeLinks(nextPage)
		   }
  		}

	});
}

writeLinks(" ");


