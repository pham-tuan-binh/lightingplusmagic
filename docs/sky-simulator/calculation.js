function t(t,e){let a={},n=(4.0453*t-4.971)*Math.tan((4/9-t/120)*(Math.PI-2*e))-.2155*t+2.4192;Y0=40,a.Yz=n/Y0;let o=Math.pow(e,3),r=Math.pow(e,2),h=e,l=[t*t,t,1],f=[.00166*o-.00375*r+.00209*h+0,-.02903*o+.06377*r-.03202*h+.00394,.11693*o-.21196*r+.06052*h+.25886];a.xz=l[0]*f[0]+l[1]*f[1]+l[2]*f[2];let i=[.00275*o-.0061*r+.00317*h+0,-.04214*o+.0897*r-.04153*h+.00516,.15346*o-.26756*r+.0667*h+.26688];return a.yz=l[0]*i[0]+l[1]*i[1]+l[2]*i[2],a}function e(t){let e={},a={};a.A=.1787*t-1.463,a.B=-.3554*t+.4275,a.C=-.0227*t+5.3251,a.D=.1206*t-2.5771,a.E=-.067*t+.3703,e.coeffsY=a;let n={};n.A=-.0193*t-.2592,n.B=-.0665*t+8e-4,n.C=-4e-4*t+.2125,n.D=-.0641*t-.8989,n.E=-.0033*t+.0452,e.coeffsx=n;let o={};return o.A=-.0167*t-.2608,o.B=-.095*t+.0092,o.C=-.0079*t+.2102,o.D=-.0441*t-1.6537,o.E=-.0109*t+.0529,e.coeffsy=o,e}function a(t,e,a){return(1+a.A*Math.exp(a.B/Math.cos(t)))*(1+a.C*Math.exp(a.D*e)+a.E*Math.pow(Math.cos(e),2))}function n(t){return Math.max(Math.min(Math.pow(t,1/1.8),1),0)}function o(t,e,a){let o=e/a*t,r=(1-e-a)/a*t;return{r:n(3.2406*o-1.5372*t-.4986*r),g:n(-.9689*o+1.8758*t+.0415*r),b:n(.0557*o-.204*t+1.057*r)}}function r(t,e,a,n){return Math.acos(Math.sin(a)*Math.sin(t)*Math.cos(e-n)+Math.cos(a)*Math.cos(t))}function h(t){let e,a,n,o,r={r:0,g:0,b:0},h=document.createElement("canvas"),l=h.getContext&&h.getContext("2d"),f=-4,i={r:0,g:0,b:0},s=0;if(!l)return r;n=h.height=t.naturalHeight||t.offsetHeight||t.height,a=h.width=t.naturalWidth||t.offsetWidth||t.width,l.drawImage(t,0,0);try{e=l.getImageData(0,0,a,n)}catch(t){return r}for(o=e.data.length;(f+=20)<o;)++s,i.r+=e.data[f],i.g+=e.data[f+1],i.b+=e.data[f+2];return i.r=~~(i.r/s),i.g=~~(i.g/s),i.b=~~(i.b/s),i}function l(t,e,n,h,l,f){let i=r(t,e,h,l);return t=Math.min(t,Math.PI/2),o(n.Yz*a(t,i,f.coeffsY)/a(0,h,f.coeffsY),n.xz*a(t,i,f.coeffsx)/a(0,h,f.coeffsx),n.yz*a(t,i,f.coeffsy)/a(0,h,f.coeffsy))}function f(t,e,a){return"rgb("+Math.floor(255*t)+","+Math.floor(255*e)+","+Math.floor(255*a)+")"}function i(t,e,a,n,o){return(t-e)/(a-e)*(o-n)+n}function s(t){return t*(Math.PI/180)}function M(t){let e=t-new Date(t.getFullYear(),0,0);return Math.floor(e/864e5)}let c=0;onmessage=function(a){c+=.02;let n=parseFloat($("#turbidity").val()),o=s(parseFloat($("#longitude").val())),r=s(parseFloat($("#latitude").val())),u=s(15*parseFloat($("#tz_sm").val())),g=M($("#datepicker").datepicker("getDate")),d=c%24,m=Math.floor(d)+":"+Math.floor(60*(d-Math.floor(d)));$("#curtime").val(m);let b=d+.17*Math.sin(4*Math.PI*(g-80)/373)-.129*Math.sin(2*Math.PI*(g-8)/355)+12*(u-o)/Math.PI,I=.4093*Math.sin(2*Math.PI*(g-81)/368),p=Math.sin(r),x=Math.cos(r),y=Math.sin(I),z=Math.cos(I),P=Math.cos(Math.PI*b/12),v=Math.sin(Math.PI*b/12),w=Math.PI/2-Math.asin(p*y-x*z*P),C=Math.atan2(-z*v,x*y-p*z*P);zen_abs=t(n,w),coeffs_mtx=e(n);let Y=document.getElementById("sky"),D=document.getElementById("avg-color");Y.style.filter="blur(3px) saturate(200%)";let E=Y.getContext("2d"),B=Y.width,F=Y.height,_=h(Y);D.value=`rgb(${_.r},${_.g},${_.b})`,D.style.backgroundColor=`rgb(${_.r},${_.g},${_.b})`;for(let t=0;t<1;t+=.025)for(let e=0;e<1;e+=1/60){azimuth=s(i(e,0,1,-180,180)),zenith=s(i(t,0,1,0,90));let a=l(zenith,azimuth,zen_abs,w,C,coeffs_mtx);E.fillStyle=f(a.r,a.g,a.b);let n=t*F,o=e*B;E.fillRect(o,n,B/60,F/40)}},setInterval(()=>{postMessage("d")},10);