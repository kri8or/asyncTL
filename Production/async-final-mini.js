function httpPost4Pages(e,t){var n=new XMLHttpRequest;n.open("POST",e,true);n.setRequestHeader("Content-type","application/x-www-form-urlencoded");n.onload=function(){numPages=document.getElementsByName("SelectPage")[0].length-1;t()};n.send()}function httpPost4Mtus(e,t,n){var r=new XMLHttpRequest;r.open("POST",e,true);r.setRequestHeader("Content-type","application/x-www-form-urlencoded");r.onload=function(){var e=document.createElement("div");e.innerHTML=this.responseText;var t=e.getElementsByTagName("input");for(var r=1;r<t.length-1;r++){arrMtus.push(parseInt(t[r].value))}itera++;if(itera==numPages){n()}};r.send("Page="+t)}function httpPost_UM(e,t){var n=new XMLHttpRequest;n.open("POST","https://pso-emea3/dba/async_list.cfm",true);n.setRequestHeader("Content-type","application/x-www-form-urlencoded");n.onload=function(){var n=getToProcess(this.responseText);if(n[0]!=""&&n[1]!=0){state.push({mtu:e,inNew:n[1].split(",").length,inProcess:n[0].split(",").length})}else if(n[0]!=""){state.push({mtu:e,inNew:0,inProcess:n[0].split(",").length,toProcess:n[0].split(",")})}else if(n[1]!=""){state.push({mtu:e,inNew:n[1].split(",").length,inProcess:0})}itera2++;if(itera2==arrMtus.length){t()}};n.send("chkAccountId="+e)}function getToProcess(e){var t=document.createElement("div");t.innerHTML=e;t.getElementsByTagName("form")[0].children[1].value;t.getElementsByTagName("form")[0].children[2].value;return[t.getElementsByTagName("form")[0].children[1].value,t.getElementsByTagName("form")[0].children[2].value]}function getPagesAndMtus(e){httpPost4Pages("https://pso-emea3/dba/async_mngt.cfm",function(){for(var t=1;t<=numPages;t++){httpPost4Mtus("https://pso-emea3/dba/async_mngt.cfm",t,function(){console.log("completo:"+arrMtus.length);arrMtus.sort(function(e,t){return e-t});e()})}})}function insertAfter(e,t){t.parentNode.insertBefore(e,t.nextSibling)}function createTable(e){var t=document.createElement("link");t.rel="stylesheet";t.type="text/css";t.href="https://dl.dropboxusercontent.com/u/4777/async/table-mini.css";document.head.appendChild(t);var n=document.createElement("div");n.className="CSSTableGenerator";var r=document.getElementsByTagName("tbody")[3];var i=document.createElement("table");if(e){i.id="tableTots"}else{i.id="tableRes"}i.border=3;insertAfter(n,r);var s=document.createElement("th");var o=document.createElement("th");var u=document.createElement("th");s.className="head";o.className="head";u.className="head";if(e){var a=document.createTextNode("Total of MTUs");var f=document.createTextNode("Total of New");var l=document.createTextNode("Total of In Process")}else{var a=document.createTextNode("MTU");var f=document.createTextNode("New");var l=document.createTextNode("In Process")}s.appendChild(a);o.appendChild(f);u.appendChild(l);i.appendChild(s);i.appendChild(o);i.appendChild(u);document.body.appendChild(n);n.appendChild(i);if(e){document.getElementsByClassName("head")[3].style.padding="10px";document.getElementsByClassName("head")[4].style.padding="10px";document.getElementsByClassName("head")[5].style.padding="10px"}else{document.getElementsByClassName("head")[0].style.padding="10px";document.getElementsByClassName("head")[1].style.padding="10px";document.getElementsByClassName("head")[2].style.padding="10px";document.getElementsByTagName("table")[4].style.float="left"}}function insertRow(e,t,n,r){var i=document.getElementById(e);var s=document.createElement("tr");var o=document.createTextNode(t);var u=document.createTextNode(n);var a=document.createTextNode(r);var f=document.createElement("td");var l=document.createElement("td");var c=document.createElement("td");f.appendChild(o);l.appendChild(u);c.appendChild(a);s.appendChild(f);s.appendChild(l);s.appendChild(c);i.appendChild(s);s.className="row";count++}function getState(){getPagesAndMtus(function(){console.log("lenght here (getState):"+arrMtus.length);if(document.getElementById("tableRes")==null){createTable(false);createTable(true)}else{var e=document.getElementById("tableRes").getElementsByTagName("tr");while(e.length>0){e[0].remove()}}var t=0;var n=0;for(var r=0;r<arrMtus.length;r++){httpPost_UM(arrMtus[r],function(){for(var e=0;e<state.length;e++){t+=state[e].inNew;n+=state[e].inProcess;if(state[e].inProcess>0){mtusInProcess.push(state[e].mtu)}insertRow("tableRes",state[e].mtu,state[e].inNew,state[e].inProcess)}insertRow("tableTots",state.length,t,n);node2.disabled=false;node.disabled=true;node.innerHTML="Done!";node2.hidden=false;node2.innerHTML="Process all In Process"})}})}function httpProcessInProcess(e,t){for(var n=0;n<state.length;n++){if(state[n].toProcess){var r=new XMLHttpRequest;r.open("POST","https://pso-emea3/dba/async_list.cfm",true);r.setRequestHeader("Content-type","application/x-www-form-urlencoded");r.onload=function(){console.log("...one processed");itera3++;if(itera3==e){t()}};r.send("chkAccountId="+state[n].mtu+"&nProcessLimit=-1"+"&bInProcessSubmit=Process+%27InProcess%27&lNew=&lInProcess="+state[n].toProcess.toString().replace(/,/g,"%2C"))}}}function reload(){numPages=0;arrMtus=[];state=[];itera=0;itera2=0;itera3=0;count=0;mtusInProcess=[]}function processAll(){var e=mtusInProcess.length;if(e==0){alert('Nothing to Process, did you run "Get Status"?');node.disabled=false;node.innerHTML="Get Status";reload()}else{httpProcessInProcess(e,function(){node2.innerHTML="COMPLETED!";node2.disabled=true;reload();node.disabled=false;node.innerHTML="Get Status"})}}var numPages=0;var arrMtus=[];var node=document.createElement("button");node.innerHTML="Get Status";node.addEventListener("click",function(){getState();node.disabled=true;node2.disabled=true;node.innerHTML="wait...."});document.getElementsByName("pagenavigation")[0].parentNode.appendChild(node);var node2=document.createElement("button");node2.innerHTML="Process all In Process";node2.hidden=true;node2.addEventListener("click",function(){processAll();node2.disabled=true});document.getElementsByName("pagenavigation")[0].parentNode.appendChild(node2);var itera=0;var state=[];var itera2=0;var count=0;var mtusInProcess=[];var itera3=0