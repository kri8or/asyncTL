
var numPages = 0;
var arrMtus = [];

var emea="";

var input1 = document.createElement("INPUT");
var form = document.createElement("span");
input1.setAttribute("type", "text"), input1.setAttribute("id", "emea"), input1.setAttribute("value", "emea3"), form.appendChild(input1);
 document.getElementsByName("pagenavigation")[0].parentNode.appendChild(form);


 var node=document.createElement("button");
 node.innerHTML='Get Status';
 node.addEventListener("click", function() { getState();node.disabled=true;node2.disabled=true;node.innerHTML='wait....';});
 document.getElementsByName('pagenavigation')[0].parentNode.appendChild(node);


 var node2=document.createElement("button");
 node2.innerHTML='Process all In Process';
 node2.hidden=true;
 node2.addEventListener("click", function() { processAll();node2.disabled=true;});
 document.getElementsByName('pagenavigation')[0].parentNode.appendChild(node2);



var node3=document.createElement("button");
 node3.innerHTML='Process all In New';
 node3.hidden=true;
 node3.addEventListener("click", function() { processAllNew();node3.disabled=true;});
 document.getElementsByName('pagenavigation')[0].parentNode.appendChild(node3);




function httpPost4Pages(url,callback){
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {

	    //do something to response
	    numPages=document.getElementsByName("SelectPage")[0].length-1;

	  callback();
	     
	};
	xhr.send();
}

var itera = 0;
function httpPost4Mtus(url,page,callback){
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	
	xhr.onload = function () {
	    // do something to response
	    var elemAux = document.createElement('div'); 
		elemAux.innerHTML = this.responseText;
		var input = elemAux.getElementsByTagName('input'); 
		
	    	for(var i = 1;i <input.length-1; i++)  
			{										
			arrMtus.push(parseInt(input[i].value)); 
			
			}

	  itera++;
	     if (itera==numPages){
	    	callback();
	    }
		
	};
	xhr.send('Page='+page);
}


// ------------------------
//3- get STATE

var state=[]; //MTU --- New ---- InProcess
var itera2 = 0
function httpPost_UM(mtu,callback){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "https://pso-"+emea+"/dba/async_list.cfm", true);

	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onload = function () {
	    // do something to response
	    // ver quantos inProcess e quantos em New
	    

	    var res= getToProcess(this.responseText);

	    if(res[0]!="" && res[1]!=""){ //se ha algo em new e algo em InProcess 
	    	state.push({"mtu":mtu,"inNew":res[1].split(",").length,"inProcess":res[0].split(",").length, toProcess:res[0].split(",") , toNew:res[1].split(",")});
			



	    }else if (res[0]!=""){ //se SO ha algo em Inprocess 
        	state.push({"mtu":mtu,"inNew":0,"inProcess":res[0].split(",").length, toProcess:res[0].split(",")});	
	    

	    }else if (res[1]!=""){ //se SO ha algo em New 
	    	state.push({"mtu":mtu,"inNew":res[1].split(",").length,"inProcess":0,toNew:res[1].split(",")});	    	
	    }
		
		itera2++;
		if (itera2==arrMtus.length){
			callback();
		}
	};
	xhr.send('chkAccountId='+mtu);
	 
}





function getToProcess(responseText){
	var elemAux = document.createElement('div');
	elemAux.innerHTML = responseText;
	//elemAux.getElementsByTagName('form')[0].children[0].value 		//accountID 
	
	return [elemAux.getElementsByTagName('form')[0].children[1].value,  //lInProcess
			elemAux.getElementsByTagName('form')[0].children[2].value]; //lNew
}


function getPagesAndMtus(callback){
	httpPost4Pages("https://pso-"+emea+"/dba/async_mngt.cfm", function(){
	for(var i = 1;i <= numPages; i++){
		
			httpPost4Mtus("https://pso-"+emea+"/dba/async_mngt.cfm",i,function(){  //this callback is executed when we get MTUs from ALL paginas  
					console.log('completo:'+arrMtus.length);
					arrMtus.sort(function(a,b){return a - b;});
					//aqui esta completo
					callback(); 
			}); 
	} 
	});		
}  



function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createTable(totais){ //create table with header...


	//insert CSS

	var l = document.createElement("link");
	l.rel="stylesheet";
	l.type="text/css";
	l.href="https://dl.dropboxusercontent.com/u/4777/async/table.css";
	document.head.appendChild(l);

	var div = document.createElement('div'); 
	div.className= "CSSTableGenerator";
	var ref = document.getElementsByTagName('tbody')[3];
	var table = document.createElement("table");
	if (totais){
		table.id = "tableTots";
	}else{
		table.id = "tableRes";
	}
	
	
	table.border = 3;

	//insertAfter(table,ref);
	insertAfter(div,ref);


    var th1 =document.createElement('th');
    var th2 =document.createElement('th');
    var th3 =document.createElement('th');
    th1.className="head";
    th2.className="head";
    th3.className="head";

    if (totais){
    var h1text = document.createTextNode('Total of MTUs');
    var h2text = document.createTextNode('Total of New');
    var h3text = document.createTextNode('Total of In Process');
    }else{
    var h1text = document.createTextNode('MTU');
    var h2text = document.createTextNode('New');
    var h3text = document.createTextNode('In Process');	
    }
    

    th1.appendChild(h1text);
    th2.appendChild(h2text);
    th3.appendChild(h3text);

    table.appendChild(th1);
    table.appendChild(th2);
    table.appendChild(th3);
   
//document.body.appendChild(table);
document.body.appendChild(div);
div.appendChild(table);


if (totais){
document.getElementsByClassName('head')[3].style.padding = "10px";
document.getElementsByClassName('head')[4].style.padding = "10px";
document.getElementsByClassName('head')[5].style.padding = "10px";
}else{
document.getElementsByClassName('head')[0].style.padding = "10px";
document.getElementsByClassName('head')[1].style.padding = "10px";
document.getElementsByClassName('head')[2].style.padding = "10px";
document.getElementsByTagName('table')[4].style.float = "left";
}
}

var count=0;
function insertRow(tabela,col1,col2,col3){
	//'tableRes'
	//'tableTots'

	var table = document.getElementById(tabela);

	var tr = document.createElement('tr');  
	var text1 = document.createTextNode(col1);
    var text2 = document.createTextNode(col2);
    var text3 = document.createTextNode(col3);

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    
    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    table.appendChild(tr);
    tr.className="row";
    //document.getElementsByClassName('row')[count].children[0].style.padding = "10px";
    //document.getElementsByClassName('row')[count].children[1].style.padding = "10px";
    //document.getElementsByClassName('row')[count].children[2].style.padding = "10px";

    count++;
}

	
// get STATE 

var mtusInProcess=[];

var mtusInNew=[];

function getState(){
	
	emea = document.getElementById("emea").value;
	

	getPagesAndMtus(function(){
	 	console.log("lenght here (getState):"+arrMtus.length);
	 	

	 	if (document.getElementById('tableRes')==null){
	 		createTable(false);
	 		createTable(true);	
	 	}else{
	
	 		var temp=(document.getElementById('tableRes').getElementsByTagName('tr'));
	 		while(temp.length>0){
	 			temp[0].remove();
	 		}

	 		
	 	}


	 	var countNew=0;
	 	var countProcess=0;

	 	for(var i = 0;i < arrMtus.length; i++){
				httpPost_UM(arrMtus[i],function(){ 		 			
		 			for (var j = 0; j<state.length;j++){

		 				countNew += state[j].inNew;
		 				countProcess += state[j].inProcess;
		 				
		 				if (state[j].inProcess>0){
		 					mtusInProcess.push(state[j].mtu);   //todas as mtus com Inprocess sao inseridas neste array
		 				}

		 				if (state[j].inNew>0){
		 					mtusInNew.push(state[j].mtu);   //todas as mtus com Inprocess sao inseridas neste array
		 				}

		 				insertRow('tableRes',state[j].mtu,state[j].inNew,state[j].inProcess);
		 			}

		 			insertRow('tableTots',state.length,countNew,countProcess);
		 			node2.disabled=false;
		 			node.disabled=true;
		 			node.innerHTML='Done!';
		 			node2.hidden=false;
		 			node2.innerHTML='Process all In Process'

		 			node3.disabled=false;
		 			node3.hidden=false;
		 			node3.innerHTML='Process all In New'



				});
		}
	 });
}

// Process In PRocess 
var itera3=0;
function httpProcessInProcess(size,callback){ 

	for(var i=0;i<state.length;i++){ //para testar meter o i a comecar perto do fim....
		if (state[i].toProcess){
			//faz request para processar
			var xhr = new XMLHttpRequest();
			xhr.open('POST', "https://pso-"+emea+"/dba/async_list.cfm", true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onload = function () {
	    		console.log("...processed");
	    		itera3++;

	    		if (itera3==size){
	    			callback();
	    		}
			};
		xhr.send('chkAccountId='+state[i].mtu+"&nProcessLimit=-1"+"&bInProcessSubmit=Process+%27InProcess%27&lNew=&lInProcess="+state[i].toProcess.toString().replace(/,/g,"%2C"));
		}
	}
}

// Process In New 
var itera4=0;
function httpProcessInNew(size,callback){ 

	for(var i=0;i<state.length;i++){ //para testar meter o i a comecar perto do fim....
		if (state[i].toNew){
			//faz request para processar
			var xhr = new XMLHttpRequest();
			xhr.open('POST', "https://pso-"+emea+"/dba/async_list.cfm", true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onload = function () {
	    		console.log("...processed");
	    		itera4++;

	    		if (itera4==size){
	    			callback();
	    		}
			};
		xhr.send('chkAccountId='+state[i].mtu+"&nProcessLimit=-1"+"&bNewSubmit=Process+%27New%27&lInProcess=&lNew="+state[i].toNew.toString().replace(/,/g,"%2C"));
	
		}
	}
}






function reload(){
	numPages=0;
	arrMtus=[];
	state=[];
	itera=0;
	itera2=0;
	itera3=0;
	count=0;
	mtusInProcess=[];
	mtusInNew=[];
}


// fill array mtusInNew like arrays mtusInProcess

function processAll(){ // process in process
	var size = mtusInProcess.length;
	if (size==0){
		alert("Nothing to Process, did you run \"Get Status\"?");
		//node2.disabled=false;
		node.disabled=false;
		node.innerHTML="Get Status";
		reload();
	}else{
		console.log('Request should be made here....')
		httpProcessInProcess(size,function(){
			node2.innerHTML='COMPLETED!';
			node2.disabled=true;
			reload();
			node.disabled=false;
			node.innerHTML="Get Status";
		});
	}
}


function processAllNew(){ // process in process
	var size = mtusInNew.length;
	if (size==0){
		alert("Nothing to Process, did you run \"Get Status\"?");
		//node2.disabled=false;
		node.disabled=false;
		node.innerHTML="Get Status";
		reload();
	}else{
		console.log('Request should be made here....')
		httpProcessInNew(size,function(){
			node3.innerHTML='COMPLETED!';
			node3.disabled=true;
			reload();
			node.disabled=false;
			node.innerHTML="Get Status";
		});
	}
}






 


