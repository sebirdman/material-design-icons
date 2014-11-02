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

$(document).ready(function () {
  //$("img").each(function() {
  //    var src = $(this).attr('src');
  //    $(this).attr('src', begin + src)
  //})
  $("img").click(function() {
    $(this).parent().addClass("selected");
  })
  $("#download").click(function() {
    $(".selected").each(function() {
      var selectedsrc = $(this).children("img").attr("src");
      var splits = selectedsrc.split("/");
      var placement = splits[5];
      var unwrapped = splits[7].substr(0, splits[7].lastIndexOf("_"));

      var zip = new JSZip();
      // see FileSaver.js

      for (var i = 0; i < drawables.length; i++) {
        var item = drawables[i];
        var img = zip.folder(item.n);

        for (var y = 0; y < color.length; y++) {
          var curcolor = color[y];
          for (var z = 0; z < ppi.length; z++) {
            var curppi = ppi[z];
            var filename = unwrapped + "_" + curcolor.c + "_" + curppi.p + "dp.png";
            var string = master + placement + "/" + item.n + "/" + filename;
						console.log(string);
            convertImgToBase64(string, function(base64Img){
              img.file(filename, base64Img, {base64: true});

            });
          }

        }
      }
      var content = zip.generate({type:"blob"});
      saveAs(content, "example.zip");

    })
  })
});
