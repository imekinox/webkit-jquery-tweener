$(document).ready(function(){
  new iScroll(document.getElementById('scroller'));
  $("#alpha_to").click(function(){
    $(".test").alphaTo(0,5);
  });
  $("#alpha_to_back").click(function(){
    $(".test").alphaTo(1,2);
  });
  $("#slide_to").click(function(){
    $(".test").slideTo(200,200,3);
  });
  $("#glow_to").click(function(){
    $(".test").glowTo(40,"#000",1);
  });
  $("#rotate").click(function(){
    $(".test").rotate(360,1.5, "ease-out", function(){
      $(".test").rotate(0,1.5, "ease-in");
    });
  });
  $("#rotate_x").click(function(){
    $(".test").rotateX(360,3, "linear", function(){
      $(".test").rotateX(0,3, "linear");
    });
  });
  $("#rotate_y").click(function(){
    $(".test").rotateY(360,3, "linear", function(){
      $(".test").rotateY(0,3, "linear");
    });
  });
  $("#scale").click(function(){
    $(".test").scale(1.8,2, "ease-out");
  });
  $("#scale_x").click(function(){
    $(".test").scaleX(.5,2, "ease-out");
  });
  $("#scale_y").click(function(){
    $(".test").scaleY(.5,2, "ease-out");
  });
  $("#skew").click(function(){
    $(".test").skew(45,2);
  });
  $("#skew_x").click(function(){
    $(".test").skewX(20,2);
  });
  $("#skew_y").click(function(){
    $(".test").skewY(20,2);
  });
  $("#custom").click(function(){
      $(".test").doTween({
	time: 3,
	keyframes: {
	  "0%": {
	      top: "100px",
	      transform: {
		rotateY:"25deg",
		rotateX:"45deg"
	      }
	  },
	  "50%": {
	      top: "400px",
	      transform: {
		rotateY:"360deg",
		rotateX:"0deg"
	      }
	  },
	  "100%": {
	      top: "100px",
	      transform: {
		rotateY:"25deg",
		rotateX:"45deg"
	      }
	  }
	}
      });
  });
});