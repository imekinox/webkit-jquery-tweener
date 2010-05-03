/**
 * animation kit for webkit with jQuery
 * 
 * Copyright (c) 2010 Juan Carlos del Valle (imekinox.com) <jc.ekinox@gmail.com>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details. 
 *
 * @license http://www.gnu.org/licenses/gpl.html
 * @project jquery.doTween
 */

// Main Tweening function
jQuery.fn.doTween = function(settings){
  settings = jQuery.extend({
    time: 1,
    transition: "linear",
    callback: function(){},
    keyframes: {}
  }, settings);

  this.each(function(){
    // Remove any webkit_style that wasn't deleted by callback
    $(".webkit_style").remove();
    var unique_id = Math.round(Math.random(0,1000) * 10000);
    // Generate unique style for this tween 
    var theCss = "<style id='style_" + unique_id + "' class='webkit_style'>";
    theCss += "#" + this.id + " {";
    theCss += "-webkit-animation-name: \"tweener_" + unique_id + "\";";
    theCss += "-webkit-animation-duration: " + settings.time + "s;";
    theCss += "-webkit-transition-timing-function: " + settings.transition + ";";
    theCss += "}";
    // Generate Webkit keyframes
    theCss += "@-webkit-keyframes 'tweener_" + unique_id + "' {";
    for( var key in settings.keyframes) {
	theCss += key + " { ";
	for( var attribute in settings.keyframes[key]) {
	  if(attribute == "transform") {
	    theCss += "-webkit-transform: ";
	    var tmp = "";
	    var arr_b = [];
	    var arr_a = [];
	    current_transform = $(this).css("-webkit-transform");
	    // get current transformation and order it
	    if(current_transform != "none") arr_a = current_transform.split(" ").sort();
	    for(var transform in settings.keyframes[key][attribute]) arr_b.push(transform + "(" + settings.keyframes[key][attribute][transform] + ")");
	    // If there is a setting not defined in the next frame and is part of the current transform append it to the animation (so it wont break)
	    for( var i in arr_a) {
	      var matched = false;
	      for( var j in arr_b) {
		if(arr_a[i].split("(")[0] == arr_b[j].split("(")[0]){
		    matched = true;
		}
	      }
	      if(matched == false) arr_b.push(arr_a[i]);
	    }
	    // Order transform (order between frames must match)
	    arr_b.sort();
	    for(var i in arr_b) { theCss += arr_b[i] + " "; tmp += arr_b[i] + " "; }
	    theCss += ";";
	    // Apply defined settings to object so it wont get back to previous position when animation ends
	    $(this).css("-webkit-transform",tmp);
	  } else {
	    // Apply defined settings to object so it wont get back to previous position when animation ends
	    $(this).css(attribute,settings.keyframes[key][attribute]);
	    theCss += attribute + ": " + settings.keyframes[key][attribute] + "; ";
	  }
	}
	theCss += "}"; 
    };
    theCss += "}";
    theCss += "</style>";
    // Callback execution and removing inserted style
    $(this).bind("webkitAnimationEnd", function(){
      $(this).unbind("webkitAnimationEnd");
      settings.callback();
      $("#style_"+unique_id).remove();
    });
    // Append style to the head tag
    $("head").append(theCss);
  });
}


// AlphaTo function
jQuery.fn.alphaTo = function(alpha, time, transition, callback){
  $(this).doTween({
    time: time,
    transition: transition,
    callback: callback,
    keyframes: {
      from: {
	  opacity: $(this).css("opacity")
      },
      to: {
	  opacity: alpha
      }
    }
  });
}

// SlideTo function
jQuery.fn.slideTo = function(_x, _y, time, transition, callback){
  $(this).doTween({
    time: time,
    transition: transition,
    callback: callback,
    keyframes: {
      from: {
	  top: $(this).css("top"),
	  left: $(this).css("left")
      },
      to: {
	  top: _y,
	  left: _x
      }
    }
  });
}

//BlurTo function
jQuery.fn.blurTo = function(size, color, time, transition, callback){
  $(this).doTween({
    time: time,
    transition: transition,
    callback: callback,
    keyframes: {
      from: {
	  "-webkit-box-shadow": $(this).css("-webkit-box-shadow")
      },
      to: {
	  "-webkit-box-shadow": "0px 0px " + size + "px " + color
      }
    }
  });
}

// RotateX function
jQuery.fn.rotateX = function(deg, time, transition, callback){
  $(this).doTween({
    time: time,
    transition: transition,
    callback: callback,
    keyframes: {
      from: {
	"-webkit-transform" : $(this).lastTransformOr({rotateX:"0deg"})
      },
      to: {
	transform:{
	   "rotateX" : deg + "deg"
	}
      }
    }
  });
}

jQuery.fn.rotateY = function(deg, time, transition, callback){
  $(this).doTween({
    time: time,
    transition: transition,
    callback: callback,
    keyframes: {
      from: {
	"-webkit-transform" : $(this).lastTransformOr({rotateY:"0deg"})
      },
      to: {
	transform:{
	   "rotateY" : deg + "deg"
	}
      }
    }
  });
}

// lastTransformOr sets the default from value for the transform(s) that will be used in case
// previous transformation does not has a default value for those transforms and orders them
jQuery.fn.lastTransformOr = function(arr_b){
  var new_transform = "";
  var current_transform = $(this).css("-webkit-transform");
  if(current_transform != "none"){
    var arr_a = current_transform.split(" ").sort();
    var match = false;
    for( var j in arr_b){
      for( var i in arr_a){
	   if(arr_a[i].split("(")[0] == j) match = true
      }
      if(!match) arr_a.push(j + "(" + arr_b[j] + ")");
    }
    for( var i in arr_a) new_transform += arr_a[i] + " ";
  } else {
    new_transform =  "none";
  }
  return new_transform;
}