
var effects1=function(){

this.is_Assets_loaded = false;
//[function name, casual name, description]
this.FnNames={

'1':['rgbOriginal','rgbOriginal',''],
'2':['rgbSplit','rgbSplit',''],
'3':['effectThermalColor','ThermalColor',''],
'4':['effectSepiaColor','SepiaColor',''],
'5':['effectNightVision','NightVision',''],
'6':['effectSpycamBlue','SpycamBlue',''],
'7':['RedBlueSplit','RedBlueShift',''],
'8':['posterize_gray','Posterize',''],
'9':['cannyedgedetection','Edgedetection',''],
'10':['gaussianblur_im','Blur',''],
'11':['InfraredVision','InfraredColor',''],
'12':['EffectEmboss','Emboss',''],
'13':['Pixelate','Pixelate',''],

};

this.set_subinputs=
function set_subinputs(){
div_1.innerHTML = "";

if (effect_name=='gaussianblur_im'){
div_1.appendChild(document.createTextNode("Sigma:"));
var inp1 = document.createElement("input");
inp1.value='3';
div_1.appendChild(inp1);
InputFieldsAll=[inp1];
}

if (effect_name=='Pixelate'){
div_1.appendChild(document.createTextNode("N Columns:"));
var inp1 = document.createElement("input");
inp1.value='100';
div_1.appendChild(inp1);
InputFieldsAll=[inp1];
}

check_2();
}


this.rgbOriginal= 
function rgbOriginal(pixels) {
//console.log('total:',pixels.data.length,'width:',video.videoWidth,'height:',video.videoHeight)
return pixels;
}

this.InfraredVision=
function InfraredVision(pixels) {
var data = pixels.data;
for(var i = 0,index=0; i < data.length; i += 4,index++) {
var gray=Math.floor(0.2989 * data[i + 0] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2]);
[r,g,b]=ironbow_color(gray/255);
data[i] = r; data[i+1] = g; data[i+2] = b;
}
pixels.data=data;
return pixels;
}

this.posterize_gray=
function posterize_gray(pixels) {
var data = pixels.data;
var mn=0;
var mx=255;
var N_segments=8;
var thvals=Linspace(mn, mx, N_segments+1)
pixels=medianfilter(pixels);
var gray=0;
for(var i = 0; i < data.length; i += 4) {
var r = data[i], g = data[i+1], b = data[i+2];
gray=Math.floor(0.2989 * r + 0.5870 * g + 0.1140 * b);
for (var j=0;j<N_segments;j++){
if ((gray>thvals[j])&&(gray<thvals[j+1])){
gray=thvals[j];
break;
}
}
data[i] = data[i+1] = data[i+2]=gray;
}
pixels.data=data;
return pixels;
}

this.rgbSplit=
function rgbSplit(pixels) {

  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150 + split] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

this.RedBlueSplit=
function RedBlueSplit(pixels) {
//console.log('total:',pixels.data.length,'width:',video.videoWidth,'height:',video.videoHeight)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 50] = pixels.data[i + 0]; // RED
    pixels.data[i + 1] = pixels.data[i + 1]; // GREEN
    pixels.data[i +50+2] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function apply2dfilter21(data,kernel){
width = canvas.width;
height = canvas.height;
//kernel = [1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9];//box blur
//kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];//edge D
//kernel = [0, -1, 0, -1, 4, -1, 0, -1, 0];//edge L
//kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge C (edge detection)
//kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];//sharpen
//kernel = [1.0/16, 2.0/16, 1.0/16, 2.0/16, 4.0/16, 2.0/16, 1.0/16, 2.0/16, 1.0/16];//gaussian blur
//kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge detection
//kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge detection
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
//if (grad1<30){out=0} else{out=255}
data[i] = data[i+1] = data[i+2] = grad1;
}
return data;
}

function medianfilter(pixels){
var data = pixels.data;
width = canvas.width;
height = canvas.height;
//kernel = [1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9,1.0/9];//box blur
//kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];//edge D
//kernel = [0, -1, 0, -1, 4, -1, 0, -1, 0];//edge L
kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge C (edge detection)
//kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];//sharpen
//kernel = [1.0/16, 2.0/16, 1.0/16, 2.0/16, 4.0/16, 2.0/16, 1.0/16, 2.0/16, 1.0/16];//gaussian blur
//kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge detection
//kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge detection
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
box=box.sort();
data[i] = data[i+1] = data[i+2] = box[4];
}
pixels.data=data;
return pixels;
}

this.cannyedgedetection=
function cannyedgedetection(pixels){
kernel_g = [1.0/16, 2.0/16, 1.0/16, 2.0/16, 4.0/16, 2.0/16, 1.0/16, 2.0/16, 1.0/16];//gaussian blur
pixels=apply2dfilter(pixels,kernel_g);
var data = pixels.data;
width = canvas.width;
height = canvas.height;

kernel_x = [1, 0, -1, 2, 0, -2, 1, 0, -1];//sobel x
kernel_y = [1, 2, 1, 0, 0, 0, -1, -2, -1];//sobel x

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

var conv_x = (kernel_x[0] * box[0]) + (kernel_x[1] * box[1]) + (kernel_x[2] * box[2])
	+ (kernel_x[3] * box[3]) + (kernel_x[4] * box[4]) + (kernel_x[5] * box[5])
	+ (kernel_x[6] * box[6]) + (kernel_x[7] * box[7]) + (kernel_x[8] * box[8]);
	
var conv_y = (kernel_y[0] * box[0]) + (kernel_y[1] * box[1]) + (kernel_y[2] * box[2])
	+ (kernel_y[3] * box[3]) + (kernel_y[4] * box[4]) + (kernel_y[5] * box[5])
	+ (kernel_y[6] * box[6]) + (kernel_y[7] * box[7]) + (kernel_y[8] * box[8]);
	
grad1=Math.floor(Math.sqrt(conv_x**2+conv_y**2));
//console.log(grad1);
if (grad1<75){out=0} else {out=255}
data[i] = data[i+1] = data[i+2] = out;
}
pixels.data=data;
return pixels;
}

this.effectThermalColor=
function effectThermalColor(pixels){
var data = pixels.data;
width = canvas.width;
height = canvas.height;
var gray = new Uint8ClampedArray(data.length/4);
for(var i = 0; i < data.length; i += 4) {
	var avg = Math.round((0.2989 *data[i] + 0.5870 *data[i+1] + 0.1140 *data[i+2]));
	gray[i/4] = avg;
	//gray[i+3] = 255;
}
var mx = findMax(gray);
var mn = findMin(gray);
for(var i = 0; i < data.length; i += 4) {
//r=data[i];
//g=data[i+1];
//b=data[i+2];
//gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
val=gray[i/4];
//val=Math.floor(255*(val-mn)/(mx-mn));
[data[i],data[i+1],data[i+2]]=thermal_colormap(val);
}
pixels.data=data;
return pixels;
}

this.effectSepiaColor= 
function effectSepiaColor(pixels){
var data = pixels.data;
for(var i = 0; i < data.length; i += 4) {
[data[i],data[i+1],data[i+2]]=sepia_color(data[i],data[i+1],data[i+2]);
}
pixels.data=data;
return pixels;
}

this.effectSpycamBlue= 
function effectSpycamBlue(pixels){
var data = pixels.data;
width = canvas.width;
height = canvas.height;

var hue=125.0/255;
var sat=240.0/255;
var pixelLength = height * width;
var verGap=4;
var verGap2=Math.floor(verGap/2)-1;
for (var index = 0, indexToFill = 3; index < pixelLength; index++, indexToFill = indexToFill + 4) {
	val=(data[indexToFill-3]+data[indexToFill-2]+data[indexToFill-1])/3.0;
	val=(Math.log10((val/255.0)+0.1)+1)/1.0413926851582251;//∵ Math.log10(1+0.1)+1=1.0413926851582251
	//val=((10**(val/255))-1)/9;
	[r,g,b]=HSVtoRGB(hue,sat,val);
	data[indexToFill-3] = r;
	data[indexToFill-2] = g;
	data[indexToFill-1] = b;
	v1=Math.floor(index/width);
	v2=v1%verGap;
	if (v2<verGap2){alpha=255-(8*v2);} else {alpha=255-(8*(verGap-1-v2)); }
	data[indexToFill] = alpha;
}
pixels.data=data;
return pixels;
}

function edgedetection2(gray){

//var data=pixels.data;
//console.log(data.length)
var out=0;
kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];//edge C (edge detection)

gray2 = new Uint8ClampedArray(gray.length);
for(var i = 0; i < gray.length; i += 4) {
[x1,y1,x_m1,y_m1,x_p1,y_p1]=FlatTo2dPoint(i,width,height);

var box=[
gray[(y_m1*width+x_m1)*4],gray[(y_m1*width+x1)*4],gray[(y_m1*width+x_p1)*4],
gray[(y1*width+x_m1)*4],gray[i],gray[(y1*width+x_p1)*4],
gray[(y_p1*width+x_m1)*4],gray[(y_p1*width+x1)*4],gray[(y_p1*width+x_p1)*4],
];

//box=box.sort();
quickSort(box, 0, 8, 9)
//	var avg = Math.round((data[i] + data[i+1] + data[i+2]) / 3);
gray2[i] = gray2[i+1] = gray2[i+2] = box[4];
gray2[i+3] = 255;
}
var x1=0;
var y1=0; 
var index=0;
//*/
data2 = new Uint8ClampedArray(gray.length);
//bin_1 = new Uint8ClampedArray(width*height);
for(var i = 0; i < gray.length; i += 4) {
/*
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
//*/

[x1,y1,x_m1,y_m1,x_p1,y_p1]=FlatTo2dPoint(i,width,height);

var box=[
gray2[(y_m1*width+x_m1)*4],gray2[(y_m1*width+x1)*4],gray2[(y_m1*width+x_p1)*4],
gray2[(y1*width+x_m1)*4],gray2[i],gray2[(y1*width+x_p1)*4],
gray2[(y_p1*width+x_m1)*4],gray2[(y_p1*width+x1)*4],gray2[(y_p1*width+x_p1)*4],
];

var conv = (kernel[0] * box[0]) + (kernel[1] * box[1]) + (kernel[2] * box[2])
	+ (kernel[3] * box[3]) + (kernel[4] * box[4]) + (kernel[5] * box[5])
	+ (kernel[6] * box[6]) + (kernel[7] * box[7]) + (kernel[8] * box[8]);

grad1=Math.floor(conv);
if (grad1<15){out=0} else{out=255}
data2[i] = data2[i+1] = data2[i+2] = out;
data2[i+3]=255;
}
//kernel_g = [1.0/16, 2.0/16, 1.0/16, 2.0/16, 4.0/16, 2.0/16, 1.0/16, 2.0/16, 1.0/16];//gaussian blur
//pixels=apply2dfilter(pixels,kernel_g);
//pixels=medianfilter(pixels,kernel_g);
//pixels.data=data;
return [data2];
}

this.effectNightVision= 
function effectNightVision(pixels){
var data = pixels.data;
width = canvas.width;
height = canvas.height;

var pixelLength = height * width;
var verGap=8;
var verGap2=Math.floor(verGap/2)-1;
var verintensity=64.0/verGap;
for (var index = 0, indexToFill = 3; index < pixelLength; index++, indexToFill = indexToFill + 4) {
val=(data[indexToFill-3]+data[indexToFill-2]+data[indexToFill-1])/3.0;
val=val*1.3;
[r,g,b]=HSVtoRGB(80.0/255,240.0/255,val/255);
data[indexToFill-3] = r;
data[indexToFill-2] = g;
data[indexToFill-1] = b;
v1=Math.floor(index/width);
v2=v1%verGap;
if (v2<verGap2){alpha=255-(verintensity*v2);} else {alpha=255-(verintensity*(verGap-1-v2)); }
data[indexToFill] = alpha;
}
pixels.data=data;
return pixels;
}

this.gaussianblur_im= 
function gaussianblur_im(pixels) {
var data = pixels.data;
//var sigma=5;
var sigma=Math.floor(InputFieldsAll[0].value);

var len_1=data.length/4;
var data2=new Array(len_1);
var data_r=new Array(len_1);
var data_g=new Array(len_1);
var data_b=new Array(len_1);

for(i=0;i<len_1;i+=1){
data2[i]=data[i*4];
}
gaussBlur_4(data2, data_r, width, height, sigma);
for(i=0;i<len_1;i+=1){
data2[i]=data[i*4+1];
}
gaussBlur_4(data2, data_g, width, height, sigma);
for(i=0;i<len_1;i+=1){
data2[i]=data[i*4+2];
}
gaussBlur_4(data2, data_b, width, height, sigma);


for(i=0;i<data.length;i+=4){
data[i]=data_r[i/4];
data[i+1]=data_g[i/4];
data[i+2]=data_b[i/4];
}
pixels.data=data;
return pixels;
}

// normalize matrix
function normalizeMatrix(m) {
    var j = 0;
    for (var i = 0; i < m.length; i++) {
        j += m[i];
    }
    for (var i = 0; i < m.length; i++) {
        m[i] /= j;
    }
    return m;
}

// convert x-y coordinates into pixel position
function convertCoordinates(x, y, w) {
    return x + (y * w);
}

// find a specified distance between two colours
function findColorDiff(dif, dest, src) {
    return dif * dest + (1 - dif) * src;
}

this.EffectEmboss= 
function EffectEmboss(pixels) {

// filter strength
var strength = 0.9;

// shifting matrix
var matrix = [-2, -1, 0, -1, 1, 1, 0, 1, 2];

var data = pixels.data;
//var bufferedData = buffImageData.data;

// normalize matrix
//matrix = normalizeMatrix(matrix);
var mSize = Math.sqrt(matrix.length);
data2 = new Uint8ClampedArray(data.length);
for(var i = 0,index=0; i < data.length; i += 4,index++) {
data2[i] = data[i], data2[i+1] = data[i+1], data2[i+2] = data[i+2];

}

    for (var i = 1; i < width - 1; i++) {
        for (var j = 1; j < height - 1; j++) {

            var sumR = sumG = sumB = 0;

            // loop through the matrix
            for (var h = 0; h < mSize; h++) {
                for (var w = 0; w < mSize; w++) {
                    var r = convertCoordinates(i + h - 1, j + w - 1, width) << 2;

                    // RGB for current pixel
                    //var currentPixel = {r: bufferedData[r],g: bufferedData[r + 1],b: bufferedData[r + 2]};
                    var currentPixel = {r: data2[r],g: data2[r + 1],b: data2[r + 2]};

                    sumR += currentPixel.r * matrix[w + h * mSize];
                    sumG += currentPixel.g * matrix[w + h * mSize];
                    sumB += currentPixel.b * matrix[w + h * mSize];
                }
            }

            var rf = convertCoordinates(i, j, width) << 2;
            data[rf] = findColorDiff(strength, sumR, data2[rf]);
            data[rf + 1] = findColorDiff(strength, sumG, data2[rf + 1]);
            data[rf + 2] = findColorDiff(strength, sumB, data2[rf + 2]);
        }
    }
	pixels.data=data;
    return pixels;
}


this.Pixelate= 
function Pixelate(pixels) {
var data = pixels.data;
//N_column_blocks=100;
var N_column_blocks=Math.floor(InputFieldsAll[0].value);


block_width=Math.floor(width/N_column_blocks);
extra_column_block=width%N_column_blocks;
N_row_blocks=Math.floor(height/block_width);
extra_row_block=height%N_row_blocks;

for(i=0;i<data.length;i+=4){
index=i/4;
x1=index%width;
y1=Math.floor(index/width);

var r=data[i],g=data[i+1],b=data[i+2];

x2=block_width*Math.floor(x1/block_width);
y2=block_width*Math.floor(y1/block_width);
flatpoint=(y2*width+x2)*4;
r=data[flatpoint];
g=data[flatpoint+1];
b=data[flatpoint+2];

data[i]=r,data[i+1]=g,data[i+2]=b;

}

pixels.data=data;
return pixels;
}

}


