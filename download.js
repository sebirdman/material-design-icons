function convertImgToBase64(url, callback, outputFormat){
	var canvas = document.createElement('CANVAS');
	var ctx = canvas.getContext('2d');
	var img = new Image;
	img.crossOrigin = 'Anonymous';
	img.onload = function(){
		canvas.height = img.height;
		canvas.width = img.width;
	  	ctx.drawImage(img,0,0);
	  	var dataURL = canvas.toDataURL(outputFormat || 'image/png');
	  	callback.call(this, dataURL);
        // Clean up
	  	canvas = null;
	};
	img.src = url;
}

var master = "./";
var begin = "http://google.github.io/material-design-icons/";
var drawables = [{n: "drawable-mdpi"},{n: "drawable-hdpi"},{n: "drawable-xhdpi"},{n: "drawable-xxhdpi"},{n: "drawable-xxxhdpi"}]
var ppi = [{p: 18},{p: 24},{p: 36},{p: 48}];
var color = [{c: "white"},{c: "black"}];
var imageArray = [];
var imagetobase = 0;
var imagebased = 0;

$(document).ready(function () {
  //$("img").each(function() {
  //    var src = $(this).attr('src');
  //    $(this).attr('src', begin + src)
  //})
  $("img").click(function() {
    $(this).parent().addClass("selected");
  })
  $("#download").click(function() {
		var zip = new JSZip();
	    $(".selected").each(function() {
	      var selectedsrc = $(this).children("img").attr("src");
	      var splits = selectedsrc.split("/");
	      var placement = splits[1];
	      var unwrapped = splits[3].substr(0, splits[3].lastIndexOf("_"));
	      for (var i = 0; i < drawables.length; i++) {
	        var item = drawables[i];
	        var img = zip.folder(item.n);
	        for (var y = 0; y < color.length; y++) {
	          var curcolor = color[y];
	          for (var z = 0; z < ppi.length; z++) {
	            var curppi = ppi[z];
	            var filename = unwrapped + "_" + curcolor.c + "_" + curppi.p + "dp.png";
	            var string = master + placement + "/" + item.n + "/" + filename;
							imagetobase = imagetobase + 1;
	            convertImgToBase64(string, function(base64Img) {
								imagebased = imagebased + 1;
								imageArray.push({"filename":filename,"base64":base64Img});
								if (imagebased == imagetobase) {
									console.log("final got");
								}
	            });
	          }
	        }
	      }
	    }).promise().done(function(){
					alert("All was done");
					console.log("last one");
					for (var k = 0; k < imageArray.length; k++) {
						var data = imageArray[k];
						console.log("image");
						img.file(data.filename, data.base64, {base64: true});
					}
					var content = zip.generate({type:"blob"});
					saveAs(content, "example.zip");
			});

  })
});
