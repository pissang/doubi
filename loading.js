(function(){"use strict";var e=false;window.stopLoading=function(){if(p){document.body.removeChild(p);document.body.removeChild(t)}e=true};var t=document.createElement("canvas");var i=document.createElement("canvas");if(!t.getContext){return}var n=window.devicePixelRatio||1;var o=100;i.width=t.width=o*n;i.height=t.height=o*n;t.style.position="absolute";t.style.width=o+"px";t.style.height=o+"px";t.style.left=window.innerWidth/2-o/2+"px";t.style.top=window.innerHeight/2-o/2+"px";t.style.id="loading-canvas";document.body.appendChild(t);var a=t.getContext("2d");var l=i.getContext("2d");var d=window.requestAnimationFrame||window.msRequestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){setTimeout(e,16)};var r=0;var s=0;var c=0;var h=5;var w=o/2-h;a.scale(n,n);l.scale(n,n);function m(){if(e){return}r+=.1;s=o/2+w*Math.cos(r);c=o/2+w*Math.sin(r);l.globalCompositeOperation="copy";l.drawImage(t,0,0,o,o);a.clearRect(0,0,o,o);a.globalAlpha=.9;a.drawImage(i,0,0,o,o);a.globalAlpha=1;a.fillStyle="#ff00c7";a.beginPath();a.arc(s,c,h,0,Math.PI*2);a.fill();d(m)}var p=document.createElement("tip");p.id="loading-tip";p.style.position="absolute";p.style.width=o+"px";p.style.height=o+"px";p.style.left=window.innerWidth/2-o/2+"px";p.style.top=window.innerHeight/2-o/2+"px";p.style.textAlign="center";p.style.lineHeight=o+"px";p.style.color="white";p.innerHTML="加载中";document.body.appendChild(p);d(m)})();