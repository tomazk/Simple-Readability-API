var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    querystring = require("querystring"),
    readability = require("readability");

// 404 error
function err404(response){
    response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 Not Found\n");
	response.end();
	console.log("404");
}

// 405 error
function err405(response, allowed_method){
    response.writeHead(405,
         {"Content-Type": "text/plain", "Allow": allowed_method});
	response.write("405 Method Not Allowed\n");
	response.end();
	console.log("405");
}

// respond with a Json document
function renderJson(response, responseData){
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(responseData));
    response.end();
    console.log("200: JSON sent");
}

// response data container
function ResponseData(result){
    this.result = result || "" ;
    this.status = "OK"; // OK|ERROR
}
ResponseData.prototype.setError = function(){
    this.result = "";
    this.status = "ERROR";
}


// extract content with readability and respond with a Json document
function extractContent(response, html_string){
    readability.parse(html_string, null, function(result) {
        
        if(result.error){ 
            responseData = new ResponseData();
            responseData.setError();
            renderJson(response, responseData);
        }
        else{
            responseData = new ResponseData(result.content);
            renderJson(response, responseData);
        }
        
    });
}

http.createServer(function(request, response){
    var uri = url.parse(request.url).pathname; //get uri
    console.log("URI:" +  uri);
    
    //routing
    switch(uri){
    
        /* 
        // debugging helper
        case "/form/": 
        display_submit_form(response);
        console.log("display form");
        break;
        */
        
        case "/extract/":
            console.log("extract");
            // check method
            if(request.method === "POST"){
                request.setEncoding("utf-8")
                
                // read utf-8 encoded POST data
                var data = "";
                
                request.on("data", function(data_chunk){
                    console.log("data chunk");
                    data += data_chunk;
                });
                
                request.on("end", function(){
                    //perform extraction
                    extractContent(response, data);
                });
            }
            else{
                err405(response, "POST");
            }
        break;
        
        default: 
            err404(response);
    }
}).listen(8080);

console.log("Server running on http://localhost:8080/");
