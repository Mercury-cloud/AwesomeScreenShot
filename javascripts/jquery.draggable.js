/**
 * An ultra simple draggable class
 */
jQuery.Draggable=function(m,e){var n=jQuery,h=!1;(m=this.ele=n(m))[0]._draggable&&m[0]._draggable.destroy();var p,b,v=(m[0]._draggable=this).options=n.extend({handle:"",cursor:"move",axis:"",for:"camera",onDrag:function(){return!0},beforeDrag:function(){},afterDrag:function(){}},e||{});function a(e){return h=!1,n(document).bind("mousemove",r).bind("mouseup",o),p=e.pageX,b=e.pageY,!1}function r(e){if(h||v.beforeDrag(e),!e.undraggable){h=!0;var n=parseInt(m.offset().left),a=parseInt(m.css("top")),r=e.pageX-p,o=e.pageY-b;if("y"==v.axis?r=0:"x"==v.axis&&(o=0),"camera"===v.for){var t=document.documentElement,u=m.width(),s=m.height(),d=t.offsetWidth,i=t.clientHeight,f=t.offsetLeft,g=t.offsetTop;f+d<(c=n+r)+u&&(c=f+d-u),c<f&&(c=f),g+i<(l=a+o)+s&&(l=g+i-s),l<g&&(l=g)}else var c=n+r,l=a+o;return m.css({left:c,top:l}),v.onDrag(n,a,r,o),p=e.pageX,b=e.pageY,!1}}function o(e){return n(document).unbind("mousemove",r).unbind("mouseup",o),!h||(v.afterDrag(e),!1)}v.handle=v.handle?n(v.handle,m):m,v.handle.css({cursor:v.cursor}),this.destroy=function(){v.handle.unbind("mousedown",a)},v.handle.bind("mousedown",a)};