//main.js
//master code\\


//---------------variables---------------\\

//char details
var charwidth = 32
var charheight = 64
var alive = 1
var killcount = 0

//end screen var
var endLimit = 0;

//shot limmit
var snumb = 1;

// player pos
var Pxcor = -(charwidth/2)
var Pycor = -(charheight/2)
var Pdeg = 0
var cdeg = 0

//bullet pos (bullet tracking)
var bulletx = []
var bullety = []
var bulletdx = []
var bulletdy = []
var bulletn = 0
var bulletmomentumX = []
var bulletmomentumY = []


//bullet colour
var bulletc = []
var bulletcpre = 0
var rainbow = 0

//main canvas pos tracking
var MCposX = maincanvas.width/2
var MCposY = maincanvas.height/2

//for rendering
var c = document.getElementById("maincanvas");
var ctx = c.getContext("2d");

var c_BG = document.getElementById("BGcanvas");
var ctx_BG = c_BG.getContext("2d");

var c_overlay = document.getElementById("CanvasOverlay");
var ctx_overlay = c_overlay.getContext("2d");

//amount shoot pressed
var shotsPressed = 0;

//canvas pos
var cPosXS = maincanvas.width/2
var cPosYS = maincanvas.height/2
var cPosX = 0
var cPosY = 0

//wave details 
var waven = 1
var wavenset = 0
var enemycycle = 1
var timeToWave = 20

//Enemy pos
var eposX = []
var eposY = []
var enemyNew = []
var numberofenemy = 0

//style
ctx_BG.fillStyle = "#FF0000";
ctx_overlay.fillStyle = "#FFFFFF";


//--------------------------------------------------\\
//                  keycode                         \\

c_overlay.addEventListener( "keydown", doKeyDown, true);

function doKeyDown(e){
	if ( e.keyCode == 88 ){
		if(snumb==1){
			snumb=0
			shotsPressed+=1			
			setTimeout( "snumb=1", 1000/2);
		}
	}
	
	
	if (e.keyCode == 90 ){
		if ( img_main == document.getElementById("p1")){
			img_main = document.getElementById("p2");
		}else{
			img_main = document.getElementById("p1");
		}
	}
}

//stops variables changing mid-render (needed)
function whenShotsFired(){
	var player = parseInt(img_main.id.charAt(1));
	for (var i=0; i < shotsPressed; i++){
		Pdeg += -1 + (player-1)*2;
		if ( img_main == document.getElementById("p2")){
			cPosX += Math.sin(((cdeg+90)*Math.PI)/180);
			cPosY += Math.cos(((cdeg-90)*Math.PI)/180);
		}else{
			cPosX += Math.sin(((cdeg-90)*Math.PI)/180);
			cPosY += Math.cos(((cdeg+90)*Math.PI)/180);
		}
		//bullet code
		bulletx.push(MCposX+Math.sin(((cdeg)*Math.PI)/180))*5;
		bullety.push(MCposY+Math.cos(((cdeg)*Math.PI)/180))*5;
		if (img_main == document.getElementById("p1")){
			bulletdx.push(cdeg+90)
			bulletdy.push(cdeg-90)
		}else{
			bulletdx.push(cdeg-90)
			bulletdy.push(cdeg+90)
		}
		bulletc.push(bulletcpre);
		bulletmomentumX.push(cPosX)
		bulletmomentumY.push(cPosY)
		bulletcpre+=1;
		if (bulletcpre==4){
			bulletcpre=0;
		}
	}
	shotsPressed = 0;
}


//---Enemy spawn code---\\

function newWave(){
	for (var i=1; i<=enemycycle; i++){
		eposX.push(getRandomInt(0, maincanvas.width-30));
		eposY.push(getRandomInt(0, maincanvas.height-30));
		enemyNew.push(1);
	}
	enemycycle+=1;
}

setInterval("timeToWave-=1", 1000)
setInterval("callwave()", 20000)

//--------------------------------------------------\\
//                 rendering                        \\

//define images
var img_main = document.getElementById("p1");
var background = document.getElementById("bg");

	
ctx.clearRect(0,0,maincanvas.width,maincanvas.height)
ctx.save();
ctx.translate(cPosXS,cPosYS)

function Play(){
	setInterval( "do_this()", 1000/60);
}

function do_this(){
	if (alive==1){
		ctx.clearRect(-maincanvas.width*3,-maincanvas.height*3,maincanvas.width*5,maincanvas.height*5)
		ctx_BG.clearRect(-maincanvas.width*3,-maincanvas.height*3,maincanvas.width*5,maincanvas.height*5)
		ctx_overlay.clearRect(-maincanvas.width*3,-maincanvas.height*3,maincanvas.width*5,maincanvas.height*5)
		ctx_BG.drawImage(background, 0, 0)
		MCposX += cPosX;
		MCposY += cPosY;
		ctx.restore();
		ctx.save();
		ctx.translate(MCposX,MCposY)
		cdeg+=Pdeg;
		if (cdeg>=360){
			cdeg -= 360;
		}else if (cdeg<=360){
			cdeg+=360
		}
		//bounce code live
		if (MCposX<=0 || MCposX>=maincanvas.width){
			cPosX = -cPosX;
		}
		if (MCposY<=0 || MCposY>=maincanvas.height){
			cPosY = -cPosY;
		}
		//bullet code
		bulletn=1
		while ((bulletx.length-bulletn)>=0){
			//get rid of excess bullets
			if (bulletx[bulletx.length-bulletn]<0 || bulletx[bulletx.length-bulletn]>maincanvas.width){
				bulletdel();
			}else  if (bullety[bulletx.length-bulletn]<0 || bullety[bulletx.length-bulletn]>maincanvas.height){
				bulletdel();
			}else{
				bulletn+=1
			}
		}	
		bulletn=1
		while ((bulletx.length-bulletn)>=0){
		
			//bullet colour
			if(rainbow == 1){
				colourBullets()
			}
			else{
				ctx_BG.fillStyle = '#FF0000'
			}
			
			//render bullets
			bulletx[bulletx.length-bulletn] += ((Math.sin(((bulletdx[bulletx.length-bulletn])*Math.PI)/180))*10)+bulletmomentumX[bulletx.length-bulletn];
			bullety[bulletx.length-bulletn] += ((Math.cos(((bulletdy[bulletx.length-bulletn])*Math.PI)/180))*10)+bulletmomentumY[bulletx.length-bulletn];
			ctx_BG.fillRect(bulletx[bulletx.length-bulletn],bullety[bulletx.length-bulletn],5,5);
			bulletn+=1
		}
		//enemy render
		waven = 1
		while((eposX.length -(waven))>=0){
			if(enemyNew[eposX.length-waven]==1){
				ctx_BG.fillStyle = '#800000'
			}else{
				ctx_BG.fillStyle = '#ff0000'
			}
			ctx_BG.fillRect(eposX[eposX.length-waven],eposY[eposY.length-waven],30,30)
			waven+=1
		}
		ctx_BG.fillStyle = '#ff0000'
		//enemy hit
		numberofenemy=eposY.length
		wavenset=1
		waven = 1
		while(wavenset<=numberofenemy){
			for (var i = 1; i<(bulletx.length+1); i++){
				if(enemyNew[eposX.length-waven]!==1){
					if (bulletx[bulletx.length-i]>=eposX[eposY.length-wavenset]&&bulletx[bulletx.length-i]<=(eposX[eposX.length-wavenset]+30)&&bullety[bulletx.length-i]>=eposY[eposY.length-wavenset]&&bullety[bulletx.length-i]<=(eposY[eposY.length-wavenset]+30)){
						bulletdel();
						eposX.splice(eposX.length-wavenset, 1)
						eposY.splice(eposY.length-wavenset, 1)
						enemyNew.splice(eposY.length-wavenset, 1)
						killcount+=1
					}
				}
			}
			waven+=1
			wavenset+=1
		}
		//back to canvas
		ctx.translate(cPosX,cPosY)
		ctx.rotate((Pdeg*Math.PI/180)+(cdeg*Math.PI/180));
		ctx.drawImage(img_main, Pxcor, Pycor);
		whenShotsFired();
		//player hit
		wavenset=1;
		waven=1
			while(wavenset<=numberofenemy){
				if(enemyNew[eposX.length-waven]!==1){
					if (MCposX+(charheight/2)>=eposX[eposY.length-wavenset]&&MCposX-(charheight/2)<=(eposX[eposX.length-wavenset]+30)&&MCposY+(charheight/2)>=eposY[eposY.length-wavenset]&&MCposY-(charheight/2)<=(eposY[eposY.length-wavenset]+30)){
						alive = 0
					}
				}
				wavenset+=1;
				waven+=1
			}
		//text overlay
		ctx_overlay.textAlign = "center";
		ctx_overlay.font ="40px Verdana";
		ctx_overlay.fillText("wave number: " + (enemycycle-1),(CanvasOverlay.width/2),40);
		ctx_overlay.textAlign = "left";
		ctx_overlay.font ="20px Verdana";
		ctx_overlay.fillText("Number of enemies: " + (waven-1), 10, CanvasOverlay.height-20);
		ctx_overlay.textAlign = "right";
		ctx_overlay.font ="20px Verdana";
		ctx_overlay.fillText("Next wave in: " + timeToWave, (maincanvas.width-5), 20);
	}else{
		ctx.restore();
		ctx.fillStyle = '#FF0000'
		if (endLimit<maincanvas.height){
			ctx.fillRect(0, 0,maincanvas.width,endLimit);
			endLimit+=3;
			endGameMessage()
		}
	}
}


//-----------EXTRA FUNCTIONS-----------\\

//deletes bullets (used twice)
function bulletdel(){
	bulletx.splice(bulletx.length-bulletn, 1);
	bullety.splice(bullety.length-bulletn, 1);
	bulletdx.splice(bulletdx.length-bulletn, 1);
	bulletdy.splice(bulletdy.length-bulletn, 1);
	bulletc.splice(bulletc.length-bulletn, 1);
	bulletmomentumX.splice(bulletmomentumX.length-bulletn, 1)
	bulletmomentumY.splice(bulletmomentumY.length-bulletn, 1)
}

//stops player movement (debug)
function stop(){
	cPosX=0;
	cPosY=0;
	cdeg=0;
	Pdeg=0;
}

//rainbow bullets (why not?)
function colourBullets(){
	switch(bulletc[bulletn-1]){
		case 0:
			ctx_BG.fillStyle = '#FF0000'
		break;
		case 1:
			ctx_BG.fillStyle = '#0066FF'
		break;
		case 2:
			ctx_BG.fillStyle = '#00FF00'
		break;
		case 3:
			ctx_BG.fillStyle = '#FFFF66'
		break;
		}
}

//activate rainbow bullets
function activateTheColour(){
	if (rainbow==0){
		rainbow=1;
	}else{
	rainbow=0;
	}
}

//random number generator (needed for enemy spawns)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//ending screen
function endGameMessage(){
	ctx_overlay.clearRect(-maincanvas.width*3,-maincanvas.height*3,maincanvas.width*5,maincanvas.height*5)
	ctx_overlay.textAlign = "center";
	ctx_overlay.font ="100px Verdana";
	ctx_overlay.fillText("You Died",(CanvasOverlay.width/2),(((CanvasOverlay.height/2)-220)+endLimit)-maincanvas.height);
	ctx_overlay.font ="60px Verdana";
	ctx_overlay.fillText("You lasted " + (enemycycle-1) + " rounds",(CanvasOverlay.width/2),(((CanvasOverlay.height/2)-80)+endLimit)-maincanvas.height);
	ctx_overlay.fillText("And killed " + (killcount) + " enemies",(CanvasOverlay.width/2),((CanvasOverlay.height/2)+endLimit)-maincanvas.height);
}

function callwave(){
	if(alive==1){
		newWave()
		timeToWave = 20
		setTimeout("returnToReality()", 3000);
	}
}

function returnToReality(){
	waven = 1
		while((eposX.length -(waven))>=0){
			if(enemyNew[eposX.length-waven]==1){
				enemyNew.splice((eposX.length-waven),1,0);
			}
			waven+=1
		}
}