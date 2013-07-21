var config = {
    isInfoEnabled : true,
    isTraceEnabled : false,
    // unit is millisecond
    serviceProvider : 0
}    
function configChanged()
{
    plasmoid.activeConfig = "main";
    var serviceProvider = plasmoid.readConfig("serviceProvider");
    config.serviceProvider = serviceProvider;
    
    Log.trace("serviceProvider changed to: " + config.serviceProvider);
    
    var traceEnabled = plasmoid.readConfig("traceEnabled");
    // trace info first, otherwise trace information will not be printed if being changed to false.
    Log.trace("traceEnabled changed to :" + traceEnabled);
    config.isTraceEnabled = traceEnabled == true ? true: false;
} 
