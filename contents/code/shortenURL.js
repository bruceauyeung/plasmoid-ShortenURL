var serviceProviders = [
    {
        "name": "126.am",
        "httpMethod":"POST",
        "spURLTemplate":"http://126.am/api!shorten.action?key=486360b8435744859d1f5dbd3b39f90a&longUrl=%url%",
        "postDataTemplate" : null,
        "respHandler": function(responseText){
            var obj = JSON.parse(responseText);
            return obj.url;
        }         
    },
    {
        "name": "flavr.fi",
        "httpMethod":"GET",
        "spURLTemplate":"http://flavr.fi/api?url=%url%",
        "respHandler": null
    },     
    {
        "name": "goo.gl",
        "httpMethod":"POST",
        "spURLTemplate":"https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA8fn2CmosOKprsnoPN7f-KXqxH5JwWIhs",
        "requestHeaders" :{"Content-Type": "application/json"},
        "postDataTemplate" : '{"longUrl": "%url%"}',
        "respHandler": function(responseText){
            var obj = JSON.parse(responseText);
            return obj.id;
        }        
    },    
    {
        "name": "is.gd",
        "httpMethod":"GET",
        "spURLTemplate":"http://is.gd/create.php?format=simple&url=%url%",
        "respHandler": null
    },
    {
        "name": "miniurl.com",
        "httpMethod":"GET",
        "spURLTemplate":"http://miniurl.com/api/v1/30aed39dd7ef0e2f8ca690a9c5904215/shorturl/create/url/%url%.json",
        "urlEncodeMethod":"base64",
        "respHandler": function(responseText){
            var obj = JSON.parse(responseText);
            return obj.data.short_url;
        }        
    }
    ,    
    {
        "name": "qurl.com",
        "httpMethod":"GET",
        "spURLTemplate":"http://qurl.com/automate.php?url=%url%/&email=bruce.oy@gmail.com@xprivate=0",
        "respHandler": null
    }
    ,     
    {
        "name": "tastyurls.com",
        "httpMethod":"GET",
        "spURLTemplate":"http://www.tastyurls.com/api.php?url=%url%",
        "respHandler": function(responseText){
            var obj = JSON.parse(responseText);
            return obj.data.short;
        }        
    }
    ,    
    {
        "name": "tinyurl.com",
        "httpMethod":"GET",
        "spURLTemplate":"http://tinyurl.com/api-create.php?url=%url%",
        "respHandler": null        
    }
    ,
    {
        "name": "tinyurl.ms",
        "httpMethod":"GET",
        "spURLTemplate":"http://tinyurl.ms/index.php?api=1&return_url_text=1&longUrl=%url%",
        "respHandler": null        
    }
    
    
    /**,
    {
        "name": "t.cn",
        "httpMethod":"GET",
        //"spURLTemplate":"https://api.weibo.com/2/short_url/shorten.json?source=3599790545&url_long=%url%",
        "spURLTemplate":"https://api.weibo.com/2/short_url/shorten.json?url_long=%url%",
        "postDataTemplate" : null,
        "respHandler": function(responseText){
            var obj = JSON.parse(responseText);
            return obj.urls[0].url_short;
        }
    }  
    */
]
function execute(longURL, spSeq){
    var xhr = new XMLHttpRequest();
    var sp = serviceProviders[spSeq];
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200)
            {
                Log.trace("got response from " + sp.name);
                var fileContent = xhr.responseText;
                Log.trace("responseText:" + fileContent);
                if(fileContent){
                    if(sp.respHandler){
                        var shortURL = sp.respHandler(fileContent);
                    }else{
                        var shortURL = fileContent;
                    }
                    
                    plasmoid.runCommand("sh", ["-c", "python ./contents/code/clip.py " + shortURL]);
                    Log.trace("short url copied to clipboard...");
                    
                }else{
                    Log.trace("failed to shorten this url.");
                }
            }
            else
            {
                Log.trace("http request error : " + xhr.status);
                Log.trace("http error response: " + xhr.responseText);
            }                    
        }
    }
    var encodedURL = "";
    if("BASE64".equalsIgnoreCase(sp.urlEncodeMethod)){
        encodedURL = Utils.Base64.encode(longURL);
    }else{
        encodedURL = encodeURIComponent(longURL);
    }
    
    var actualURL = sp.spURLTemplate.replaceAll("%url%", encodedURL);
    Log.trace("actualURL: " + actualURL);
    if(sp.httpMethod == "GET"){
        xhr.open(sp.httpMethod, actualURL);
        xhr.send();         
    }
    else if("POST".equalsIgnoreCase(sp.httpMethod)){

        xhr.open(sp.httpMethod, actualURL);
        if(sp.requestHeaders){
            sp.requestHeaders.each(function(propName, propValue){
                Log.trace( propName + " :" + propValue);
                xhr.setRequestHeader(propName, propValue);                
            });
        } 
        var postData = "";
        if(sp.postDataTemplate){
            postData = sp.postDataTemplate.replaceAll("%url%", longURL);
        }
        
        Log.trace("postData : " + postData);
        xhr.send(postData);        
    }
    board.text="sent request to " + sp.name;
    Log.trace("sent request to " + sp.name);
}
 
