import QtQuick 1.1
import org.kde.draganddrop 1.0
import "../code/json2.js" as Json2
import "../code/logger.js" as Log
import "../code/utils.js" as Utils
import "../code/config.js" as Config
import "../code/shortenURL.js" as ShortenURL
Rectangle {
     width: 220
     height: 100
     color: "white"
     border.color: "grey"
     border.width: 1
     radius: 1
     smooth: true
    Text {
        id: board
        property int minimumWidth: paintedWidth
        property int minimumHeight: paintedHeight
        text: "drop any url here...";
    } 
    TextEdit {
        id: clipboardCopier
        visible: false
        text: ""
    }    
     DropArea {
        enabled: true
        anchors.fill: parent
        onDrop: {
            
            // event.mimeData.url holds value only when an url dropped onto this plasmoid,
            //but event.mimeData.text holds value either when an url is dropped or a normal text is dropped
            //Log.trace("URL:"+event.mimeData.url);
            var originURL = event.mimeData.text;
            
            ShortenURL.execute(originURL, Config.config.serviceProvider);
        }
    }
    Component.onCompleted: {
        plasmoid.addEventListener('ConfigChanged', Config.configChanged)
    }   
   
 } 
