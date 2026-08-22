;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RepoTool = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
function clamp(v,min,max){return Math.min(max,Math.max(min,v));}
function parse(input){var s=input.trim();var m;if((m=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s))){var h=m[1];if(h.length===3)h=h.replace(/./g,function(c){return c+c;});return [0,2,4].map(function(i){return parseInt(h.slice(i,i+2),16);});}if((m=/^rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)/i.exec(s)))return [clamp(+m[1],0,255),clamp(+m[2],0,255),clamp(+m[3],0,255)];if((m=/^hsl\(\s*([\d.-]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/i.exec(s)))return hslToRgb(+m[1],+m[2]/100,+m[3]/100);throw new Error('Use hex, rgb(), or hsl()');}
function hslToRgb(h,s,l){h=((h%360)+360)%360/360;if(!s)return [l*255,l*255,l*255].map(Math.round);function f(n){var k=(n+h*12)%12;return l-s*Math.min(l,1-l)*Math.max(-1,Math.min(k-3,9-k,1));}return [f(0),f(8),f(4)].map(function(v){return Math.round(v*255);});}
function rgbToHsl(rgb){var r=rgb[0]/255,g=rgb[1]/255,b=rgb[2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,h=0,l=(max+min)/2;if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}var s=d?d/(1-Math.abs(2*l-1)):0;return [h,s,l];}
function oklch(rgb){var c=rgb.map(function(v){v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});var l=.4122214708*c[0]+.5363325363*c[1]+.0514459929*c[2],m=.2119034982*c[0]+.6806995451*c[1]+.1073969566*c[2],s=.0883024619*c[0]+.2817188376*c[1]+.6299787005*c[2];l=Math.cbrt(l);m=Math.cbrt(m);s=Math.cbrt(s);var L=.2104542553*l+.793617785*m-.0040720468*s,A=1.9779984951*l-2.428592205*m+.4505937099*s,B=.0259040371*l+.7827717662*m-.808675766*s,C=Math.sqrt(A*A+B*B),H=Math.atan2(B,A)*180/Math.PI;if(H<0)H+=360;return [L,C,H];}
function convert(input){var rgb=parse(input),hsl=rgbToHsl(rgb),ok=oklch(rgb),hex='#'+rgb.map(function(v){return Math.round(v).toString(16).padStart(2,'0');}).join('');return {hex:hex,rgb:'rgb('+rgb.map(Math.round).join(', ')+')',hsl:'hsl('+hsl[0].toFixed(1)+' '+(hsl[1]*100).toFixed(1)+'% '+(hsl[2]*100).toFixed(1)+'%)',oklch:'oklch('+ok[0].toFixed(4)+' '+ok[1].toFixed(4)+' '+ok[2].toFixed(2)+')'};}
async function process(input){var result=convert(String(input||''));return{output:JSON.stringify(result,null,2),summary:result.hex+' converted'};}
  return { process: process, parse: parse, convert: convert, oklch: oklch };
});
