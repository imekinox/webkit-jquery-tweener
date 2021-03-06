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
        callback: function(_this){
        },
        keyframes: {}
    }, settings);
    $(this).attr("is_tweening", true);
    this.each(function(){
        // Remove any webkit_style that wasn't deleted by callback
        
        //$(".webkit_style").remove();
        var unique_id = new Date().getTime();
        
        // Generate unique style for this tween 
        var theCss = "<style id='style_" + unique_id + "' class='webkit_style'>";
        // Generate Webkit keyframes
        theCss += "@-webkit-keyframes 'tweener_" + unique_id + "' {";
        for (var key in settings.keyframes) {
            theCss += key + " { ";
            for (var attribute in settings.keyframes[key]) {
                if (attribute == "transform") {
                    theCss += "-webkit-transform: ";
                    var tmp = "";
                    var arr_b = [];
                    var arr_a = [];
                    current_transform = $(this).css("-webkit-transform");
                    // get current transformation and order it
                    if (current_transform != "none") 
                        arr_a = current_transform.split(" ").sort();
                    for (var transform in settings.keyframes[key][attribute]) 
                        arr_b.push(transform + "(" + settings.keyframes[key][attribute][transform] + ")");
                    // If there is a setting not defined in the next frame and is part of the current transform append it to the animation (so it wont break)
                    for (var i in arr_a) {
                        var matched = false;
                        for (var j in arr_b) {
                            if (arr_a[i].split("(")[0] == arr_b[j].split("(")[0]) {
                                matched = true;
                            }
                        }
                        if (matched == false) 
                            arr_b.push(arr_a[i]);
                    }
                    // Order transform (order between frames must match)
                    arr_b.sort();
                    for (var i in arr_b) {
                        theCss += arr_b[i] + " ";
                        tmp += arr_b[i] + " ";
                    }
                    theCss += ";";
                    // Apply defined settings to object so it wont get back to previous position when animation ends
                    $(this).css("-webkit-transform", tmp);
                }
                else {
                    // Apply defined settings to object so it wont get back to previous position when animation ends
                    $(this).css(attribute, settings.keyframes[key][attribute]);
                    theCss += attribute + ": " + settings.keyframes[key][attribute] + "; ";
                }
            }
            theCss += "}";
        };
        theCss += "}";
        theCss += "</style>";
        // Callback execution and removing inserted style
        jQuery(this).bind("webkitAnimationEnd", function(event){
            $("#style_" + unique_id).remove();
            $(this).attr("is_tweening", false);
            settings.callback(this);
            this.style.removeProperty("-webkit-animation-name");
            this.style.removeProperty("-webkit-animation-duration");
            this.style.removeProperty("-webkit-transition-timing-function");
            event.stopPropagation();
            $(this).unbind("webkitAnimationEnd");
        });
        
        // Append style to the head tag
        $("head").append(theCss);
        $(this).css({
            "-webkit-animation-name": "tweener_" + unique_id,
            "-webkit-animation-duration": settings.time + "s",
            "-webkit-transition-timing-function": "'" + settings.transition + "'"
        });
    });
    return jQuery(this);
};

jQuery.fn.isTweening = function(){
    return (jQuery(this).attr("is_tweening") == "true");
};

jQuery.fn.removeAllTweens = function(){
	$(".webkit_style").remove();
};

// AlphaTo function
jQuery.fn.alphaTo = function(alpha, time, transition, callback){
	//setting proper display when changing alpha (on callback)
	var new_callback = function(_this){
		if(callback !== undefined) callback();
		$(_this).css("display", (alpha == 0)?"none":"block");
	};
	if(alpha > 0) $(this).css("display", "block");
    $(this).doTween({
        time: time,
        transition: transition,
        callback: new_callback,
        keyframes: {
            from: {
                "-webkit-transform-style": "preserve-3d",
                opacity: $(this).css("opacity")
            },
            to: {
                "-webkit-transform-style": "preserve-3d",
                opacity: alpha
            }
        }
    });
    return jQuery(this);
};

// SlideTo function
jQuery.fn.slideTo = function(_x, _y, time, transition, callback){
    $(this).doTransform({
        translateX: _x + "px",
        translateY: _y + "px"
    }, {
        translateX: "0px",
        translateY: "0px"
    }, time, transition, callback);
    return jQuery(this);
};

//GlowTo function
jQuery.fn.glowTo = function(size, color, time, transition, callback){
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
    return jQuery(this);
};

jQuery.fn.doTransform = function(transform, default_o, time, transition, callback){
    $(this).doTween({
        time: time,
        transition: transition,
        callback: callback,
        keyframes: {
            from: {
                "-webkit-transform": $(this).lastTransformOr(default_o)
            },
            to: {
                transform: transform
            }
        }
    });
    return jQuery(this);
};

// Rotate function
jQuery.fn.rotate = function(deg, time, transition, callback){
    $(this).doTransform({
        rotate: deg + "deg"
    }, {
        rotate: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// RotateX function
jQuery.fn.rotateX = function(deg, time, transition, callback){
    $(this).doTransform({
        rotateX: deg + "deg"
    }, {
        rotateX: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// RotateY function
jQuery.fn.rotateY = function(deg, time, transition, callback){
    $(this).doTransform({
        rotateY: deg + "deg"
    }, {
        rotateY: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// Scale function
jQuery.fn.scale = function(scale, time, transition, callback){
    $(this).doTransform({
        scale: scale
    }, {
        scale: 1
    }, time, transition, callback);
    return jQuery(this);
};

// ScaleX function
jQuery.fn.scaleX = function(scale, time, transition, callback){
    $(this).doTransform({
        scaleX: scale
    }, {
        scaleX: 1
    }, time, transition, callback);
    return jQuery(this);
};

// ScaleY function
jQuery.fn.scaleY = function(scale, time, transition, callback){
    $(this).doTransform({
        scaleY: scale
    }, {
        scaleY: 1
    }, time, transition, callback);
    return jQuery(this);
};

// Skew function
jQuery.fn.skew = function(deg, time, transition, callback){
    $(this).doTransform({
        skew: deg + "deg"
    }, {
        skew: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// SkewX function
jQuery.fn.skewX = function(deg, time, transition, callback){
    $(this).doTransform({
        skewX: deg + "deg"
    }, {
        skewY: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// SkewY function
jQuery.fn.skewY = function(deg, time, transition, callback){
    $(this).doTransform({
        skewX: deg + "deg"
    }, {
        skewY: "0deg"
    }, time, transition, callback);
    return jQuery(this);
};

// lastTransformOr sets the default from value for the transform(s) that will be used in case
// previous transformation does not has a default value for those transforms and orders them
jQuery.fn.lastTransformOr = function(arr_b){
    var new_transform = "";
    var current_transform = $(this).css("-webkit-transform");
    if (current_transform != "none") {
        var arr_a = current_transform.split(" ").sort();
        var match = false;
        for (var j in arr_b) {
            for (var i in arr_a) {
                if (arr_a[i].split("(")[0] == j) 
                    match = true
            }
            if (!match) 
                arr_a.push(j + "(" + arr_b[j] + ")");
        }
        arr_a.sort();
        for (var i in arr_a) 
            new_transform += arr_a[i] + " ";
    }
    else {
        new_transform = "none";
    }
    return new_transform;
};

// AlphaTo function
jQuery.fn.growX = function(_width, time, transition, callback){
    $(this).doTween({
        time: time,
        transition: transition,
        callback: callback,
        keyframes: {
            from: {
                "-webkit-transform-style": "preserve-3d",
                width: $(this).css("width")
            },
            to: {
                "-webkit-transform-style": "preserve-3d",
                width: _width
            }
        }
    });
    return jQuery(this);
};

jQuery.fn.growY = function(_height, time, transition, callback){
    $(this).doTween({
        time: time,
        transition: transition,
        callback: callback,
        keyframes: {
            from: {
                "-webkit-transform-style": "preserve-3d",
                height: $(this).css("height")
            },
            to: {
                "-webkit-transform-style": "preserve-3d",
                height: _height
            }
        }
    });
    return jQuery(this);
};
