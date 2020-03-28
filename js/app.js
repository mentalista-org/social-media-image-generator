//TODO
//ADD mentalista installation params

var canvas = $('#generatedImage').get(0);
var ctx = canvas.getContext('2d');

/*var installationParams = [
	{
		"name":"mentalista foot",
		"label":"mentalista•foot",
		"color":"#ffffff",
		"hashtag":"#mentalistafoot"
	},{
		"name":"mentalista guinguette",
		"label":"mentalista•guinguette",
		"color":"#ffffff",
		"hashtag":"#mentalistaguinguette"
	},
];*/

var imageParams = {
	"width":800,
	"height":800,
	"backgroundColor":"#ffffff",
	"margin":10
};

/*––––––––––––––– INIT –––––––––––––––*/

$(document).ready(function () {
	drawCanvas();
});

$('#edittoggle').on('click', function(){
	$('#editor').toggleClass('hidden');
});

$('#closeEditor').on('click', function(){
	$('#editor').toggleClass('hidden');
});

$('#bottomCloseEditor').on('click', function(){
	$('#editor').toggleClass('hidden');
});

$('#downloadButton').on('click', function(){
	downloadImage();
});

//Download generated image
$('#download').click(function(){
	downloadImage();
});

//Si il y a un changement il faut tout regénérer
$('#params').on('input', function() { 
	drawCanvas();
});

//$('#editor').on("swipe",function(){
	//console.log('swipe');
	//$(this).hide();
//});

/*$('#installation').on('change', function() {
	alert( this.value );
	drawCanvas();
});*/

$('#upload').on('click', function () {
    $('#file').click();
});

$('input[name=file]').change(function(ev) {
	//alert('onechange')
	var file_data = $('#file').prop('files')[0];
    if(file_data != undefined){
		console.log(file_data);

		var form_data = new FormData();
		form_data.append('file', file_data);
		$.ajax({
		    url: 'upload.php', // point to server-side controller method
		    dataType: 'text', // what to expect back from the server
		    cache: false,
		    contentType: false,
		    processData: false,
		    data: form_data,
		    type: 'post',
		    success: function (response) {
		        $('#image').val(response);
		        drawCanvas()
		    },
		    error: function (response) {
		        alert(response);
		    }
		});
	}
});

/*–––––– UPDATE FONT WHEN LOADED ––––––*/

document.fonts.ready.then(function () {
	drawCanvas();
});

/*––––––––––––– FUNCTIONS –––––––––––––*/

function drawCanvas(){
	
	//High Definition Canvas
	$(canvas).attr('width', imageParams.width * window.devicePixelRatio);
	$(canvas).attr('height', imageParams.height * window.devicePixelRatio);
	$(canvas).css('width', imageParams.width);
	$(canvas).css('height', imageParams.height);
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

	/*––––––––––––––––––––––––––––––––––––––––––
		  GLOBAL (Background & Font Spec)
	––––––––––––––––––––––––––––––––––––––––––*/

	//Background Color
	imageParams.backgroundColor = $('#backgroundColor').val();
	ctx.fillStyle = imageParams.backgroundColor;
	ctx.fillRect(0,0, imageParams.width,imageParams.height);

	ctx.textBaseline = 'middle';

	/*––––––––––––––––––––––––––––––––––––––––––
	HEADER (Installation Name & Mentalista Logo)
	––––––––––––––––––––––––––––––––––––––––––*/

	//ImageHeader : Background
	var header = {
		"height":imageParams.height/10, //px
		"color":"0,0,0", //black
		"opacity":0.1
	};

	ctx.fillStyle = 'rgba('+header.color+', '+header.opacity+')';
	ctx.fillRect(0,0, imageParams.width,header.height);

	//ImageHeader : Border Bottom
	ctx.beginPath();
	ctx.moveTo(0, header.height);
	ctx.lineTo(imageParams.width, header.height);
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.lineWidth = 1;
	ctx.stroke();

	//ImageHeader : MentalistaLogo
	var cercle = new Path2D();
	//cercle.moveTo(0, 0);

	var cercleRayon = (header.height/2)-imageParams.margin;
	var cercleX = imageParams.width-cercleRayon-imageParams.margin; //Width
	var cercleY = header.height/2; //Height

	cercle.arc(cercleX, cercleY, cercleRayon, 0, 2*Math.PI);
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.fill(cercle);

	ctx.font = cercleRayon+'px Mentalista Grotesque';
	ctx.fillStyle = "#ffffff";
	ctx.textAlign = 'center';
	ctx.fillText('•', cercleX, cercleY);

	//ImageHeader : Installation Name
	var InstallationName = $('#installation').val();
	var HeaderFontSize = header.height/2;

	ctx.font = HeaderFontSize.toString()+'px Mentalista Grotesque';
	ctx.fillStyle = "#000000";
	ctx.textAlign = 'left';
	//ctx.textBaseline = 'middle';
	ctx.fillText(InstallationName, imageParams.margin, header.height/2);

	/*––––––––––––––––––––––––––––––––––––––––––
			 FOOTER (website & Hashtag)
	––––––––––––––––––––––––––––––––––––––––––*/

	//ImageFooter : website
	var mention = $('#mention').val();
	var hashtag = $('#hashtag').val();
	var footerFontSize = Math.round(imageParams.height/30);

	ctx.font = "lighter "+footerFontSize.toString()+'px Ibm Plex Sans';
	//ctx.textBaseline = 'middle';
	ctx.fillStyle = "rgba(0,0,0, 0.7)";

	var footerTextInfo = ctx.measureText(mention+" "+hashtag);
	if(footerTextInfo.width > imageParams.width-imageParams.margin*2){
		var i = 1;
		while (footerTextInfo.width > imageParams.width-imageParams.margin*2) {
			footerFontSize = Math.round(imageParams.height/30)-i;
			ctx.font = "lighter "+footerFontSize.toString()+'px Ibm Plex Sans';
			footerTextInfo = ctx.measureText(mention+" "+hashtag);
			i++;
		}
	}
	ctx.fillText(mention+" "+hashtag, imageParams.margin, imageParams.height-footerFontSize/2-imageParams.margin);

	/*––––––––––––––––––––––––––––––––––––––––––
			BODY (Event, Date & Image)
	––––––––––––––––––––––––––––––––––––––––––*/

	//Imagebody : event
	var event = $('#event').val();
	var eventFontSize = Math.round(imageParams.height/10);

	ctx.font = "500 "+eventFontSize.toString()+'px Ibm Plex Sans';
	//ctx.textBaseline = 'middle';
	ctx.fillStyle = "rgba(0,0,0, 1)";

	var textInfo = ctx.measureText(event);
	if(textInfo.width > imageParams.width-imageParams.margin*2){
		var i = 1;
		while (textInfo.width > imageParams.width-imageParams.margin*2) {
			eventFontSize = Math.round(imageParams.height/10)-i;
			ctx.font = "500 "+eventFontSize.toString()+'px Ibm Plex Sans';
			textInfo = ctx.measureText(event);
			i++;
		}
	}
	ctx.fillText(event, imageParams.margin, header.height+eventFontSize/2+imageParams.margin);

	//Imagebody : date
	var date = $('#date').val();
	var dateFontSize = Math.round(imageParams.height/20);

	ctx.font =  dateFontSize.toString()+'px Ibm Plex Sans';
	//ctx.textBaseline = 'middle';
	ctx.fillStyle = "rgba(0,0,0, 0.5)"; 

	var textInfo = ctx.measureText(date);
	if(textInfo.width > imageParams.width-imageParams.margin*2){
		var i = 1;
		while (textInfo.width > imageParams.width-imageParams.margin*2) {
			dateFontSize = Math.round(imageParams.height/20)-i;
			ctx.font = dateFontSize.toString()+'px Ibm Plex Sans';
			textInfo = ctx.measureText(date);
			i++;
		}
	}
	ctx.fillText(date, imageParams.margin, header.height+dateFontSize/2+imageParams.margin+eventFontSize);

	//Imagebody : image
	var img = new Image();
	img.crossOrigin="anonymous";

	//ctx.mozImageSmoothingEnabled = false;
	//ctx.webkitImageSmoothingEnabled = false;
	//ctx.msImageSmoothingEnabled = false;
	//ctx.imageSmoothingEnabled = false;

	img.addEventListener('load', function() {

		var imgWidth = img.naturalWidth;
		var imgHeight = img.naturalHeight;
		var finalImgWidth = imageParams.width-imageParams.margin*2;
		var finalImgHeight = imageParams.height-imageParams.margin*4-footerFontSize-header.height-eventFontSize-dateFontSize;

		ctx.save();
		roundedImage(
			imageParams.margin,
			header.height+imageParams.margin*2+eventFontSize+dateFontSize,
			finalImgWidth,
			finalImgHeight,
			10 //border-radius
		);
		ctx.clip();

		if(imgHeight*finalImgWidth/imgWidth >= finalImgHeight){
			finalImgHeight = imgHeight*finalImgWidth/imgWidth;
		} else if(imgWidth*finalImgHeight/imgHeight >= finalImgWidth){
			finalImgWidth = imgWidth*finalImgHeight/imgHeight;
		}

		ctx.drawImage(
			img,imageParams.margin,
			header.height+imageParams.margin*2+eventFontSize+dateFontSize,
			finalImgWidth,
			finalImgHeight
		);
		ctx.restore();
	}, false);
	img.src = 'img/'+$('#image').val(); // définit le chemin de la source
}

function roundedImage(x,y,width,height,radius){
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

function downloadImage(){
	//console.log("downloading canvas image…");
	var canvas = document.getElementById('generatedImage');
	canvas.toBlob(function (blob) {
		var fileName = 'image-' + Date.now() + '.png';
		var linkEl = document.createElement('a');
		var url = URL.createObjectURL(blob);
		linkEl.href = url;
		linkEl.setAttribute('download', fileName);
		linkEl.innerHTML = 'downloading...';
		linkEl.style.display = 'none';
		document.body.appendChild(linkEl);
		setTimeout(function () {
			linkEl.click();
			document.body.removeChild(linkEl);
		}, 1);
	}, 'image/png');
}