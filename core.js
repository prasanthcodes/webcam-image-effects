
const AutoDownload = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

function loadJs(url, cb) {
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');

  jsloadedflag = false;
  var loadFunction = function () {
    if (jsloadedflag) return;
    jsloadedflag = true;
    cb();
  };
  script.onload = loadFunction;
  script.onreadystatechange = loadFunction;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function downloadCanvasImage(){
var tmpimg    = canvas.toDataURL("image/png");
let today = new Date().toISOString().replaceAll(':','-').replaceAll('.','-');
filename="canvas_"+today+".png";
AutoDownload(tmpimg,filename);
}

function RefreshCanvasImage(){
if (CurrentInputType==1){
paintToCanvas(currentEffect);
}
if (CurrentInputType==2) {
paint2();
}
}

function getPixelFromImageURL(url,width,height) {
var canvas2 = document.createElement('canvas');
canvas2.style.display="none";
var ctx2=canvas2.getContext("2d");
canvas2.width = width;
canvas2.height = height;
var image = new Image();
image.src =url;
image.onload = function() {
  ctx2.drawImage(image, 0, 0, width, height);
  pixels2 = ctx2.getImageData(0, 0, width, height);
  d_im1=pixels2.data;
};
}

function getPixelFromImageURL2(url,width,height) {
var canvas2 = document.createElement('canvas');
canvas2.style.display="none";
var ctx2=canvas2.getContext("2d");
canvas2.width = width;
canvas2.height = height;
var image = new Image();
image.src =url;
image.onload = function() {
  ctx2.drawImage(image, 0, 0, width, height);
  pixels2 = ctx2.getImageData(0, 0, width, height);
  d_im1=pixels2.data;
};
}

function gaussianblur_im(pixels) {
var data = pixels.data;
var sigma=15;
len_1=data.length/4;
var data2=new Array(len_1);
var data3=new Array(len_1);
for(i=0;i<len_1;i+=1){
data2[i]=data[i*4];
}
gaussBlur_4(data2, data3, width, height, sigma);

for(i=0;i<data.length;i+=4){
data[i]=data[i+1]=data[i+2]=data3[i/4];
}
pixels.data=data;
return pixels;
}

function boxesForGauss(sigma, n) { 
// standard deviation, number of boxes{
var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
var wu = wl+2;
var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
var m = Math.round(mIdeal);
// var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );
var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
return sizes;
}

function gaussBlur_4 (scl, tcl, w, h, r) {
    var bxs = boxesForGauss(r, 3);
    boxBlur_4 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlur_4 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlur_4 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function boxBlur_4 (scl, tcl, w, h, r) {
    for(var i=0; i<scl.length; i++) tcl[i] = scl[i];
    boxBlurH_4(tcl, scl, w, h, r);
    boxBlurT_4(scl, tcl, w, h, r);
}
function boxBlurH_4 (scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i<h; i++) {
        var ti = i*w, li = ti, ri = ti+r;
        var fv = scl[ti], lv = scl[ti+w-1], val = (r+1)*fv;
        for(var j=0; j<r; j++) val += scl[ti+j];
        for(var j=0  ; j<=r ; j++) { val += scl[ri++] - fv       ;   tcl[ti++] = Math.round(val*iarr); }
        for(var j=r+1; j<w-r; j++) { val += scl[ri++] - scl[li++];   tcl[ti++] = Math.round(val*iarr); }
        for(var j=w-r; j<w  ; j++) { val += lv        - scl[li++];   tcl[ti++] = Math.round(val*iarr); }
    }
}
function boxBlurT_4 (scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i<w; i++) {
        var ti = i, li = ti, ri = ti+r*w;
        var fv = scl[ti], lv = scl[ti+w*(h-1)], val = (r+1)*fv;
        for(var j=0; j<r; j++) val += scl[ti+j*w];
        for(var j=0  ; j<=r ; j++) { val += scl[ri] - fv     ;  tcl[ti] = Math.round(val*iarr);  ri+=w; ti+=w; }
        for(var j=r+1; j<h-r; j++) { val += scl[ri] - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ri+=w; ti+=w; }
        for(var j=h-r; j<h  ; j++) { val += lv      - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ti+=w; }
    }
}

//report the mouse position on click
function clickfn_1(evt) {
    mousePos = getMousePos(video, evt);
    //alert(mousePos.x + ',' + mousePos.y);
};
function clickfn_2(evt) {
    mousePos = getMousePos(myimage, evt);
    //alert(mousePos.x + ',' + mousePos.y);
};

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function reset_all(){
CurrentInputType=0;
video.src = "";
video.controls = false;
video.srcObject = null;
video.style.display="none";
clearInterval(intervalID);
if (MediaStream!=null) MediaStream.stop();
myimage.style.display="none";
myimage.src="";
ctx.clearRect(0, 0, canvas.width, canvas.height);
video.removeEventListener('click', clickfn_1);
myimage.removeEventListener('click', clickfn_2);
}

function getFileInput() {
const file=input_1.files[0];
const fileType = file['type'];
const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
var URL = window.webkitURL || window.URL;
var url = URL.createObjectURL(file);
if (validImageTypes.includes(fileType)) {
reset_all();
CurrentInputType=2;
framecount=0;
//myimage.style.display="initial";
check_1();
myimage.src=url;
myimage.onload = function() {
paint2();
myimage.addEventListener("click", clickfn_2, false);
}
} else {
reset_all();
CurrentInputType=1;
framecount=0;
video.src = url;
video.controls = true;
check_1()
video.addEventListener('canplay', function () { paintToCanvas(currentEffect) });
video.addEventListener("click", clickfn_1, false);
video.play();
}
}

function getImageFromUser() {
var canvas2 = document.createElement('canvas');
var ctx2=canvas2.getContext("2d");
canvas2.width = width;
canvas2.height = height;

const file=InputFieldsAll[5].files[0];
var URL = window.webkitURL || window.URL;
var url = URL.createObjectURL(file);
var image = new Image();
image.src =url;
image.onload = function() {
  ctx2.drawImage(image, 0, 0, width, height);
  pixels2 = ctx2.getImageData(0, 0, width, height);
  d_im1=pixels2.data;
};
}

function paint2(){
width = myimage.width;
height = myimage.height;
canvas.width = width;
canvas.height = height;
effect_name=currentEffect.name;
ctx.drawImage(myimage, 0, 0, width, height);
let pixels = ctx.getImageData(0, 0, width, height);
pixels = currentEffect(pixels);
ctx.putImageData(pixels, 0, 0);
}

function getCamVideo(currentcam) {
framecount=0;
framecount_local=0;
navigator.mediaDevices.getUserMedia({ video: {facingMode: currentcam}, audio: false })
.then(localMediaStream => {
MediaStream=localMediaStream;
MediaStream.stop = function () {
this.getAudioTracks().forEach(function (track) {
	track.stop();
});
this.getVideoTracks().forEach(function (track) { //in case... :)
	track.stop();
});
};
video.src = "";
video.controls = false;
video.srcObject = localMediaStream;
video.play();
})
.catch(err => {
  console.error('OH OH!', err);
});
}

function paintToCanvas(effect) {
if (intervalID !== null) {
clearInterval(intervalID);
}
width=video.videoWidth;
height=video.videoHeight;
canvas.width = width;
canvas.height = height;
effect_name=effect.name;

function paintWithEffect() {
ctx.drawImage(video, 0, 0, width, height);
let pixels = ctx.getImageData(0, 0, width, height);
framecount+=1;
framecount_local+=1;
pixels = effect(pixels);
ctx.putImageData(pixels, 0, 0);
}
intervalID = setInterval(paintWithEffect, 30);
}

function StartCam(){
reset_all();
check_1();
check_2();
CurrentInputType=1;
framecount=0;
framecount_local=0;
getCamVideo(currentcam);
video.addEventListener('canplay', function () { paintToCanvas(currentEffect) });
video.addEventListener("click", clickfn_1, false);
}

function StopCam(){
reset_all();
CurrentInputType=0;
}

function check_1(){
if (element3.checked) {
video.style.display="initial";
myimage.style.display="initial";
} else {
video.style.display="none";
myimage.style.display="none";
}
}

function check_2(){
if (element4.checked) {
div_1.style.display="initial";
} else {
div_1.style.display="none";
}
}

function create_noise_data(width,height){

noisedata = new Uint8ClampedArray(width*height*4);
//rnd=Math.random();
for(var i = 0; i < noisedata.length; i += 4) {
rval=gaussianRandom(mean=0, stdev=50);
if (rval>200) rval=200;
var r=g=b=rval;
noisedata[i] = r; noisedata[i+1] = g; noisedata[i+2] = b;
}

return noisedata;
}

function apply2dfilter(pixels,kernel){
var data = pixels.data;
width = canvas.width;
height = canvas.height;
gray = new Uint8ClampedArray(data.length);
for(var i = 0; i < data.length; i += 4) {
	var avg = Math.round((data[i] + data[i+1] + data[i+2]) / 3);
	gray[i] = gray[i+1] = gray[i+2] = avg;
	gray[i+3] = 0;
}
var x1=0;
var y1=0;
var index=0;
for(var i = 0; i < gray.length; i += 4) {
index=i/4;
x1=index%width;
y1=Math.floor(index/width);

x_m1=x1-1;
y_m1=y1-1;
x_p1=x1+1;
y_p1=y1+1;
if (x_m1<0){x_m1=0}
if (y_m1<0){y_m1=0}
if (x_p1>=width){x_p1=width-1}
if (y_p1>=height){y_p1=height-1}

var box=[
gray[(y_m1*width+x_m1)*4],gray[(y_m1*width+x1)*4],gray[(y_m1*width+x_p1)*4],
gray[(y1*width+x_m1)*4],gray[i],gray[(y1*width+x_p1)*4],
gray[(y_p1*width+x_m1)*4],gray[(y_p1*width+x1)*4],gray[(y_p1*width+x_p1)*4],
];

var conv = (kernel[0] * box[0]) + (kernel[1] * box[1]) + (kernel[2] * box[2])
	+ (kernel[3] * box[3]) + (kernel[4] * box[4]) + (kernel[5] * box[5])
	+ (kernel[6] * box[6]) + (kernel[7] * box[7]) + (kernel[8] * box[8]);

grad1=Math.floor(conv);
data[i] = data[i+1] = data[i+2] = grad1;
}
pixels.data=data;
return pixels;
}

function rgbChange(pixels) {
//console.log('total:',pixels.data.length,'width:',video.videoWidth,'height:',video.videoHeight)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] / 255 * rAdd * 2;
    pixels.data[i + 1] = pixels.data[i + 1] / 255 * gAdd * 2;
    pixels.data[i + 2] = pixels.data[i + 2] / 255 * bAdd * 2;
	pixels.data[i + 3] = 255;
  }
  return pixels;
}

function rgb2gray(pixels) {
//console.log('total:',pixels.data.length,'width:',video.videoWidth,'height:',video.videoHeight)
for (let i = 0; i < pixels.data.length; i += 4) {
var gray=Math.floor(0.2989 * pixels.data[i + 0] + 0.5870 * pixels.data[i + 1] + 0.1140 * pixels.data[i + 2]);
pixels.data[i + 0] = gray;
pixels.data[i + 1] = gray;
pixels.data[i + 2] = gray;
pixels.data[i + 3] = 255;
}
return pixels;
}

findMax = a => a.reduce((res,cur) => res < cur ? cur : res ,-Infinity);
findMin = a => a.reduce((res,cur) => res > cur ? cur : res ,Infinity);

function Linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function FlatTo2dPoint(i,width,height){
var index=i/4;
x1=index%width;
y1=Math.floor(index/width);

x_m1=x1-1;
y_m1=y1-1;
x_p1=x1+1;
y_p1=y1+1;
if (x_m1<0){x_m1=0}
if (y_m1<0){y_m1=0}
if (x_p1>=width){x_p1=width-1}
if (y_p1>=height){y_p1=height-1}
return [x1,y1,x_m1,y_m1,x_p1,y_p1];
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function thermal_colormap(val){
//input is 0 to 255
var r=0;var g=0;var b=0;
if (val<=64){r=0;g=val*4-1;b=255}
if ((val>64)&&(val<=128)){r=0;g=255;b=255-((val-64)*4-1)}
if ((val>128)&&(val<=192)){r=(val-128)*4-1;g=255;b=0}
if ((val>192)&&(val<=255)){r=255;g=255-((val-192)*4-1),b=0}
return [r,g,b];
}

function PredatorThermal_colormap(val){
//input is 0 to 1,output is 0 to 255
fraction=1.0/6;
var r=0;var g=0;var b=0;
if (val<=fraction) {r=0;g=0;b=val*6*255}
if ((val>fraction)&&(val<=2*fraction)){r=0;g=(val-fraction)*6*255-1;b=210}
if ((val>2*fraction)&&(val<=3*fraction)){r=0;g=210;b=255-((val-2*fraction)*6*255-1)}
if ((val>3*fraction)&&(val<=4*fraction)){r=(val-3*fraction)*6*255-1;g=210;b=0}
if ((val>4*fraction)&&(val<=5*fraction)){r=210;g=255-((val-4*fraction)*6*255-1);b=0}
if ((val>5*fraction)&&(val<=6*fraction)){r=210;g=(val-5*fraction)*6*255;b=(val-5*fraction)*6*255}
return [r,g,b];
}

function pm3d_colormap(x){
r = Math.round(255*Math.sqrt(x)); 
g = Math.round(255*Math.pow(x,3)); 
b = Math.round(255*(Math.sin(2 * Math.PI * x)>=0?
                   Math.sin(2 * Math.PI * x) : 0 ));
return [r,g,b];
}

function ironbow_color(x2) {
//input is 0-1
var x = 433 * x2;
var R = 4.18485e-6*x*x*x - 0.00532377*x*x + 2.19321*x - 39.1125;
var G = 1.28826e-10*x*x*x*x*x-1.64251e-7*x*x*x*x+6.73208e-5*x*x*x-0.00808127*x*x+0.280643*x-1.61706;
var B = 9.48804e-12*x*x*x*x*x-1.05015e-8*x*x*x*x+4.19544e-5*x*x*x-0.0232532*x*x+3.24907*x+30.466;
return [Math.floor(Math.max(0, R)),Math.floor(Math.max(0, G)),Math.floor(Math.max(0, B))];
}

function rgb2hue(r,g,b){
var p=[r,g,b];
var h=0;
if (p[0] > p[1] && p[0] > p[2]) {
  if (p[1] > p[2]) {
    h = Math.round(255 * (p[1] - p[2]) / (p[0] - p[2]));
  }
  if (p[1] < p[2]) {
    h = 1535 - Math.round(255 * (p[2] - p[1]) / (p[0] - p[1]));
  }
  if (p[1] === p[2]) {
    h = 0;
  }
  //console.log('nh',h);
  h=Math.floor((h/1537.0)*255);
  //console.log('h',h);
  return h;
}
if (p[1] > p[0] && p[1] > p[2]) {
  if (p[0] > p[2]) {
    h = 511 - Math.round(255 * (p[0] - p[2]) / (p[1] - p[2]));
  }
  if (p[0] < p[2]) {
    h = 512 + Math.round(255 * (p[2] - p[0]) / (p[1] - p[0]));
  }
  if (p[0] === p[2]) {
    h = 512;
  }
  h=Math.floor((h/1537.0)*255);
  return h;
}
if ((p[2] > p[0]) && (p[2] > p[1])) {
  if (p[0] > p[1]) {
    h = 1024 + Math.round(255 * ((p[0] - p[1]) / (p[2] - p[1])));
  }
  if (p[0] < p[1]) {
    h= 1023 - Math.round(255 * ((p[1] - p[0]) / (p[2] - p[0])));
  }
  if (p[0] === p[1]) {
    h = 1024;
  }
  h=Math.floor((h/1537.0)*255);
  return h;
}
if (p[0] === p[1] && p[2] < p[0]) {
  h= 256;
  h=Math.floor((h/1537.0)*255);
  return h;
}
if (p[0] === p[2] && p[1] < p[0]) {
  h= 1280;
  h=Math.floor((h/1537.0)*255);
  return h;
}
if (p[2] === p[1] && p[0] < p[1]) {
  h = 768;
  h=Math.floor((h/1537.0)*255);
  return h;
}
if ((p[0] === p[1])&&(p[1] === p[2]) && p[0] < 128) {
  h= 1536;
  h=Math.floor((h/1537.0)*255);
  return h;
}
if ((p[0] === p[1])&&(p[1] === p[2]) && p[0] >= 128) {
  h= 1537;
  h=Math.floor((h/1537.0)*255);
  return h;
}
return h;
}

function rgb2_h(r,g,b){
let h=0;
r=r/255;g=g/255;b=b/255;
mx=Math.max(...[r,g,b]);
mn=Math.min(...[r,g,b]);
if ((r>g)&&(r>b)){h=(g-b)/(mx-mn)};
if ((g>r)&&(g>b)){h=2+(b-r)/(mx-mn)};
if ((b>r)&&(b>g)){h=4+(r-g)/(mx-mn)};
h=h*60;
if (h<0){h=360+h}
h=Math.floor(255*((h*60)/360));
return h;
}

function rgb2_s(r,g,b){
let s=0;
mx=Math.max(...[r,g,b]);
mn=Math.min(...[r,g,b]);
if (mx==mn){s=0} else {
s=Math.floor(((mx-mn)/mx)*255);
};
return s;
}

function rgb2_v(r,g,b){
v=Math.max(...[r,g,b]);
return v;
}

function sepia_color(r,g,b){
r2=r;g2=g;b2=b;
tr = 0.393*r + 0.769*g + 0.189*b
tg = 0.349*r + 0.686*g + 0.168*b
tb = 0.272*r + 0.534*g + 0.131*b
if (tr > 255) { r2 = 255} else {r2 = tr}
if (tg > 255) { g2 = 255} else {g2 = tg}
if (tb > 255) { b2 = 255} else {b2 = tb}
return [r2,g2,b2]
}

function HSVtoRGB(h, s, v) {
//all inputs in the range 0 to 1
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255),Math.round(g * 255),Math.round(b * 255)];
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [h,s,v]
}

function hsv2rgb(h,s,v) {
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]                            
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

function quickSort(arr, leftPos, rightPos, arrLength) {
    let initialLeftPos = leftPos;
    let initialRightPos = rightPos;
    let direction = true;
    let pivot = rightPos;
    while ((leftPos - rightPos) < 0) {
        if (direction) {
            if (arr[pivot] < arr[leftPos]) {
                quickSort.swap(arr, pivot, leftPos);
                pivot = leftPos;
                rightPos--;
                direction = !direction;
            } else
                leftPos++;
        } else {
            if (arr[pivot] <= arr[rightPos]) {
                rightPos--;
            } else {
                quickSort.swap(arr, pivot, rightPos);
                leftPos++;
                pivot = rightPos;
                direction = !direction;
            }
        }
    }
    if (pivot - 1 > initialLeftPos) {
        quickSort(arr, initialLeftPos, pivot - 1, arrLength);
    }
    if (pivot + 1 < initialRightPos) {
        quickSort(arr, pivot + 1, initialRightPos, arrLength);
    }
}

quickSort.swap = (arr, el1, el2) => {
    let swapedElem = arr[el1];
    arr[el1] = arr[el2];
    arr[el2] = swapedElem;
}

function quickSort2(array) {
    if (array.length <= 1) return array;

    let pivotIndex = Math.floor(array.length / 2);
    let pivot = array[pivotIndex];
    let less = [];
    let greater = [];

    for (let i = 0; i < array.length; i++) {
        //count++;
        if (i === pivotIndex) continue;
        if (array[i] <= pivot) { // *
            less.push(array[i]);
        } 
        if (array[i] > pivot) {
            greater.push(array[i])
        }
        
    }

    return [...quickSort2(less), pivot, ...quickSort2(greater)];
}

function gaussian_kernel(sigma,stddev,length){
center=Math.floor(length/2);
var out=[];
for (let i=0;i<length;i++){
for (let j=0;j<length;j++){
x=Math.abs(i-center)/stddev;
y=Math.abs(j-center)/stddev;
val=(1/(2*Math.PI*sigma**2))*(Math.exp(-(x**2+y**2)/(2*sigma**2)));
out[i*length+j]=val;
}}
sumval=out.reduce((a, b) => a + b, 0);
var out2 = Array(out.length);
for(var i = 0, length2 = out.length; i < length2; i++){
    out2[i] = out[i] / sumval;
}
return out2;
}

function grayscale(data) {
var gray2 = new Uint8ClampedArray(data.length);
for(var i = 0; i < data.length; i += 4) {
	var val = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
	gray2[i] = gray2[i+1] = gray2[i+2] = val;
	//gray2[i+3] = 255;
}
return gray2;
}






