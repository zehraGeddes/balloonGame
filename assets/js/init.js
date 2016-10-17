$(document).ready(function(){
  $(function() {
    for (var i=0; i < 100; i++) {
      $('.balloons').append("<div class='balloon balloon" + i + "'><div class='balloon-inner balloon'></div></div>");
    }
  //
    $('.balloon').click(function(e){
      $(this).remove();
      var offset = $(this).offset();

      mouse.x = e.pageX - offset.left;
      mouse.y = e.pageY - offset.top;

      for (var i = 0; i < 20; i++) {
          circles.push(new circle())
      }
      //
      // alert(e.pageX - offset.left);
      // alert(e.pageY - offset.top);
      // draw();
    });
  });


  var randomColor = function() {
    return '#' + Math.random().toString(16).slice(2, 8);
}

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
color = "#ffdbd5";

var height = window.innerHeight
var width = window.innerWidth

canvas.width = width
canvas.height = height

var mouse = {};

var circle_count = 200;
var circles = [];

var generate = function() {
    for (var i = 0; i < circle_count; i++) {
        circles.push(new circle());
    }
}

// setInterval(generate, 10000);

canvas.addEventListener('mousedown', mousePos, false);
canvas.addEventListener('touch', mousePos, false);

function mousePos(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function circle() {
    this.speed = {
        x: -2.5 + Math.random() * 5,
        y: -2.5 + Math.random() * 5
    }

    if (mouse.x && mouse.y) {
        this.location = {
            x: mouse.x,
            y: mouse.y
        };
    } else {
        this.location = {
            x: width / 2,
            y: height / 2
        };
    }

    this.accel = {
        x: -1.5 + Math.random() * 0.5,
        y: -1.5 + Math.random() * 1
    }

    this.radius = 2 + Math.random() * 1

    this.death = Math.random();
}

var draw = function() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < circles.length; i++) {
        var c = circles[i];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(c.location.x, c.location.y, c.radius, Math.PI * 2, false);
        ctx.fill();

        c.speed.x += c.accel.x;
        c.speed.y += c.accel.y;

        c.location.x += c.speed.x;
        c.location.y += c.speed.y;

        if (c.death > 0.5) {
            c.location.x = -100;
            c.location.y = -100;
        }
    }
}

setInterval(draw, 33);

canvas.addEventListener("mousedown", function() {
    for (var i = 0; i < 200; i++) {
        circles.push(new circle())
    }
});

});
