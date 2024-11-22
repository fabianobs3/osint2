var nno=""
var nkey;

chrome.storage.local.get('nno', function (myresult) {
        nno = myresult.nno;
        console.log("nno val in online.js",nno);
        if(nno==2){

  var mnkey=""
  chrome.storage.local.get('mnkey', function (result2) {
          mnkey = result2.mnkey;
          console.log("mnkey val from online.js",mnkey,typeof(mnkey))

          if(mnkey != "undefined"){
            alert("Subcribe any Device for Notification\n"+mnkey)
            nkey=mnkey;
          }
          
            
        });
        
        
        }
                 
    }); 


console.log("nno val from online.js",nno);


pso=""
chrome.storage.local.get('pso', function (result3) {
        pso = result3.pso;

        
            
    });


    console.log("pso val from online.js",pso);


        
        

            
   

  


   




function onotif(user) {











   if(nkey==null||nkey==undefined||nkey==""||nkey=="undefined")
    return
  else{
        var xhr = new XMLHttpRequest();
    xhr.open("POST", nkey,true);
    xhr.send("📱WhatsApp Monitor: "+user+" is Online")

  }

}




function save(user,t1,t2,t){
  var d   = new Date();
  var curd=d.toLocaleDateString("en-GB").split(' ')[0]
  user=user.replace(/[^a-zA-Z0-9]/g, "")
  curd=curd.replace(/[^a-zA-Z0-9]/g, "")

  const surl='https://trackwapp.online/save/'+user+'/'+curd+'/'+t1+'/'+t2+'/'+t
  var xhr = new XMLHttpRequest();
   xhr.open("GET",surl);
  xhr.send()
  
}







function playsound()
{

let url = chrome.runtime.getURL('open.mp3')
                  let a = new Audio(url)
                  a.play()

}


setInterval(function(){
  try{
    olb=document.querySelector('#online_list_btn').innerText
    if(olb=='true' && pso=='3')
    {
      
      playsound();
    }
    prev=document.querySelectorAll('#userbtn')[0].innerHTML
    if(prev!='null'&&pso=='1')
    {
      playsound();
    }

  }
catch(err){}


try{
  olb=document.querySelector('#online_list_btn').innerText
  if(olb=='true' && pso=='3')
    {
      

      playsound();
    }

  user=document.querySelectorAll('#contactbtn')[0].innerHTML;
  if(user!='null')
  {


try {

    if(nno=='2')
    chrome.runtime.sendMessage({action: 'showNotification', user: user});

    let ttsMessage = 'TrackWapp Alert:  '+user+' is Online in WhatsApp';
    let utterance = new SpeechSynthesisUtterance(ttsMessage);
    utterance.rate = 0.75;
    utterance.pitch = 0.90;
    if(pso=='1' || pso=='3')
    window.speechSynthesis.speak(utterance);


  onotif(user);
} catch (err) {
  console.error('Error sending notification:', err);
}



  }
}
catch(err){}
   


},2200)


















function dcsv2() {
   console.log("Downloading History as CSV File")
    var rows = document.body.querySelectorAll(' table' + ' tr');
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            row.push('"' + data + '"');
        }
        csv.push(row.join(';'));
    }
    var csv_string = csv.join('\n');

   
    var filename = `whatsapp-monitor_${new Date().toISOString().split('T')[0]}&&${new Date().toLocaleTimeString()}.csv`;
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

   

     /*

  console.log(csv,csv_string);
    // Save the CSV file.
var blob = new Blob([csv], {type: 'text/csv'});
var url = window.URL.createObjectURL(blob);
var link = document.createElement('a');
console.log(link,url);
link.href = url;
link.download = 'table.csv';
document.body.appendChild(link);
link.click();
document.body.removeChild(link); 

 */


}







chrome.storage.local.get('save_interval', function (result4) {
        save_interval = parseInt(result4.save_interval);
        if(save_interval>=1)
        setInterval(dcsv2,save_interval*60000);

        
            
    });








function isElementPresentById(id) {
    return document.getElementById(id) !== null;
}




function exec_after_delay(){

    let element_present=null;

    try{

        element_present =document.querySelector('div[aria-label="Status"]').parentElement.parentElement;

    }
    catch (e) {
        console.log('error',e);
    }


    if(!element_present)
    {
        element_present =document.querySelector('div[title="Chats"]')

    }

    if(element_present && !(isElementPresentById('download')))
    {



        var elementHeight = "30px";

        var btn = document.createElement("BUTTON");
        var btnImage = document.createElement("IMG");


        btnImage.src = "https://raw.githubusercontent.com/rizwansoaib/whatsapp-monitor/master/Chrome-Extension/WhatsApp%20Monitor/images/icons/csv_download.jpg";

        btnImage.style.height = elementHeight;
        btn.appendChild(btnImage);
        btn.id="download";
        element_present.appendChild(btn);


        /*
        var img=document.createElement("IMG");
        img.id="download"
        img.src="https://raw.githubusercontent.com/rizwansoaib/whatsapp-monitor/master/Chrome-Extension/WhatsApp%20Monitor/images/icons/csv_download.jpg"
        document.querySelector("#side > header").appendChild(img);
        */

        var img=document.createElement("IMG");
        img.src="https://raw.githubusercontent.com/rizwansoaib/whatsapp-monitor/master/Chrome-Extension/WhatsApp%20Monitor/images/icons/icon_gray.png"
        img.style.height = elementHeight;
        img.addEventListener("click", function() {
            chrome.runtime.sendMessage({ action: "open_popup" });
        });
        element_present.appendChild(img);



        console.log('background online.js loaded successfully');



        document.getElementById('download').addEventListener('click', dcsv2);

    }

    else{
        setTimeout(exec_after_delay,60000);
    }




}

setTimeout(exec_after_delay,20000);


async function run_script_delay(){



  
chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
 chrome.scripting.executeScript(
      {
          target: {tabId: tab.id},
          files: ['websocket.js'],
          // function: () => {}, // files or function, both do not work.
      })
})


chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
  chrome.scripting.executeScript(
      {
          target: {tabId: tab.id},
          files: ['protobuf.js'],
          // function: () => {}, // files or function, both do not work.
      })
})




chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
  chrome.scripting.executeScript(
      {
          target: {tabId: tab.id},
          files: ['main.js'],
          // function: () => {}, // files or function, both do not work.
      })
})
}

//setTimeout(run_script_delay,20000);








var numarray=[]
chrome.storage.sync.get('numarray', function (data) {
        numarray = data.numarray;
        if(numarray)
        {

          //console.log('start',numarray);





        numarray.forEach(function(obj, index) {
          setTimeout(function(){
            openChat(obj)
          }, 5000 * (index + 1));
      });

        }

            
    });







    var openChat = phone => {

     // console.log('opening chat...',phone);
      var link = document.createElement("a");
      link.setAttribute("href", `whatsapp://send?phone=${phone}`);
      document.body.append(link);
      link.click();
      document.body.removeChild(link);
    };













