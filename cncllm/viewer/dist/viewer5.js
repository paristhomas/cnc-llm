(()=>{var El="170",ai={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},li={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},fu=0,uc=1,pu=2;var Eh=1,Tl=2,bn=3,kn=0,Pe=1,We=2,On=0,Di=1,dc=2,fc=3,pc=4,mu=5,Kn=100,gu=101,_u=102,xu=103,yu=104,vu=200,Mu=201,bu=202,Su=203,na=204,ia=205,wu=206,Eu=207,Tu=208,Au=209,Ru=210,Cu=211,Pu=212,Iu=213,Lu=214,sa=0,ra=1,oa=2,Bi=3,aa=4,la=5,ca=6,ha=7,Th=0,Du=1,Uu=2,Bn=0,Nu=1,Fu=2,Ou=3,Al=4,Bu=5,ku=6,zu=7;var Ah=300,ki=301,zi=302,ua=303,da=304,Zr=306,gs=1e3,Qn=1001,fa=1002,Ie=1003,Hu=1004;var Bs=1005;var un=1006,Mo=1007;var ti=1008;var rn=1009,Rh=1010,Ch=1011,_s=1012,Rl=1013,ei=1014,nn=1015,Cs=1016,Cl=1017,Pl=1018,Hi=1020,Ph=35902,Ih=1021,Lh=1022,sn=1023,Dh=1024,Uh=1025,Ui=1026,Vi=1027,jr=1028,Il=1029,Kr=1030,Ll=1031;var Dl=1033,pr=33776,mr=33777,gr=33778,_r=33779,pa=35840,ma=35841,ga=35842,_a=35843,xa=36196,ya=37492,va=37496,Ma=37808,ba=37809,Sa=37810,wa=37811,Ea=37812,Ta=37813,Aa=37814,Ra=37815,Ca=37816,Pa=37817,Ia=37818,La=37819,Da=37820,Ua=37821,xr=36492,Na=36494,Fa=36495,Nh=36283,Oa=36284,Ba=36285,ka=36286;var yr=2300,za=2301,bo=2302,mc=2400,gc=2401,_c=2402;var Vu=3200,Ul=3201;var Fh=0,Gu=1,Fn="",ce="srgb",ji="srgb-linear",Jr="linear",ne="srgb";var gi=7680;var xc=519,Wu=512,Xu=513,qu=514,Oh=515,$u=516,Yu=517,Zu=518,ju=519,yc=35044;var vc="300 es",Sn=2e3,vr=2001,En=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ae=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Mc=1234567,Ni=Math.PI/180,xs=180/Math.PI;function ci(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ae[i&255]+Ae[i>>8&255]+Ae[i>>16&255]+Ae[i>>24&255]+"-"+Ae[t&255]+Ae[t>>8&255]+"-"+Ae[t>>16&15|64]+Ae[t>>24&255]+"-"+Ae[e&63|128]+Ae[e>>8&255]+"-"+Ae[e>>16&255]+Ae[e>>24&255]+Ae[n&255]+Ae[n>>8&255]+Ae[n>>16&255]+Ae[n>>24&255]).toLowerCase()}function ge(i,t,e){return Math.max(t,Math.min(e,i))}function Nl(i,t){return(i%t+t)%t}function Ku(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ju(i,t,e){return i!==t?(e-i)/(t-i):0}function us(i,t,e){return(1-e)*i+e*t}function Qu(i,t,e,n){return us(i,t,1-Math.exp(-e*n))}function td(i,t=1){return t-Math.abs(Nl(i,t*2)-t)}function ed(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function nd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function id(i,t){return i+Math.floor(Math.random()*(t-i+1))}function sd(i,t){return i+Math.random()*(t-i)}function rd(i){return i*(.5-Math.random())}function od(i){i!==void 0&&(Mc=i);let t=Mc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ad(i){return i*Ni}function ld(i){return i*xs}function cd(i){return(i&i-1)===0&&i!==0}function hd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ud(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function dd(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function De(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Bh={DEG2RAD:Ni,RAD2DEG:xs,generateUUID:ci,clamp:ge,euclideanModulo:Nl,mapLinear:Ku,inverseLerp:Ju,lerp:us,damp:Qu,pingpong:td,smoothstep:ed,smootherstep:nd,randInt:id,randFloat:sd,randFloatSpread:rd,seededRandom:od,degToRad:ad,radToDeg:ld,isPowerOfTwo:cd,ceilPowerOfTwo:hd,floorPowerOfTwo:ud,setQuaternionFromProperEuler:dd,normalize:De,denormalize:Pi},tt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Bt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],w=s[1],b=s[4],v=s[7],L=s[2],P=s[5],A=s[8];return r[0]=o*_+a*w+l*L,r[3]=o*m+a*b+l*P,r[6]=o*p+a*v+l*A,r[1]=c*_+h*w+u*L,r[4]=c*m+h*b+u*P,r[7]=c*p+h*v+u*A,r[2]=d*_+f*w+g*L,r[5]=d*m+f*b+g*P,r[8]=d*p+f*v+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*c-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(So.makeScale(t,e)),this}rotate(t){return this.premultiply(So.makeRotation(-t)),this}translate(t,e){return this.premultiply(So.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},So=new Bt;function kh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function fd(){let i=Mr("canvas");return i.style.display="block",i}var bc={};function cs(i){i in bc||(bc[i]=!0,console.warn(i))}function pd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function md(i){let t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function gd(i){let t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var Yt={enabled:!0,workingColorSpace:ji,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(i.r=wn(i.r),i.g=wn(i.g),i.b=wn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(i.r=Fi(i.r),i.g=Fi(i.g),i.b=Fi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Fn?Jr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Sc=[.64,.33,.3,.6,.15,.06],wc=[.2126,.7152,.0722],Ec=[.3127,.329],Tc=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ac=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Yt.define({[ji]:{primaries:Sc,whitePoint:Ec,transfer:Jr,toXYZ:Tc,fromXYZ:Ac,luminanceCoefficients:wc,workingColorSpaceConfig:{unpackColorSpace:ce},outputColorSpaceConfig:{drawingBufferColorSpace:ce}},[ce]:{primaries:Sc,whitePoint:Ec,transfer:ne,toXYZ:Tc,fromXYZ:Ac,luminanceCoefficients:wc,outputColorSpaceConfig:{drawingBufferColorSpace:ce}}});var _i,Ha=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{_i===void 0&&(_i=Mr("canvas")),_i.width=t.width,_i.height=t.height;let n=_i.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=_i}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Mr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},_d=0,br=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=ci(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(wo(s[o].image)):r.push(wo(s[o]))}else r=wo(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function wo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ha.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var xd=0,Fe=class i extends En{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Qn,s=Qn,r=un,o=ti,a=sn,l=rn,c=i.DEFAULT_ANISOTROPY,h=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=ci(),this.name="",this.source=new br(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ah)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case gs:t.x=t.x-Math.floor(t.x);break;case Qn:t.x=t.x<0?0:1;break;case fa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case gs:t.y=t.y-Math.floor(t.y);break;case Qn:t.y=t.y<0?0:1;break;case fa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Ah;Fe.DEFAULT_ANISOTROPY=1;var Jt=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(c+1)/2,v=(f+1)/2,L=(p+1)/2,P=(h+d)/4,A=(u+_)/4,M=(g+m)/4;return b>v&&b>L?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=P/n,r=A/n):v>L?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=P/s,r=M/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=A/r,s=M/r),this.set(n,s,r,e),this}let w=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(u-_)/w,this.z=(d-h)/w,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Va=class extends En{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Jt(0,0,t,e),this.scissorTest=!1,this.viewport=new Jt(0,0,t,e);let s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:un,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Fe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new br(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tn=class extends Va{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Sr=class extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ga=class extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ee=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a,p=l*d+c*f+h*g+u*_,w=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let L=Math.sqrt(b),P=Math.atan2(L,p*w);m=Math.sin(m*P)/L,a=Math.sin(a*P)/L}let v=a*w;if(l=l*m+d*v,c=c*m+f*v,h=h*m+g*v,u=u*m+_*v,m===1-a){let L=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=L,c*=L,h*=L,u*=L}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Eo.copy(this).projectOnVector(t),this.sub(Eo)}reflect(t){return this.sub(Eo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Eo=new R,Rc=new Ee,ni=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Je):Je.fromBufferAttribute(r,o),Je.applyMatrix4(t.matrixWorld),this.expandByPoint(Je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ks.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ks.copy(n.boundingBox)),ks.applyMatrix4(t.matrixWorld),this.union(ks)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Je),Je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(is),zs.subVectors(this.max,is),xi.subVectors(t.a,is),yi.subVectors(t.b,is),vi.subVectors(t.c,is),Pn.subVectors(yi,xi),In.subVectors(vi,yi),Wn.subVectors(xi,vi);let e=[0,-Pn.z,Pn.y,0,-In.z,In.y,0,-Wn.z,Wn.y,Pn.z,0,-Pn.x,In.z,0,-In.x,Wn.z,0,-Wn.x,-Pn.y,Pn.x,0,-In.y,In.x,0,-Wn.y,Wn.x,0];return!To(e,xi,yi,vi,zs)||(e=[1,0,0,0,1,0,0,0,1],!To(e,xi,yi,vi,zs))?!1:(Hs.crossVectors(Pn,In),e=[Hs.x,Hs.y,Hs.z],To(e,xi,yi,vi,zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},_n=[new R,new R,new R,new R,new R,new R,new R,new R],Je=new R,ks=new ni,xi=new R,yi=new R,vi=new R,Pn=new R,In=new R,Wn=new R,is=new R,zs=new R,Hs=new R,Xn=new R;function To(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Xn.fromArray(i,r);let a=s.x*Math.abs(Xn.x)+s.y*Math.abs(Xn.y)+s.z*Math.abs(Xn.z),l=t.dot(Xn),c=e.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var yd=new ni,ss=new R,Ao=new R,Gi=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):yd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ss.subVectors(t,this.center);let e=ss.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ss,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ao.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ss.copy(t.center).add(Ao)),this.expandByPoint(ss.copy(t.center).sub(Ao))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},xn=new R,Ro=new R,Vs=new R,Ln=new R,Co=new R,Gs=new R,Po=new R,ii=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xn.copy(this.origin).addScaledVector(this.direction,e),xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ro.copy(t).add(e).multiplyScalar(.5),Vs.copy(e).sub(t).normalize(),Ln.copy(this.origin).sub(Ro);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Vs),a=Ln.dot(this.direction),l=-Ln.dot(Vs),c=Ln.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ro).addScaledVector(Vs,d),f}intersectSphere(t,e){xn.subVectors(t.center,this.origin);let n=xn.dot(this.direction),s=xn.dot(xn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,xn)!==null}intersectTriangle(t,e,n,s,r){Co.subVectors(e,t),Gs.subVectors(n,t),Po.crossVectors(Co,Gs);let o=this.direction.dot(Po),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ln.subVectors(this.origin,t);let l=a*this.direction.dot(Gs.crossVectors(Ln,Gs));if(l<0)return null;let c=a*this.direction.dot(Co.cross(Ln));if(c<0||l+c>o)return null;let h=-a*Ln.dot(Po);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Xt=class i{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Mi.setFromMatrixColumn(t,0).length(),r=1/Mi.setFromMatrixColumn(t,1).length(),o=1/Mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(vd,t,Md)}lookAt(t,e,n){let s=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Dn.crossVectors(n,Ve),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Dn.crossVectors(n,Ve)),Dn.normalize(),Ws.crossVectors(Ve,Dn),s[0]=Dn.x,s[4]=Ws.x,s[8]=Ve.x,s[1]=Dn.y,s[5]=Ws.y,s[9]=Ve.y,s[2]=Dn.z,s[6]=Ws.z,s[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],w=n[3],b=n[7],v=n[11],L=n[15],P=s[0],A=s[4],M=s[8],y=s[12],x=s[1],T=s[5],F=s[9],D=s[13],U=s[2],k=s[6],z=s[10],j=s[14],V=s[3],Q=s[7],rt=s[11],ut=s[15];return r[0]=o*P+a*x+l*U+c*V,r[4]=o*A+a*T+l*k+c*Q,r[8]=o*M+a*F+l*z+c*rt,r[12]=o*y+a*D+l*j+c*ut,r[1]=h*P+u*x+d*U+f*V,r[5]=h*A+u*T+d*k+f*Q,r[9]=h*M+u*F+d*z+f*rt,r[13]=h*y+u*D+d*j+f*ut,r[2]=g*P+_*x+m*U+p*V,r[6]=g*A+_*T+m*k+p*Q,r[10]=g*M+_*F+m*z+p*rt,r[14]=g*y+_*D+m*j+p*ut,r[3]=w*P+b*x+v*U+L*V,r[7]=w*A+b*T+v*k+L*Q,r[11]=w*M+b*F+v*z+L*rt,r[15]=w*y+b*D+v*j+L*ut,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],w=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,b=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,v=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,L=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,P=e*w+n*b+s*v+r*L;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/P;return t[0]=w*A,t[1]=(_*d*r-u*m*r-_*s*f+n*m*f+u*s*p-n*d*p)*A,t[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*A,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*A,t[4]=b*A,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*A,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*A,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*A,t[8]=v*A,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*A,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*A,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*A,t[12]=L*A,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*A,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*A,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,w=l*c,b=l*h,v=l*u,L=n.x,P=n.y,A=n.z;return s[0]=(1-(_+p))*L,s[1]=(f+v)*L,s[2]=(g-b)*L,s[3]=0,s[4]=(f-v)*P,s[5]=(1-(d+p))*P,s[6]=(m+w)*P,s[7]=0,s[8]=(g+b)*A,s[9]=(m-w)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Mi.set(s[0],s[1],s[2]).length(),o=Mi.set(s[4],s[5],s[6]).length(),a=Mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Qe.copy(this);let c=1/r,h=1/o,u=1/a;return Qe.elements[0]*=c,Qe.elements[1]*=c,Qe.elements[2]*=c,Qe.elements[4]*=h,Qe.elements[5]*=h,Qe.elements[6]*=h,Qe.elements[8]*=u,Qe.elements[9]*=u,Qe.elements[10]*=u,e.setFromRotationMatrix(Qe),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Sn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),f,g;if(a===Sn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===vr)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Sn){let l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h,g,_;if(a===Sn)g=(o+r)*u,_=-2*u;else if(a===vr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Mi=new R,Qe=new Xt,vd=new R(0,0,0),Md=new R(1,1,1),Dn=new R,Ws=new R,Ve=new R,Cc=new Xt,Pc=new Ee,dn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Cc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Cc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Pc.setFromEuler(this),this.setFromQuaternion(Pc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};dn.DEFAULT_ORDER="XYZ";var ys=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},bd=0,Ic=new R,bi=new Ee,yn=new Xt,Xs=new R,rs=new R,Sd=new R,wd=new Ee,Lc=new R(1,0,0),Dc=new R(0,1,0),Uc=new R(0,0,1),Nc={type:"added"},Ed={type:"removed"},Si={type:"childadded",child:null},Io={type:"childremoved",child:null},be=class i extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bd++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new R,e=new dn,n=new Ee,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xt},normalMatrix:{value:new Bt}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ys,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.multiply(bi),this}rotateOnWorldAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.premultiply(bi),this}rotateX(t){return this.rotateOnAxis(Lc,t)}rotateY(t){return this.rotateOnAxis(Dc,t)}rotateZ(t){return this.rotateOnAxis(Uc,t)}translateOnAxis(t,e){return Ic.copy(t).applyQuaternion(this.quaternion),this.position.add(Ic.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Lc,t)}translateY(t){return this.translateOnAxis(Dc,t)}translateZ(t){return this.translateOnAxis(Uc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xs.copy(t):Xs.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(rs,Xs,this.up):yn.lookAt(Xs,rs,this.up),this.quaternion.setFromRotationMatrix(yn),s&&(yn.extractRotation(s.matrixWorld),bi.setFromRotationMatrix(yn),this.quaternion.premultiply(bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Nc),Si.child=t,this.dispatchEvent(Si),Si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ed),Io.child=t,this.dispatchEvent(Io),Io.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),yn.multiply(t.parent.matrixWorld)),t.applyMatrix4(yn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Nc),Si.child=t,this.dispatchEvent(Si),Si.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,t,Sd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,wd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};be.DEFAULT_UP=new R(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var tn=new R,vn=new R,Lo=new R,Mn=new R,wi=new R,Ei=new R,Fc=new R,Do=new R,Uo=new R,No=new R,Fo=new Jt,Oo=new Jt,Bo=new Jt,hn=class i{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),tn.subVectors(t,e),s.cross(tn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){tn.subVectors(s,e),vn.subVectors(n,e),Lo.subVectors(t,e);let o=tn.dot(tn),a=tn.dot(vn),l=tn.dot(Lo),c=vn.dot(vn),h=vn.dot(Lo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mn.x),l.addScaledVector(o,Mn.y),l.addScaledVector(a,Mn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Fo.setScalar(0),Oo.setScalar(0),Bo.setScalar(0),Fo.fromBufferAttribute(t,e),Oo.fromBufferAttribute(t,n),Bo.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Fo,r.x),o.addScaledVector(Oo,r.y),o.addScaledVector(Bo,r.z),o}static isFrontFacing(t,e,n,s){return tn.subVectors(n,e),vn.subVectors(t,e),tn.cross(vn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return tn.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),tn.cross(vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;wi.subVectors(s,n),Ei.subVectors(r,n),Do.subVectors(t,n);let l=wi.dot(Do),c=Ei.dot(Do);if(l<=0&&c<=0)return e.copy(n);Uo.subVectors(t,s);let h=wi.dot(Uo),u=Ei.dot(Uo);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(wi,o);No.subVectors(t,r);let f=wi.dot(No),g=Ei.dot(No);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ei,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Fc.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Fc,a);let p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(wi,o).addScaledVector(Ei,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},qs={h:0,s:0,l:0};function ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Nt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=Nl(t,1),e=ge(e,0,1),n=ge(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ko(o,r,t+1/3),this.g=ko(o,r,t),this.b=ko(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,s),this}setStyle(t,e=ce){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ce){let n=zh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ce){return Yt.fromWorkingColorSpace(Re.copy(this),t),Math.round(ge(Re.r*255,0,255))*65536+Math.round(ge(Re.g*255,0,255))*256+Math.round(ge(Re.b*255,0,255))}getHexString(t=ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Re.copy(this),e);let n=Re.r,s=Re.g,r=Re.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Re.copy(this),e),t.r=Re.r,t.g=Re.g,t.b=Re.b,t}getStyle(t=ce){Yt.fromWorkingColorSpace(Re.copy(this),t);let e=Re.r,n=Re.g,s=Re.b;return t!==ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(qs);let n=us(Un.h,qs.h,e),s=us(Un.s,qs.s,e),r=us(Un.l,qs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Re=new Nt;Nt.NAMES=zh;var Td=0,zn=class extends En{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=ci(),this.name="",this.blending=Di,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=na,this.blendDst=ia,this.blendEquation=Kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Bi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Di&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==na&&(n.blendSrc=this.blendSrc),this.blendDst!==ia&&(n.blendDst=this.blendDst),this.blendEquation!==Kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Bi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Xe=class extends zn{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var me=new R,$s=new tt,Kt=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yc,this.updateRanges=[],this.gpuType=nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)$s.fromBufferAttribute(this,e),$s.applyMatrix3(t),this.setXY(e,$s.x,$s.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Pi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=De(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pi(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pi(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pi(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),s=De(s,this.array),r=De(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yc&&(t.usage=this.usage),t}};var wr=class extends Kt{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Er=class extends Kt{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var pe=class extends Kt{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ad=0,$e=new Xt,zo=new be,Ti=new R,Ge=new ni,os=new ni,Me=new R,ue=class i extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kh(t)?Er:wr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Bt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return zo.lookAt(t),zo.updateMatrix(),this.applyMatrix4(zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new pe(n,3))}else{for(let n=0,s=e.count;n<s;n++){let r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ni);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ge.setFromBufferAttribute(r),this.morphTargetsRelative?(Me.addVectors(this.boundingBox.min,Ge.min),this.boundingBox.expandByPoint(Me),Me.addVectors(this.boundingBox.max,Ge.max),this.boundingBox.expandByPoint(Me)):(this.boundingBox.expandByPoint(Ge.min),this.boundingBox.expandByPoint(Ge.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let n=this.boundingSphere.center;if(Ge.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];os.setFromBufferAttribute(a),this.morphTargetsRelative?(Me.addVectors(Ge.min,os.min),Ge.expandByPoint(Me),Me.addVectors(Ge.max,os.max),Ge.expandByPoint(Me)):(Ge.expandByPoint(os.min),Ge.expandByPoint(os.max))}Ge.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Me.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Me));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Me.fromBufferAttribute(a,c),l&&(Ti.fromBufferAttribute(t,c),Me.add(Ti)),s=Math.max(s,n.distanceToSquared(Me))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let M=0;M<n.count;M++)a[M]=new R,l[M]=new R;let c=new R,h=new R,u=new R,d=new tt,f=new tt,g=new tt,_=new R,m=new R;function p(M,y,x){c.fromBufferAttribute(n,M),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,x),d.fromBufferAttribute(r,M),f.fromBufferAttribute(r,y),g.fromBufferAttribute(r,x),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let T=1/(f.x*g.y-g.x*f.y);isFinite(T)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(T),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(T),a[M].add(_),a[y].add(_),a[x].add(_),l[M].add(m),l[y].add(m),l[x].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let M=0,y=w.length;M<y;++M){let x=w[M],T=x.start,F=x.count;for(let D=T,U=T+F;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let b=new R,v=new R,L=new R,P=new R;function A(M){L.fromBufferAttribute(s,M),P.copy(L);let y=a[M];b.copy(y),b.sub(L.multiplyScalar(L.dot(y))).normalize(),v.crossVectors(P,y);let T=v.dot(l[M])<0?-1:1;o.setXYZW(M,b.x,b.y,b.z,T)}for(let M=0,y=w.length;M<y;++M){let x=w[M],T=x.start,F=x.count;for(let D=T,U=T+F;D<U;D+=3)A(t.getX(D+0)),A(t.getX(D+1)),A(t.getX(D+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Kt(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Me.fromBufferAttribute(t,e),Me.normalize(),t.setXYZ(e,Me.x,Me.y,Me.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Kt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Oc=new Xt,qn=new ii,Ys=new Gi,Bc=new R,Zs=new R,js=new R,Ks=new R,Ho=new R,Js=new R,kc=new R,Qs=new R,It=class extends be{constructor(t=new ue,e=new Xe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Js.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Ho.fromBufferAttribute(u,t),o?Js.addScaledVector(Ho,h):Js.addScaledVector(Ho.sub(e),h))}e.add(Js)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(r),qn.copy(t.ray).recast(t.near),!(Ys.containsPoint(qn.origin)===!1&&(qn.intersectSphere(Ys,Bc)===null||qn.origin.distanceToSquared(Bc)>(t.far-t.near)**2))&&(Oc.copy(r).invert(),qn.copy(t.ray).applyMatrix4(Oc),!(n.boundingBox!==null&&qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,qn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],w=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=w,L=b;v<L;v+=3){let P=a.getX(v),A=a.getX(v+1),M=a.getX(v+2);s=tr(this,p,t,n,c,h,u,P,A,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let w=a.getX(m),b=a.getX(m+1),v=a.getX(m+2);s=tr(this,o,t,n,c,h,u,w,b,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],w=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=w,L=b;v<L;v+=3){let P=v,A=v+1,M=v+2;s=tr(this,p,t,n,c,h,u,P,A,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let w=m,b=m+1,v=m+2;s=tr(this,o,t,n,c,h,u,w,b,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Rd(i,t,e,n,s,r,o,a){let l;if(t.side===Pe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===kn,a),l===null)return null;Qs.copy(a),Qs.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Qs);return c<e.near||c>e.far?null:{distance:c,point:Qs.clone(),object:i}}function tr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Zs),i.getVertexPosition(l,js),i.getVertexPosition(c,Ks);let h=Rd(i,t,e,n,Zs,js,Ks,kc);if(h){let u=new R;hn.getBarycoord(kc,Zs,js,Ks,u),s&&(h.uv=hn.getInterpolatedAttribute(s,a,l,c,u,new tt)),r&&(h.uv1=hn.getInterpolatedAttribute(r,a,l,c,u,new tt)),o&&(h.normal=hn.getInterpolatedAttribute(o,a,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new R,materialIndex:0};hn.getNormal(Zs,js,Ks,d.normal),h.face=d,h.barycoord=u}return h}var Se=class i extends ue{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(u,2));function g(_,m,p,w,b,v,L,P,A,M,y){let x=v/A,T=L/M,F=v/2,D=L/2,U=P/2,k=A+1,z=M+1,j=0,V=0,Q=new R;for(let rt=0;rt<z;rt++){let ut=rt*T-D;for(let Ut=0;Ut<k;Ut++){let Zt=Ut*x-F;Q[_]=Zt*w,Q[m]=ut*b,Q[p]=U,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[p]=P>0?1:-1,h.push(Q.x,Q.y,Q.z),u.push(Ut/A),u.push(1-rt/M),j+=1}}for(let rt=0;rt<M;rt++)for(let ut=0;ut<A;ut++){let Ut=d+ut+k*rt,Zt=d+ut+k*(rt+1),X=d+(ut+1)+k*(rt+1),nt=d+(ut+1)+k*rt;l.push(Ut,Zt,nt),l.push(Zt,X,nt),V+=6}a.addGroup(f,V,y),f+=V,d+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Wi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ue(i){let t={};for(let e=0;e<i.length;e++){let n=Wi(i[e]);for(let s in n)t[s]=n[s]}return t}function Cd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Hh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}var Pd={clone:Wi,merge:Ue},Id=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ye=class extends zn{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Id,this.fragmentShader=Ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Wi(t.uniforms),this.uniformsGroups=Cd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Tr=class extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=Sn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Nn=new R,zc=new tt,Hc=new tt,Ce=class extends Tr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=xs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ni*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(Ni*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Nn.x,Nn.y).multiplyScalar(-t/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nn.x,Nn.y).multiplyScalar(-t/Nn.z)}getViewSize(t,e){return this.getViewBounds(t,zc,Hc),e.subVectors(Hc,zc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ni*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ai=-90,Ri=1,Wa=class extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ce(Ai,Ri,t,e);s.layers=this.layers,this.add(s);let r=new Ce(Ai,Ri,t,e);r.layers=this.layers,this.add(r);let o=new Ce(Ai,Ri,t,e);o.layers=this.layers,this.add(o);let a=new Ce(Ai,Ri,t,e);a.layers=this.layers,this.add(a);let l=new Ce(Ai,Ri,t,e);l.layers=this.layers,this.add(l);let c=new Ce(Ai,Ri,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===vr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ar=class extends Fe{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ki,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Xa=class extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ar(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:un}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Se(5,5,5),r=new Ye({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:On});r.uniforms.tEquirect.value=e;let o=new It(s,r),a=e.minFilter;return e.minFilter===ti&&(e.minFilter=un),new Wa(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Vo=new R,Dd=new R,Ud=new Bt,en=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Vo.subVectors(n,e).cross(Dd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Vo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Ud.getNormalMatrix(t),s=this.coplanarPoint(Vo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},$n=new Gi,er=new R,vs=class{constructor(t=new en,e=new en,n=new en,s=new en,r=new en,o=new en){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Sn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],w=s[13],b=s[14],v=s[15];if(n[0].setComponents(l-r,d-c,m-f,v-p).normalize(),n[1].setComponents(l+r,d+c,m+f,v+p).normalize(),n[2].setComponents(l+o,d+h,m+g,v+w).normalize(),n[3].setComponents(l-o,d-h,m-g,v-w).normalize(),n[4].setComponents(l-a,d-u,m-_,v-b).normalize(),e===Sn)n[5].setComponents(l+a,d+u,m+_,v+b).normalize();else if(e===vr)n[5].setComponents(a,u,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(t){return $n.center.set(0,0,0),$n.radius=.7071067811865476,$n.applyMatrix4(t.matrixWorld),this.intersectsSphere($n)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(er.x=s.normal.x>0?t.max.x:t.min.x,er.y=s.normal.y>0?t.max.y:t.min.y,er.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(er)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Vh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Nd(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Rr=class i extends ue{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let w=p*d-o;for(let b=0;b<c;b++){let v=b*u-r;g.push(v,-w,0),_.push(0,0,1),m.push(b/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let w=0;w<a;w++){let b=w+c*p,v=w+c*(p+1),L=w+1+c*(p+1),P=w+1+c*p;f.push(b,v,P),f.push(v,L,P)}this.setIndex(f),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(_,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Fd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Od=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Gd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Xd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$d=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Kd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Jd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ef=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,of=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,af=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,df=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ff="gl_FragColor = linearToOutputTexel( gl_FragColor );",pf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,_f=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ef=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Cf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,If=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Df=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Uf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Nf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ff=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Of=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,kf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$f=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,jf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ep=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,rp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,op=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ap=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,up=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,dp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_p=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ep=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ap=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ip=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Dp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Np=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Fp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Op=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Gp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$p=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,em=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,im=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,sm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,om=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,am=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,um=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,pm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:Fd,alphahash_pars_fragment:Od,alphamap_fragment:Bd,alphamap_pars_fragment:kd,alphatest_fragment:zd,alphatest_pars_fragment:Hd,aomap_fragment:Vd,aomap_pars_fragment:Gd,batching_pars_vertex:Wd,batching_vertex:Xd,begin_vertex:qd,beginnormal_vertex:$d,bsdfs:Yd,iridescence_fragment:Zd,bumpmap_pars_fragment:jd,clipping_planes_fragment:Kd,clipping_planes_pars_fragment:Jd,clipping_planes_pars_vertex:Qd,clipping_planes_vertex:tf,color_fragment:ef,color_pars_fragment:nf,color_pars_vertex:sf,color_vertex:rf,common:of,cube_uv_reflection_fragment:af,defaultnormal_vertex:lf,displacementmap_pars_vertex:cf,displacementmap_vertex:hf,emissivemap_fragment:uf,emissivemap_pars_fragment:df,colorspace_fragment:ff,colorspace_pars_fragment:pf,envmap_fragment:mf,envmap_common_pars_fragment:gf,envmap_pars_fragment:_f,envmap_pars_vertex:xf,envmap_physical_pars_fragment:Cf,envmap_vertex:yf,fog_vertex:vf,fog_pars_vertex:Mf,fog_fragment:bf,fog_pars_fragment:Sf,gradientmap_pars_fragment:wf,lightmap_pars_fragment:Ef,lights_lambert_fragment:Tf,lights_lambert_pars_fragment:Af,lights_pars_begin:Rf,lights_toon_fragment:Pf,lights_toon_pars_fragment:If,lights_phong_fragment:Lf,lights_phong_pars_fragment:Df,lights_physical_fragment:Uf,lights_physical_pars_fragment:Nf,lights_fragment_begin:Ff,lights_fragment_maps:Of,lights_fragment_end:Bf,logdepthbuf_fragment:kf,logdepthbuf_pars_fragment:zf,logdepthbuf_pars_vertex:Hf,logdepthbuf_vertex:Vf,map_fragment:Gf,map_pars_fragment:Wf,map_particle_fragment:Xf,map_particle_pars_fragment:qf,metalnessmap_fragment:$f,metalnessmap_pars_fragment:Yf,morphinstance_vertex:Zf,morphcolor_vertex:jf,morphnormal_vertex:Kf,morphtarget_pars_vertex:Jf,morphtarget_vertex:Qf,normal_fragment_begin:tp,normal_fragment_maps:ep,normal_pars_fragment:np,normal_pars_vertex:ip,normal_vertex:sp,normalmap_pars_fragment:rp,clearcoat_normal_fragment_begin:op,clearcoat_normal_fragment_maps:ap,clearcoat_pars_fragment:lp,iridescence_pars_fragment:cp,opaque_fragment:hp,packing:up,premultiplied_alpha_fragment:dp,project_vertex:fp,dithering_fragment:pp,dithering_pars_fragment:mp,roughnessmap_fragment:gp,roughnessmap_pars_fragment:_p,shadowmap_pars_fragment:xp,shadowmap_pars_vertex:yp,shadowmap_vertex:vp,shadowmask_pars_fragment:Mp,skinbase_vertex:bp,skinning_pars_vertex:Sp,skinning_vertex:wp,skinnormal_vertex:Ep,specularmap_fragment:Tp,specularmap_pars_fragment:Ap,tonemapping_fragment:Rp,tonemapping_pars_fragment:Cp,transmission_fragment:Pp,transmission_pars_fragment:Ip,uv_pars_fragment:Lp,uv_pars_vertex:Dp,uv_vertex:Up,worldpos_vertex:Np,background_vert:Fp,background_frag:Op,backgroundCube_vert:Bp,backgroundCube_frag:kp,cube_vert:zp,cube_frag:Hp,depth_vert:Vp,depth_frag:Gp,distanceRGBA_vert:Wp,distanceRGBA_frag:Xp,equirect_vert:qp,equirect_frag:$p,linedashed_vert:Yp,linedashed_frag:Zp,meshbasic_vert:jp,meshbasic_frag:Kp,meshlambert_vert:Jp,meshlambert_frag:Qp,meshmatcap_vert:tm,meshmatcap_frag:em,meshnormal_vert:nm,meshnormal_frag:im,meshphong_vert:sm,meshphong_frag:rm,meshphysical_vert:om,meshphysical_frag:am,meshtoon_vert:lm,meshtoon_frag:cm,points_vert:hm,points_frag:um,shadow_vert:dm,shadow_frag:fm,sprite_vert:pm,sprite_frag:mm},ct={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},cn={basic:{uniforms:Ue([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Ue([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Ue([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Ue([ct.common,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.roughnessmap,ct.metalnessmap,ct.fog,ct.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Ue([ct.common,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.gradientmap,ct.fog,ct.lights,{emissive:{value:new Nt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Ue([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Ue([ct.points,ct.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Ue([ct.common,ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Ue([ct.common,ct.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Ue([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Ue([ct.sprite,ct.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:Ue([ct.common,ct.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:Ue([ct.lights,ct.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};cn.physical={uniforms:Ue([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var nr={r:0,b:0,g:0},Yn=new dn,gm=new Xt;function _m(i,t,e,n,s,r,o){let a=new Nt(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(w){let b=w.isScene===!0?w.background:null;return b&&b.isTexture&&(b=(w.backgroundBlurriness>0?e:t).get(b)),b}function _(w){let b=!1,v=g(w);v===null?p(a,l):v&&v.isColor&&(p(v,1),b=!0);let L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,b){let v=g(b);v&&(v.isCubeTexture||v.mapping===Zr)?(h===void 0&&(h=new It(new Se(1,1,1),new Ye({name:"BackgroundCubeMaterial",uniforms:Wi(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,P,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Yn.copy(b.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(gm.makeRotationFromEuler(Yn)),h.material.toneMapped=Yt.getTransfer(v.colorSpace)!==ne,(u!==v||d!==v.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new It(new Rr(2,2),new Ye({name:"BackgroundMaterial",uniforms:Wi(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(v.colorSpace)!==ne,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=i.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function p(w,b){w.getRGB(nr,Hh(i)),n.buffers.color.setClear(nr.r,nr.g,nr.b,b,o)}return{getClearColor:function(){return a},setClearColor:function(w,b=1){a.set(w),l=b,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,p(a,l)},render:_,addToRenderList:m}}function xm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(x,T,F,D,U){let k=!1,z=u(D,F,T);r!==z&&(r=z,c(r.object)),k=f(x,D,F,U),k&&g(x,D,F,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,v(x,T,F,D),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function h(x){return i.deleteVertexArray(x)}function u(x,T,F){let D=F.wireframe===!0,U=n[x.id];U===void 0&&(U={},n[x.id]=U);let k=U[T.id];k===void 0&&(k={},U[T.id]=k);let z=k[D];return z===void 0&&(z=d(l()),k[D]=z),z}function d(x){let T=[],F=[],D=[];for(let U=0;U<e;U++)T[U]=0,F[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:F,attributeDivisors:D,object:x,attributes:{},index:null}}function f(x,T,F,D){let U=r.attributes,k=T.attributes,z=0,j=F.getAttributes();for(let V in j)if(j[V].location>=0){let rt=U[V],ut=k[V];if(ut===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ut=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ut=x.instanceColor)),rt===void 0||rt.attribute!==ut||ut&&rt.data!==ut.data)return!0;z++}return r.attributesNum!==z||r.index!==D}function g(x,T,F,D){let U={},k=T.attributes,z=0,j=F.getAttributes();for(let V in j)if(j[V].location>=0){let rt=k[V];rt===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(rt=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(rt=x.instanceColor));let ut={};ut.attribute=rt,rt&&rt.data&&(ut.data=rt.data),U[V]=ut,z++}r.attributes=U,r.attributesNum=z,r.index=D}function _(){let x=r.newAttributes;for(let T=0,F=x.length;T<F;T++)x[T]=0}function m(x){p(x,0)}function p(x,T){let F=r.newAttributes,D=r.enabledAttributes,U=r.attributeDivisors;F[x]=1,D[x]===0&&(i.enableVertexAttribArray(x),D[x]=1),U[x]!==T&&(i.vertexAttribDivisor(x,T),U[x]=T)}function w(){let x=r.newAttributes,T=r.enabledAttributes;for(let F=0,D=T.length;F<D;F++)T[F]!==x[F]&&(i.disableVertexAttribArray(F),T[F]=0)}function b(x,T,F,D,U,k,z){z===!0?i.vertexAttribIPointer(x,T,F,U,k):i.vertexAttribPointer(x,T,F,D,U,k)}function v(x,T,F,D){_();let U=D.attributes,k=F.getAttributes(),z=T.defaultAttributeValues;for(let j in k){let V=k[j];if(V.location>=0){let Q=U[j];if(Q===void 0&&(j==="instanceMatrix"&&x.instanceMatrix&&(Q=x.instanceMatrix),j==="instanceColor"&&x.instanceColor&&(Q=x.instanceColor)),Q!==void 0){let rt=Q.normalized,ut=Q.itemSize,Ut=t.get(Q);if(Ut===void 0)continue;let Zt=Ut.buffer,X=Ut.type,nt=Ut.bytesPerElement,gt=X===i.INT||X===i.UNSIGNED_INT||Q.gpuType===Rl;if(Q.isInterleavedBufferAttribute){let at=Q.data,Rt=at.stride,Tt=Q.offset;if(at.isInstancedInterleavedBuffer){for(let Pt=0;Pt<V.locationSize;Pt++)p(V.location+Pt,at.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Pt=0;Pt<V.locationSize;Pt++)m(V.location+Pt);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let Pt=0;Pt<V.locationSize;Pt++)b(V.location+Pt,ut/V.locationSize,X,rt,Rt*nt,(Tt+ut/V.locationSize*Pt)*nt,gt)}else{if(Q.isInstancedBufferAttribute){for(let at=0;at<V.locationSize;at++)p(V.location+at,Q.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let at=0;at<V.locationSize;at++)m(V.location+at);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let at=0;at<V.locationSize;at++)b(V.location+at,ut/V.locationSize,X,rt,ut*nt,ut/V.locationSize*at*nt,gt)}}else if(z!==void 0){let rt=z[j];if(rt!==void 0)switch(rt.length){case 2:i.vertexAttrib2fv(V.location,rt);break;case 3:i.vertexAttrib3fv(V.location,rt);break;case 4:i.vertexAttrib4fv(V.location,rt);break;default:i.vertexAttrib1fv(V.location,rt)}}}}w()}function L(){M();for(let x in n){let T=n[x];for(let F in T){let D=T[F];for(let U in D)h(D[U].object),delete D[U];delete T[F]}delete n[x]}}function P(x){if(n[x.id]===void 0)return;let T=n[x.id];for(let F in T){let D=T[F];for(let U in D)h(D[U].object),delete D[U];delete T[F]}delete n[x.id]}function A(x){for(let T in n){let F=n[T];if(F[x.id]===void 0)continue;let D=F[x.id];for(let U in D)h(D[U].object),delete D[U];delete F[x.id]}}function M(){y(),o=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:M,resetDefaultState:y,dispose:L,releaseStatesOfGeometry:P,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:w}}function ym(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function vm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==sn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let M=A===Cs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==rn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==nn&&!M)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,P=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:L,maxSamples:P}}function Mm(i){let t=this,e=null,n=0,s=!1,r=!1,o=new en,a=new Bt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let w=r?0:n,b=w*4,v=p.clippingState||null;l.value=v,v=h(g,d,b,f);for(let L=0;L!==b;++L)v[L]=e[L];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,w=d.matrixWorldInverse;a.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,v=f;b!==_;++b,v+=4)o.copy(u[b]).applyMatrix4(w,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function bm(i){let t=new WeakMap;function e(o,a){return a===ua?o.mapping=ki:a===da&&(o.mapping=zi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ua||a===da)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Xa(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Cr=class extends Tr{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ii=4,Vc=[.125,.215,.35,.446,.526,.582],Jn=20,Go=new Cr,Gc=new Nt,Wo=null,Xo=0,qo=0,$o=!1,jn=(1+Math.sqrt(5))/2,Ci=1/jn,Wc=[new R(-jn,Ci,0),new R(jn,Ci,0),new R(-Ci,0,jn),new R(Ci,0,jn),new R(0,jn,-Ci),new R(0,jn,Ci),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Xi=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Wo=this._renderer.getRenderTarget(),Xo=this._renderer.getActiveCubeFace(),qo=this._renderer.getActiveMipmapLevel(),$o=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$c(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Wo,Xo,qo),this._renderer.xr.enabled=$o,t.scissorTest=!1,ir(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ki||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Wo=this._renderer.getRenderTarget(),Xo=this._renderer.getActiveCubeFace(),qo=this._renderer.getActiveMipmapLevel(),$o=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:un,minFilter:un,generateMipmaps:!1,type:Cs,format:sn,colorSpace:ji,depthBuffer:!1},s=Xc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xc(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Sm(r)),this._blurMaterial=wm(r,t,e)}return s}_compileMaterial(t){let e=new It(this._lodPlanes[0],t);this._renderer.compile(e,Go)}_sceneToCubeUV(t,e,n,s){let a=new Ce(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Gc),h.toneMapping=Bn,h.autoClear=!1;let f=new Xe({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new It(new Se,f),_=!1,m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Gc),_=!0);for(let p=0;p<6;p++){let w=p%3;w===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):w===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let b=this._cubeSize;ir(s,w*b,p>2?b:0,b,b),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ki||t.mapping===zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$c()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=qc());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new It(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;ir(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Go)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Wc[(s-r-1)%Wc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new It(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Jn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Jn;m>Jn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Jn}`);let p=[],w=0;for(let A=0;A<Jn;++A){let M=A/_,y=Math.exp(-M*M/2);p.push(y),A===0?w+=y:A<m&&(w+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;let v=this._sizeLods[s],L=3*v*(s>b-Ii?s-b+Ii:0),P=4*(this._cubeSize-v);ir(e,L,P,3*v,2*v),l.setRenderTarget(e),l.render(u,Go)}};function Sm(i){let t=[],e=[],n=[],s=i,r=i-Ii+1+Vc.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ii?l=Vc[o-i+Ii-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,w=new Float32Array(_*g*f),b=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let P=0;P<f;P++){let A=P%3*2/3-1,M=P>2?0:-1,y=[A,M,0,A+2/3,M,0,A+2/3,M+1,0,A,M,0,A+2/3,M+1,0,A,M+1,0];w.set(y,_*g*P),b.set(d,m*g*P);let x=[P,P,P,P,P,P];v.set(x,p*g*P)}let L=new ue;L.setAttribute("position",new Kt(w,_)),L.setAttribute("uv",new Kt(b,m)),L.setAttribute("faceIndex",new Kt(v,p)),t.push(L),s>Ii&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Xc(i,t,e){let n=new Tn(i,t,e);return n.texture.mapping=Zr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ir(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function wm(i,t,e){let n=new Float32Array(Jn),s=new R(0,1,0);return new Ye({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function qc(){return new Ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function $c(){return new Ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Fl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Em(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===ua||l===da,h=l===ki||l===zi;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Xi(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Xi(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Tm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&cs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Am(i,t,e,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,g=u.attributes.position,_=0;if(f!==null){let w=f.array;_=f.version;for(let b=0,v=w.length;b<v;b+=3){let L=w[b+0],P=w[b+1],A=w[b+2];d.push(L,P,P,A,A,L)}}else if(g!==void 0){let w=g.array;_=g.version;for(let b=0,v=w.length/3-1;b<v;b+=3){let L=b+0,P=b+1,A=b+2;d.push(L,P,P,A,A,L)}}else return;let m=new(kh(d)?Er:wr)(d,1);m.version=_;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Rm(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let w=0;w<g;w++)p+=f[w]*_[w];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Cm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Pm(i,t,e){let n=new WeakMap,s=new Jt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let y=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],w=a.morphAttributes.color||[],b=0;f===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let v=a.attributes.position.count*b,L=1;v>t.maxTextureSize&&(L=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let P=new Float32Array(v*L*4*u),A=new Sr(P,v,L,u);A.type=nn,A.needsUpdate=!0;let M=b*4;for(let x=0;x<u;x++){let T=m[x],F=p[x],D=w[x],U=v*L*4*x;for(let k=0;k<T.count;k++){let z=k*M;f===!0&&(s.fromBufferAttribute(T,k),P[U+z+0]=s.x,P[U+z+1]=s.y,P[U+z+2]=s.z,P[U+z+3]=0),g===!0&&(s.fromBufferAttribute(F,k),P[U+z+4]=s.x,P[U+z+5]=s.y,P[U+z+6]=s.z,P[U+z+7]=0),_===!0&&(s.fromBufferAttribute(D,k),P[U+z+8]=s.x,P[U+z+9]=s.y,P[U+z+10]=s.z,P[U+z+11]=D.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new tt(v,L)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Im(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Pr=class extends Fe{constructor(t,e,n,s,r,o,a,l,c,h=Ui){if(h!==Ui&&h!==Vi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ui&&(n=ei),n===void 0&&h===Vi&&(n=Hi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ie,this.minFilter=l!==void 0?l:Ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Gh=new Fe,Yc=new Pr(1,1),Wh=new Sr,Xh=new Ga,qh=new Ar,Zc=[],jc=[],Kc=new Float32Array(16),Jc=new Float32Array(9),Qc=new Float32Array(4);function Ki(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Zc[s];if(r===void 0&&(r=new Float32Array(s),Zc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Qr(i,t){let e=jc[t];e===void 0&&(e=new Int32Array(t),jc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Lm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Dm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function Um(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function Nm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function Fm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Qc.set(n),i.uniformMatrix2fv(this.addr,!1,Qc),xe(e,n)}}function Om(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Jc.set(n),i.uniformMatrix3fv(this.addr,!1,Jc),xe(e,n)}}function Bm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Kc.set(n),i.uniformMatrix4fv(this.addr,!1,Kc),xe(e,n)}}function km(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function zm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function Hm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function Vm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function Gm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Wm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function Xm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function qm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function $m(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Yc.compareFunction=Oh,r=Yc):r=Gh,e.setTexture2D(t||r,s)}function Ym(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Xh,s)}function Zm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||qh,s)}function jm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Wh,s)}function Km(i){switch(i){case 5126:return Lm;case 35664:return Dm;case 35665:return Um;case 35666:return Nm;case 35674:return Fm;case 35675:return Om;case 35676:return Bm;case 5124:case 35670:return km;case 35667:case 35671:return zm;case 35668:case 35672:return Hm;case 35669:case 35673:return Vm;case 5125:return Gm;case 36294:return Wm;case 36295:return Xm;case 36296:return qm;case 35678:case 36198:case 36298:case 36306:case 35682:return $m;case 35679:case 36299:case 36307:return Ym;case 35680:case 36300:case 36308:case 36293:return Zm;case 36289:case 36303:case 36311:case 36292:return jm}}function Jm(i,t){i.uniform1fv(this.addr,t)}function Qm(i,t){let e=Ki(t,this.size,2);i.uniform2fv(this.addr,e)}function tg(i,t){let e=Ki(t,this.size,3);i.uniform3fv(this.addr,e)}function eg(i,t){let e=Ki(t,this.size,4);i.uniform4fv(this.addr,e)}function ng(i,t){let e=Ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ig(i,t){let e=Ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function sg(i,t){let e=Ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function rg(i,t){i.uniform1iv(this.addr,t)}function og(i,t){i.uniform2iv(this.addr,t)}function ag(i,t){i.uniform3iv(this.addr,t)}function lg(i,t){i.uniform4iv(this.addr,t)}function cg(i,t){i.uniform1uiv(this.addr,t)}function hg(i,t){i.uniform2uiv(this.addr,t)}function ug(i,t){i.uniform3uiv(this.addr,t)}function dg(i,t){i.uniform4uiv(this.addr,t)}function fg(i,t,e){let n=this.cache,s=t.length,r=Qr(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Gh,r[o])}function pg(i,t,e){let n=this.cache,s=t.length,r=Qr(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Xh,r[o])}function mg(i,t,e){let n=this.cache,s=t.length,r=Qr(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||qh,r[o])}function gg(i,t,e){let n=this.cache,s=t.length,r=Qr(e,s);_e(n,r)||(i.uniform1iv(this.addr,r),xe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Wh,r[o])}function _g(i){switch(i){case 5126:return Jm;case 35664:return Qm;case 35665:return tg;case 35666:return eg;case 35674:return ng;case 35675:return ig;case 35676:return sg;case 5124:case 35670:return rg;case 35667:case 35671:return og;case 35668:case 35672:return ag;case 35669:case 35673:return lg;case 5125:return cg;case 36294:return hg;case 36295:return ug;case 36296:return dg;case 35678:case 36198:case 36298:case 36306:case 35682:return fg;case 35679:case 36299:case 36307:return pg;case 35680:case 36300:case 36308:case 36293:return mg;case 36289:case 36303:case 36311:case 36292:return gg}}var qa=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Km(e.type)}},$a=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=_g(e.type)}},Ya=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Yo=/(\w+)(\])?(\[|\.)?/g;function th(i,t){i.seq.push(t),i.map[t.id]=t}function xg(i,t,e){let n=i.name,s=n.length;for(Yo.lastIndex=0;;){let r=Yo.exec(n),o=Yo.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){th(e,c===void 0?new qa(a,i,t):new $a(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Ya(a),th(e,u)),e=u}}}var Oi=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);xg(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function eh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var yg=37297,vg=0;function Mg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var nh=new Bt;function bg(i){Yt._getMatrix(nh,Yt.workingColorSpace,i);let t=`mat3( ${nh.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(i)){case Jr:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ih(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Mg(i.getShaderSource(t),o)}else return s}function Sg(i,t){let e=bg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function wg(i,t){let e;switch(t){case Nu:e="Linear";break;case Fu:e="Reinhard";break;case Ou:e="Cineon";break;case Al:e="ACESFilmic";break;case ku:e="AgX";break;case zu:e="Neutral";break;case Bu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var sr=new R;function Eg(){Yt.getLuminanceCoefficients(sr);let i=sr.x.toFixed(4),t=sr.y.toFixed(4),e=sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hs).join(`
`)}function Ag(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Rg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function hs(i){return i!==""}function sh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Cg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Za(i){return i.replace(Cg,Ig)}var Pg=new Map;function Ig(i,t){let e=Vt[t];if(e===void 0){let n=Pg.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Za(e)}var Lg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oh(i){return i.replace(Lg,Dg)}function Dg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ah(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Ug(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Eh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Tl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bn&&(t="SHADOWMAP_TYPE_VSM"),t}function Ng(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ki:case zi:t="ENVMAP_TYPE_CUBE";break;case Zr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Fg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case zi:t="ENVMAP_MODE_REFRACTION";break}return t}function Og(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Th:t="ENVMAP_BLENDING_MULTIPLY";break;case Du:t="ENVMAP_BLENDING_MIX";break;case Uu:t="ENVMAP_BLENDING_ADD";break}return t}function Bg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function kg(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Ug(e),c=Ng(e),h=Fg(e),u=Og(e),d=Bg(e),f=Tg(e),g=Ag(r),_=s.createProgram(),m,p,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(hs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(hs).join(`
`),p.length>0&&(p+=`
`)):(m=[ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hs).join(`
`),p=[ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Bn?"#define TONE_MAPPING":"",e.toneMapping!==Bn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Bn?wg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Sg("linearToOutputTexel",e.outputColorSpace),Eg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(hs).join(`
`)),o=Za(o),o=sh(o,e),o=rh(o,e),a=Za(a),a=sh(a,e),a=rh(a,e),o=oh(o),a=oh(a),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===vc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===vc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=w+m+o,v=w+p+a,L=eh(s,s.VERTEX_SHADER,b),P=eh(s,s.FRAGMENT_SHADER,v);s.attachShader(_,L),s.attachShader(_,P),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(T){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(_).trim(),D=s.getShaderInfoLog(L).trim(),U=s.getShaderInfoLog(P).trim(),k=!0,z=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,P);else{let j=ih(s,L,"vertex"),V=ih(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+F+`
`+j+`
`+V)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(D===""||U==="")&&(z=!1);z&&(T.diagnostics={runnable:k,programLog:F,vertexShader:{log:D,prefix:m},fragmentShader:{log:U,prefix:p}})}s.deleteShader(L),s.deleteShader(P),M=new Oi(s,_),y=Rg(s,_)}let M;this.getUniforms=function(){return M===void 0&&A(this),M};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,yg)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=P,this}var zg=0,ja=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Ka(t),e.set(t,n)),n}},Ka=class{constructor(t){this.id=zg++,this.code=t,this.usedTimes=0}};function Hg(i,t,e,n,s,r,o){let a=new ys,l=new ja,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,x,T,F,D){let U=F.fog,k=D.geometry,z=y.isMeshStandardMaterial?F.environment:null,j=(y.isMeshStandardMaterial?e:t).get(y.envMap||z),V=j&&j.mapping===Zr?j.image.height:null,Q=g[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));let rt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ut=rt!==void 0?rt.length:0,Ut=0;k.morphAttributes.position!==void 0&&(Ut=1),k.morphAttributes.normal!==void 0&&(Ut=2),k.morphAttributes.color!==void 0&&(Ut=3);let Zt,X,nt,gt;if(Q){let ee=cn[Q];Zt=ee.vertexShader,X=ee.fragmentShader}else Zt=y.vertexShader,X=y.fragmentShader,l.update(y),nt=l.getVertexShaderID(y),gt=l.getFragmentShaderID(y);let at=i.getRenderTarget(),Rt=i.state.buffers.depth.getReversed(),Tt=D.isInstancedMesh===!0,Pt=D.isBatchedMesh===!0,Gt=!!y.map,Z=!!y.matcap,it=!!j,I=!!y.aoMap,At=!!y.lightMap,et=!!y.bumpMap,yt=!!y.normalMap,lt=!!y.displacementMap,Lt=!!y.emissiveMap,_t=!!y.metalnessMap,C=!!y.roughnessMap,S=y.anisotropy>0,H=y.clearcoat>0,$=y.dispersion>0,J=y.iridescence>0,Y=y.sheen>0,bt=y.transmission>0,ht=S&&!!y.anisotropyMap,xt=H&&!!y.clearcoatMap,Wt=H&&!!y.clearcoatNormalMap,st=H&&!!y.clearcoatRoughnessMap,vt=J&&!!y.iridescenceMap,Dt=J&&!!y.iridescenceThicknessMap,Ft=Y&&!!y.sheenColorMap,Mt=Y&&!!y.sheenRoughnessMap,qt=!!y.specularMap,Ht=!!y.specularColorMap,se=!!y.specularIntensityMap,N=bt&&!!y.transmissionMap,dt=bt&&!!y.thicknessMap,q=!!y.gradientMap,K=!!y.alphaMap,mt=y.alphaTest>0,ft=!!y.alphaHash,kt=!!y.extensions,fe=Bn;y.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(fe=i.toneMapping);let Te={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:Zt,fragmentShader:X,defines:y.defines,customVertexShaderID:nt,customFragmentShaderID:gt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Pt,batchingColor:Pt&&D._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&D.instanceColor!==null,instancingMorph:Tt&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ji,alphaToCoverage:!!y.alphaToCoverage,map:Gt,matcap:Z,envMap:it,envMapMode:it&&j.mapping,envMapCubeUVHeight:V,aoMap:I,lightMap:At,bumpMap:et,normalMap:yt,displacementMap:d&&lt,emissiveMap:Lt,normalMapObjectSpace:yt&&y.normalMapType===Gu,normalMapTangentSpace:yt&&y.normalMapType===Fh,metalnessMap:_t,roughnessMap:C,anisotropy:S,anisotropyMap:ht,clearcoat:H,clearcoatMap:xt,clearcoatNormalMap:Wt,clearcoatRoughnessMap:st,dispersion:$,iridescence:J,iridescenceMap:vt,iridescenceThicknessMap:Dt,sheen:Y,sheenColorMap:Ft,sheenRoughnessMap:Mt,specularMap:qt,specularColorMap:Ht,specularIntensityMap:se,transmission:bt,transmissionMap:N,thicknessMap:dt,gradientMap:q,opaque:y.transparent===!1&&y.blending===Di&&y.alphaToCoverage===!1,alphaMap:K,alphaTest:mt,alphaHash:ft,combine:y.combine,mapUv:Gt&&_(y.map.channel),aoMapUv:I&&_(y.aoMap.channel),lightMapUv:At&&_(y.lightMap.channel),bumpMapUv:et&&_(y.bumpMap.channel),normalMapUv:yt&&_(y.normalMap.channel),displacementMapUv:lt&&_(y.displacementMap.channel),emissiveMapUv:Lt&&_(y.emissiveMap.channel),metalnessMapUv:_t&&_(y.metalnessMap.channel),roughnessMapUv:C&&_(y.roughnessMap.channel),anisotropyMapUv:ht&&_(y.anisotropyMap.channel),clearcoatMapUv:xt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ft&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&_(y.sheenRoughnessMap.channel),specularMapUv:qt&&_(y.specularMap.channel),specularColorMapUv:Ht&&_(y.specularColorMap.channel),specularIntensityMapUv:se&&_(y.specularIntensityMap.channel),transmissionMapUv:N&&_(y.transmissionMap.channel),thicknessMapUv:dt&&_(y.thicknessMap.channel),alphaMapUv:K&&_(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(yt||S),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!k.attributes.uv&&(Gt||K),fog:!!U,useFog:y.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Rt,skinning:D.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:Ut,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:fe,decodeVideoTexture:Gt&&y.map.isVideoTexture===!0&&Yt.getTransfer(y.map.colorSpace)===ne,decodeVideoTextureEmissive:Lt&&y.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(y.emissiveMap.colorSpace)===ne,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===We,flipSided:y.side===Pe,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:kt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(kt&&y.extensions.multiDraw===!0||Pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function p(y){let x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(let T in y.defines)x.push(T),x.push(y.defines[T]);return y.isRawShaderMaterial===!1&&(w(x,y),b(x,y),x.push(i.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function w(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function b(y,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),y.push(a.mask)}function v(y){let x=g[y.type],T;if(x){let F=cn[x];T=Pd.clone(F.uniforms)}else T=y.uniforms;return T}function L(y,x){let T;for(let F=0,D=h.length;F<D;F++){let U=h[F];if(U.cacheKey===x){T=U,++T.usedTimes;break}}return T===void 0&&(T=new kg(i,x,y,r),h.push(T)),T}function P(y){if(--y.usedTimes===0){let x=h.indexOf(y);h[x]=h[h.length-1],h.pop(),y.destroy()}}function A(y){l.remove(y)}function M(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:L,releaseProgram:P,releaseShaderCache:A,programs:h,dispose:M}}function Vg(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Gg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function lh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ch(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Gg),n.length>1&&n.sort(d||lh),s.length>1&&s.sort(d||lh)}function h(){for(let u=t,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Wg(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new ch,i.set(n,[o])):s>=r.length?(o=new ch,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Xg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Nt};break;case"SpotLight":e={position:new R,direction:new R,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function qg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var $g=0;function Yg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Zg(i){let t=new Xg,e=qg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let s=new R,r=new Xt,o=new Xt;function a(c){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,w=0,b=0,v=0,L=0,P=0,A=0;c.sort(Yg);for(let y=0,x=c.length;y<x;y++){let T=c[y],F=T.color,D=T.intensity,U=T.distance,k=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=F.r*D,u+=F.g*D,d+=F.b*D;else if(T.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(T.sh.coefficients[z],D);A++}else if(T.isDirectionalLight){let z=t.get(T);if(z.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){let j=T.shadow,V=e.get(T);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=k,n.directionalShadowMatrix[f]=T.shadow.matrix,w++}n.directional[f]=z,f++}else if(T.isSpotLight){let z=t.get(T);z.position.setFromMatrixPosition(T.matrixWorld),z.color.copy(F).multiplyScalar(D),z.distance=U,z.coneCos=Math.cos(T.angle),z.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),z.decay=T.decay,n.spot[_]=z;let j=T.shadow;if(T.map&&(n.spotLightMap[L]=T.map,L++,j.updateMatrices(T),T.castShadow&&P++),n.spotLightMatrix[_]=j.matrix,T.castShadow){let V=e.get(T);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=k,v++}_++}else if(T.isRectAreaLight){let z=t.get(T);z.color.copy(F).multiplyScalar(D),z.halfWidth.set(T.width*.5,0,0),z.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=z,m++}else if(T.isPointLight){let z=t.get(T);if(z.color.copy(T.color).multiplyScalar(T.intensity),z.distance=T.distance,z.decay=T.decay,T.castShadow){let j=T.shadow,V=e.get(T);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,V.shadowCameraNear=j.camera.near,V.shadowCameraFar=j.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=T.shadow.matrix,b++}n.point[g]=z,g++}else if(T.isHemisphereLight){let z=t.get(T);z.skyColor.copy(T.color).multiplyScalar(D),z.groundColor.copy(T.groundColor).multiplyScalar(D),n.hemi[p]=z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ct.LTC_FLOAT_1,n.rectAreaLTC2=ct.LTC_FLOAT_2):(n.rectAreaLTC1=ct.LTC_HALF_1,n.rectAreaLTC2=ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let M=n.hash;(M.directionalLength!==f||M.pointLength!==g||M.spotLength!==_||M.rectAreaLength!==m||M.hemiLength!==p||M.numDirectionalShadows!==w||M.numPointShadows!==b||M.numSpotShadows!==v||M.numSpotMaps!==L||M.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+L-P,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=A,M.directionalLength=f,M.pointLength=g,M.spotLength=_,M.rectAreaLength=m,M.hemiLength=p,M.numDirectionalShadows=w,M.numPointShadows=b,M.numSpotShadows=v,M.numSpotMaps=L,M.numLightProbes=A,n.version=$g++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0,m=h.matrixWorldInverse;for(let p=0,w=c.length;p<w;p++){let b=c[p];if(b.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(b.isSpotLight){let v=n.spot[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(b.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){let v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){let v=n.hemi[_];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function hh(i){let t=new Zg(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function jg(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new hh(i),t.set(s,[a])):r>=o.length?(a=new hh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Ms=class extends zn{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Vu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ja=class extends zn{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Kg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Qg(i,t,e){let n=new vs,s=new tt,r=new tt,o=new Jt,a=new Ms({depthPacking:Ul}),l=new Ja,c={},h=e.maxTextureSize,u={[kn]:Pe,[Pe]:kn,[We]:We},d=new Ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Kg,fragmentShader:Jg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new ue;g.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new It(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eh;let p=this.type;this.render=function(P,A,M){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;let y=i.getRenderTarget(),x=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),F=i.state;F.setBlending(On),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let D=p!==bn&&this.type===bn,U=p===bn&&this.type!==bn;for(let k=0,z=P.length;k<z;k++){let j=P[k],V=j.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let Q=V.getFrameExtents();if(s.multiply(Q),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,V.mapSize.y=r.y)),V.map===null||D===!0||U===!0){let ut=this.type!==bn?{minFilter:Ie,magFilter:Ie}:{};V.map!==null&&V.map.dispose(),V.map=new Tn(s.x,s.y,ut),V.map.texture.name=j.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();let rt=V.getViewportCount();for(let ut=0;ut<rt;ut++){let Ut=V.getViewport(ut);o.set(r.x*Ut.x,r.y*Ut.y,r.x*Ut.z,r.y*Ut.w),F.viewport(o),V.updateMatrices(j,ut),n=V.getFrustum(),v(A,M,V.camera,j,this.type)}V.isPointLightShadow!==!0&&this.type===bn&&w(V,M),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,x,T)};function w(P,A){let M=t.update(_);d.defines.VSM_SAMPLES!==P.blurSamples&&(d.defines.VSM_SAMPLES=P.blurSamples,f.defines.VSM_SAMPLES=P.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Tn(s.x,s.y)),d.uniforms.shadow_pass.value=P.map.texture,d.uniforms.resolution.value=P.mapSize,d.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(A,null,M,d,_,null),f.uniforms.shadow_pass.value=P.mapPass.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(A,null,M,f,_,null)}function b(P,A,M,y){let x=null,T=M.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(T!==void 0)x=T;else if(x=M.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let F=x.uuid,D=A.uuid,U=c[F];U===void 0&&(U={},c[F]=U);let k=U[D];k===void 0&&(k=x.clone(),U[D]=k,A.addEventListener("dispose",L)),x=k}if(x.visible=A.visible,x.wireframe=A.wireframe,y===bn?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:u[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,M.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let F=i.properties.get(x);F.light=M}return x}function v(P,A,M,y,x){if(P.visible===!1)return;if(P.layers.test(A.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&x===bn)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,P.matrixWorld);let D=t.update(P),U=P.material;if(Array.isArray(U)){let k=D.groups;for(let z=0,j=k.length;z<j;z++){let V=k[z],Q=U[V.materialIndex];if(Q&&Q.visible){let rt=b(P,Q,y,x);P.onBeforeShadow(i,P,A,M,D,rt,V),i.renderBufferDirect(M,null,D,rt,P,V),P.onAfterShadow(i,P,A,M,D,rt,V)}}}else if(U.visible){let k=b(P,U,y,x);P.onBeforeShadow(i,P,A,M,D,k,null),i.renderBufferDirect(M,null,D,k,P,null),P.onAfterShadow(i,P,A,M,D,k,null)}}let F=P.children;for(let D=0,U=F.length;D<U;D++)v(F[D],A,M,y,x)}function L(P){P.target.removeEventListener("dispose",L);for(let M in c){let y=c[M],x=P.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}var t0={[sa]:ra,[oa]:ca,[aa]:ha,[Bi]:la,[ra]:sa,[ca]:oa,[ha]:aa,[la]:Bi};function e0(i,t){function e(){let N=!1,dt=new Jt,q=null,K=new Jt(0,0,0,0);return{setMask:function(mt){q!==mt&&!N&&(i.colorMask(mt,mt,mt,mt),q=mt)},setLocked:function(mt){N=mt},setClear:function(mt,ft,kt,fe,Te){Te===!0&&(mt*=fe,ft*=fe,kt*=fe),dt.set(mt,ft,kt,fe),K.equals(dt)===!1&&(i.clearColor(mt,ft,kt,fe),K.copy(dt))},reset:function(){N=!1,q=null,K.set(-1,0,0,0)}}}function n(){let N=!1,dt=!1,q=null,K=null,mt=null;return{setReversed:function(ft){if(dt!==ft){let kt=t.get("EXT_clip_control");dt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT);let fe=mt;mt=null,this.setClear(fe)}dt=ft},getReversed:function(){return dt},setTest:function(ft){ft?at(i.DEPTH_TEST):Rt(i.DEPTH_TEST)},setMask:function(ft){q!==ft&&!N&&(i.depthMask(ft),q=ft)},setFunc:function(ft){if(dt&&(ft=t0[ft]),K!==ft){switch(ft){case sa:i.depthFunc(i.NEVER);break;case ra:i.depthFunc(i.ALWAYS);break;case oa:i.depthFunc(i.LESS);break;case Bi:i.depthFunc(i.LEQUAL);break;case aa:i.depthFunc(i.EQUAL);break;case la:i.depthFunc(i.GEQUAL);break;case ca:i.depthFunc(i.GREATER);break;case ha:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=ft}},setLocked:function(ft){N=ft},setClear:function(ft){mt!==ft&&(dt&&(ft=1-ft),i.clearDepth(ft),mt=ft)},reset:function(){N=!1,q=null,K=null,mt=null,dt=!1}}}function s(){let N=!1,dt=null,q=null,K=null,mt=null,ft=null,kt=null,fe=null,Te=null;return{setTest:function(ee){N||(ee?at(i.STENCIL_TEST):Rt(i.STENCIL_TEST))},setMask:function(ee){dt!==ee&&!N&&(i.stencilMask(ee),dt=ee)},setFunc:function(ee,je,mn){(q!==ee||K!==je||mt!==mn)&&(i.stencilFunc(ee,je,mn),q=ee,K=je,mt=mn)},setOp:function(ee,je,mn){(ft!==ee||kt!==je||fe!==mn)&&(i.stencilOp(ee,je,mn),ft=ee,kt=je,fe=mn)},setLocked:function(ee){N=ee},setClear:function(ee){Te!==ee&&(i.clearStencil(ee),Te=ee)},reset:function(){N=!1,dt=null,q=null,K=null,mt=null,ft=null,kt=null,fe=null,Te=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,b=null,v=null,L=null,P=null,A=new Nt(0,0,0),M=0,y=!1,x=null,T=null,F=null,D=null,U=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,j=0,V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=j>=2);let Q=null,rt={},ut=i.getParameter(i.SCISSOR_BOX),Ut=i.getParameter(i.VIEWPORT),Zt=new Jt().fromArray(ut),X=new Jt().fromArray(Ut);function nt(N,dt,q,K){let mt=new Uint8Array(4),ft=i.createTexture();i.bindTexture(N,ft),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let kt=0;kt<q;kt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(dt+kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return ft}let gt={};gt[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),gt[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),gt[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(i.DEPTH_TEST),o.setFunc(Bi),et(!1),yt(uc),at(i.CULL_FACE),I(On);function at(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Rt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Tt(N,dt){return u[N]!==dt?(i.bindFramebuffer(N,dt),u[N]=dt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function Pt(N,dt){let q=f,K=!1;if(N){q=d.get(dt),q===void 0&&(q=[],d.set(dt,q));let mt=N.textures;if(q.length!==mt.length||q[0]!==i.COLOR_ATTACHMENT0){for(let ft=0,kt=mt.length;ft<kt;ft++)q[ft]=i.COLOR_ATTACHMENT0+ft;q.length=mt.length,K=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,K=!0);K&&i.drawBuffers(q)}function Gt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}let Z={[Kn]:i.FUNC_ADD,[gu]:i.FUNC_SUBTRACT,[_u]:i.FUNC_REVERSE_SUBTRACT};Z[xu]=i.MIN,Z[yu]=i.MAX;let it={[vu]:i.ZERO,[Mu]:i.ONE,[bu]:i.SRC_COLOR,[na]:i.SRC_ALPHA,[Ru]:i.SRC_ALPHA_SATURATE,[Tu]:i.DST_COLOR,[wu]:i.DST_ALPHA,[Su]:i.ONE_MINUS_SRC_COLOR,[ia]:i.ONE_MINUS_SRC_ALPHA,[Au]:i.ONE_MINUS_DST_COLOR,[Eu]:i.ONE_MINUS_DST_ALPHA,[Cu]:i.CONSTANT_COLOR,[Pu]:i.ONE_MINUS_CONSTANT_COLOR,[Iu]:i.CONSTANT_ALPHA,[Lu]:i.ONE_MINUS_CONSTANT_ALPHA};function I(N,dt,q,K,mt,ft,kt,fe,Te,ee){if(N===On){_===!0&&(Rt(i.BLEND),_=!1);return}if(_===!1&&(at(i.BLEND),_=!0),N!==mu){if(N!==m||ee!==y){if((p!==Kn||v!==Kn)&&(i.blendEquation(i.FUNC_ADD),p=Kn,v=Kn),ee)switch(N){case Di:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dc:i.blendFunc(i.ONE,i.ONE);break;case fc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Di:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case fc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}w=null,b=null,L=null,P=null,A.set(0,0,0),M=0,m=N,y=ee}return}mt=mt||dt,ft=ft||q,kt=kt||K,(dt!==p||mt!==v)&&(i.blendEquationSeparate(Z[dt],Z[mt]),p=dt,v=mt),(q!==w||K!==b||ft!==L||kt!==P)&&(i.blendFuncSeparate(it[q],it[K],it[ft],it[kt]),w=q,b=K,L=ft,P=kt),(fe.equals(A)===!1||Te!==M)&&(i.blendColor(fe.r,fe.g,fe.b,Te),A.copy(fe),M=Te),m=N,y=!1}function At(N,dt){N.side===We?Rt(i.CULL_FACE):at(i.CULL_FACE);let q=N.side===Pe;dt&&(q=!q),et(q),N.blending===Di&&N.transparent===!1?I(On):I(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let K=N.stencilWrite;a.setTest(K),K&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Lt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):Rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(N){x!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),x=N)}function yt(N){N!==fu?(at(i.CULL_FACE),N!==T&&(N===uc?i.cullFace(i.BACK):N===pu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Rt(i.CULL_FACE),T=N}function lt(N){N!==F&&(z&&i.lineWidth(N),F=N)}function Lt(N,dt,q){N?(at(i.POLYGON_OFFSET_FILL),(D!==dt||U!==q)&&(i.polygonOffset(dt,q),D=dt,U=q)):Rt(i.POLYGON_OFFSET_FILL)}function _t(N){N?at(i.SCISSOR_TEST):Rt(i.SCISSOR_TEST)}function C(N){N===void 0&&(N=i.TEXTURE0+k-1),Q!==N&&(i.activeTexture(N),Q=N)}function S(N,dt,q){q===void 0&&(Q===null?q=i.TEXTURE0+k-1:q=Q);let K=rt[q];K===void 0&&(K={type:void 0,texture:void 0},rt[q]=K),(K.type!==N||K.texture!==dt)&&(Q!==q&&(i.activeTexture(q),Q=q),i.bindTexture(N,dt||gt[N]),K.type=N,K.texture=dt)}function H(){let N=rt[Q];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Y(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(N){Zt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Zt.copy(N))}function Mt(N){X.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),X.copy(N))}function qt(N,dt){let q=c.get(dt);q===void 0&&(q=new WeakMap,c.set(dt,q));let K=q.get(N);K===void 0&&(K=i.getUniformBlockIndex(dt,N.name),q.set(N,K))}function Ht(N,dt){let K=c.get(dt).get(N);l.get(dt)!==K&&(i.uniformBlockBinding(dt,K,N.__bindingPointIndex),l.set(dt,K))}function se(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},Q=null,rt={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,b=null,v=null,L=null,P=null,A=new Nt(0,0,0),M=0,y=!1,x=null,T=null,F=null,D=null,U=null,Zt.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:at,disable:Rt,bindFramebuffer:Tt,drawBuffers:Pt,useProgram:Gt,setBlending:I,setMaterial:At,setFlipSided:et,setCullFace:yt,setLineWidth:lt,setPolygonOffset:Lt,setScissorTest:_t,activeTexture:C,bindTexture:S,unbindTexture:H,compressedTexImage2D:$,compressedTexImage3D:J,texImage2D:vt,texImage3D:Dt,updateUBOMapping:qt,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:st,texSubImage2D:Y,texSubImage3D:bt,compressedTexSubImage2D:ht,compressedTexSubImage3D:xt,scissor:Ft,viewport:Mt,reset:se}}function uh(i,t,e,n){let s=n0(n);switch(e){case Ih:return i*t;case Dh:return i*t;case Uh:return i*t*2;case jr:return i*t/s.components*s.byteLength;case Il:return i*t/s.components*s.byteLength;case Kr:return i*t*2/s.components*s.byteLength;case Ll:return i*t*2/s.components*s.byteLength;case Lh:return i*t*3/s.components*s.byteLength;case sn:return i*t*4/s.components*s.byteLength;case Dl:return i*t*4/s.components*s.byteLength;case pr:case mr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ma:case _a:return Math.max(i,16)*Math.max(t,8)/4;case pa:case ga:return Math.max(i,8)*Math.max(t,8)/2;case xa:case ya:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ba:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Sa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case wa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Aa:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ra:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ca:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Pa:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case La:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Da:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ua:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case xr:case Na:case Fa:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Nh:case Oa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ba:case ka:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function n0(i){switch(i){case rn:case Rh:return{byteLength:1,components:1};case _s:case Ch:case Cs:return{byteLength:2,components:1};case Cl:case Pl:return{byteLength:2,components:4};case ei:case Rl:case nn:return{byteLength:4,components:1};case Ph:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function i0(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new tt,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return f?new OffscreenCanvas(C,S):Mr("canvas")}function _(C,S,H){let $=1,J=_t(C);if((J.width>H||J.height>H)&&($=H/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let Y=Math.floor($*J.width),bt=Math.floor($*J.height);u===void 0&&(u=g(Y,bt));let ht=S?g(Y,bt):u;return ht.width=Y,ht.height=bt,ht.getContext("2d").drawImage(C,0,0,Y,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Y+"x"+bt+")."),ht}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){i.generateMipmap(C)}function w(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(C,S,H,$,J=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Y=S;if(S===i.RED&&(H===i.FLOAT&&(Y=i.R32F),H===i.HALF_FLOAT&&(Y=i.R16F),H===i.UNSIGNED_BYTE&&(Y=i.R8)),S===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.R8UI),H===i.UNSIGNED_SHORT&&(Y=i.R16UI),H===i.UNSIGNED_INT&&(Y=i.R32UI),H===i.BYTE&&(Y=i.R8I),H===i.SHORT&&(Y=i.R16I),H===i.INT&&(Y=i.R32I)),S===i.RG&&(H===i.FLOAT&&(Y=i.RG32F),H===i.HALF_FLOAT&&(Y=i.RG16F),H===i.UNSIGNED_BYTE&&(Y=i.RG8)),S===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RG8UI),H===i.UNSIGNED_SHORT&&(Y=i.RG16UI),H===i.UNSIGNED_INT&&(Y=i.RG32UI),H===i.BYTE&&(Y=i.RG8I),H===i.SHORT&&(Y=i.RG16I),H===i.INT&&(Y=i.RG32I)),S===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),H===i.UNSIGNED_INT&&(Y=i.RGB32UI),H===i.BYTE&&(Y=i.RGB8I),H===i.SHORT&&(Y=i.RGB16I),H===i.INT&&(Y=i.RGB32I)),S===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),H===i.UNSIGNED_INT&&(Y=i.RGBA32UI),H===i.BYTE&&(Y=i.RGBA8I),H===i.SHORT&&(Y=i.RGBA16I),H===i.INT&&(Y=i.RGBA32I)),S===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),S===i.RGBA){let bt=J?Jr:Yt.getTransfer($);H===i.FLOAT&&(Y=i.RGBA32F),H===i.HALF_FLOAT&&(Y=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Y=bt===ne?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function v(C,S){let H;return C?S===null||S===ei||S===Hi?H=i.DEPTH24_STENCIL8:S===nn?H=i.DEPTH32F_STENCIL8:S===_s&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ei||S===Hi?H=i.DEPTH_COMPONENT24:S===nn?H=i.DEPTH_COMPONENT32F:S===_s&&(H=i.DEPTH_COMPONENT16),H}function L(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ie&&C.minFilter!==un?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function P(C){let S=C.target;S.removeEventListener("dispose",P),M(S),S.isVideoTexture&&h.delete(S)}function A(C){let S=C.target;S.removeEventListener("dispose",A),x(S)}function M(C){let S=n.get(C);if(S.__webglInit===void 0)return;let H=C.source,$=d.get(H);if($){let J=$[S.__cacheKey];J.usedTimes--,J.usedTimes===0&&y(C),Object.keys($).length===0&&d.delete(H)}n.remove(C)}function y(C){let S=n.get(C);i.deleteTexture(S.__webglTexture);let H=C.source,$=d.get(H);delete $[S.__cacheKey],o.memory.textures--}function x(C){let S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let J=0;J<S.__webglFramebuffer[$].length;J++)i.deleteFramebuffer(S.__webglFramebuffer[$][J]);else i.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)i.deleteFramebuffer(S.__webglFramebuffer[$]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let H=C.textures;for(let $=0,J=H.length;$<J;$++){let Y=n.get(H[$]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(H[$])}n.remove(C)}let T=0;function F(){T=0}function D(){let C=T;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),T+=1,C}function U(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function k(C,S){let H=n.get(C);if(C.isVideoTexture&&lt(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){let $=C.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(H,C,S);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+S)}function z(C,S){let H=n.get(C);if(C.version>0&&H.__version!==C.version){X(H,C,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+S)}function j(C,S){let H=n.get(C);if(C.version>0&&H.__version!==C.version){X(H,C,S);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+S)}function V(C,S){let H=n.get(C);if(C.version>0&&H.__version!==C.version){nt(H,C,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+S)}let Q={[gs]:i.REPEAT,[Qn]:i.CLAMP_TO_EDGE,[fa]:i.MIRRORED_REPEAT},rt={[Ie]:i.NEAREST,[Hu]:i.NEAREST_MIPMAP_NEAREST,[Bs]:i.NEAREST_MIPMAP_LINEAR,[un]:i.LINEAR,[Mo]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},ut={[Wu]:i.NEVER,[ju]:i.ALWAYS,[Xu]:i.LESS,[Oh]:i.LEQUAL,[qu]:i.EQUAL,[Zu]:i.GEQUAL,[$u]:i.GREATER,[Yu]:i.NOTEQUAL};function Ut(C,S){if(S.type===nn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===un||S.magFilter===Mo||S.magFilter===Bs||S.magFilter===ti||S.minFilter===un||S.minFilter===Mo||S.minFilter===Bs||S.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Q[S.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Q[S.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Q[S.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,rt[S.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,rt[S.minFilter]),S.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ut[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ie||S.minFilter!==Bs&&S.minFilter!==ti||S.type===nn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Zt(C,S){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",P));let $=S.source,J=d.get($);J===void 0&&(J={},d.set($,J));let Y=U(S);if(Y!==C.__cacheKey){J[Y]===void 0&&(J[Y]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),J[Y].usedTimes++;let bt=J[C.__cacheKey];bt!==void 0&&(J[C.__cacheKey].usedTimes--,bt.usedTimes===0&&y(S)),C.__cacheKey=Y,C.__webglTexture=J[Y].texture}return H}function X(C,S,H){let $=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=i.TEXTURE_3D);let J=Zt(C,S),Y=S.source;e.bindTexture($,C.__webglTexture,i.TEXTURE0+H);let bt=n.get(Y);if(Y.version!==bt.__version||J===!0){e.activeTexture(i.TEXTURE0+H);let ht=Yt.getPrimaries(Yt.workingColorSpace),xt=S.colorSpace===Fn?null:Yt.getPrimaries(S.colorSpace),Wt=S.colorSpace===Fn||ht===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let st=_(S.image,!1,s.maxTextureSize);st=Lt(S,st);let vt=r.convert(S.format,S.colorSpace),Dt=r.convert(S.type),Ft=b(S.internalFormat,vt,Dt,S.colorSpace,S.isVideoTexture);Ut($,S);let Mt,qt=S.mipmaps,Ht=S.isVideoTexture!==!0,se=bt.__version===void 0||J===!0,N=Y.dataReady,dt=L(S,st);if(S.isDepthTexture)Ft=v(S.format===Vi,S.type),se&&(Ht?e.texStorage2D(i.TEXTURE_2D,1,Ft,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Ft,st.width,st.height,0,vt,Dt,null));else if(S.isDataTexture)if(qt.length>0){Ht&&se&&e.texStorage2D(i.TEXTURE_2D,dt,Ft,qt[0].width,qt[0].height);for(let q=0,K=qt.length;q<K;q++)Mt=qt[q],Ht?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,Mt.width,Mt.height,vt,Dt,Mt.data):e.texImage2D(i.TEXTURE_2D,q,Ft,Mt.width,Mt.height,0,vt,Dt,Mt.data);S.generateMipmaps=!1}else Ht?(se&&e.texStorage2D(i.TEXTURE_2D,dt,Ft,st.width,st.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st.width,st.height,vt,Dt,st.data)):e.texImage2D(i.TEXTURE_2D,0,Ft,st.width,st.height,0,vt,Dt,st.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ht&&se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Ft,qt[0].width,qt[0].height,st.depth);for(let q=0,K=qt.length;q<K;q++)if(Mt=qt[q],S.format!==sn)if(vt!==null)if(Ht){if(N)if(S.layerUpdates.size>0){let mt=uh(Mt.width,Mt.height,S.format,S.type);for(let ft of S.layerUpdates){let kt=Mt.data.subarray(ft*mt/Mt.data.BYTES_PER_ELEMENT,(ft+1)*mt/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,ft,Mt.width,Mt.height,1,vt,kt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,Mt.width,Mt.height,st.depth,vt,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,q,Ft,Mt.width,Mt.height,st.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,Mt.width,Mt.height,st.depth,vt,Dt,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,q,Ft,Mt.width,Mt.height,st.depth,0,vt,Dt,Mt.data)}else{Ht&&se&&e.texStorage2D(i.TEXTURE_2D,dt,Ft,qt[0].width,qt[0].height);for(let q=0,K=qt.length;q<K;q++)Mt=qt[q],S.format!==sn?vt!==null?Ht?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,q,0,0,Mt.width,Mt.height,vt,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,q,Ft,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,Mt.width,Mt.height,vt,Dt,Mt.data):e.texImage2D(i.TEXTURE_2D,q,Ft,Mt.width,Mt.height,0,vt,Dt,Mt.data)}else if(S.isDataArrayTexture)if(Ht){if(se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Ft,st.width,st.height,st.depth),N)if(S.layerUpdates.size>0){let q=uh(st.width,st.height,S.format,S.type);for(let K of S.layerUpdates){let mt=st.data.subarray(K*q/st.data.BYTES_PER_ELEMENT,(K+1)*q/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,st.width,st.height,1,vt,Dt,mt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,vt,Dt,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,st.width,st.height,st.depth,0,vt,Dt,st.data);else if(S.isData3DTexture)Ht?(se&&e.texStorage3D(i.TEXTURE_3D,dt,Ft,st.width,st.height,st.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,vt,Dt,st.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,st.width,st.height,st.depth,0,vt,Dt,st.data);else if(S.isFramebufferTexture){if(se)if(Ht)e.texStorage2D(i.TEXTURE_2D,dt,Ft,st.width,st.height);else{let q=st.width,K=st.height;for(let mt=0;mt<dt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Ft,q,K,0,vt,Dt,null),q>>=1,K>>=1}}else if(qt.length>0){if(Ht&&se){let q=_t(qt[0]);e.texStorage2D(i.TEXTURE_2D,dt,Ft,q.width,q.height)}for(let q=0,K=qt.length;q<K;q++)Mt=qt[q],Ht?N&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,vt,Dt,Mt):e.texImage2D(i.TEXTURE_2D,q,Ft,vt,Dt,Mt);S.generateMipmaps=!1}else if(Ht){if(se){let q=_t(st);e.texStorage2D(i.TEXTURE_2D,dt,Ft,q.width,q.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Dt,st)}else e.texImage2D(i.TEXTURE_2D,0,Ft,vt,Dt,st);m(S)&&p($),bt.__version=Y.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function nt(C,S,H){if(S.image.length!==6)return;let $=Zt(C,S),J=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);let Y=n.get(J);if(J.version!==Y.__version||$===!0){e.activeTexture(i.TEXTURE0+H);let bt=Yt.getPrimaries(Yt.workingColorSpace),ht=S.colorSpace===Fn?null:Yt.getPrimaries(S.colorSpace),xt=S.colorSpace===Fn||bt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let Wt=S.isCompressedTexture||S.image[0].isCompressedTexture,st=S.image[0]&&S.image[0].isDataTexture,vt=[];for(let K=0;K<6;K++)!Wt&&!st?vt[K]=_(S.image[K],!0,s.maxCubemapSize):vt[K]=st?S.image[K].image:S.image[K],vt[K]=Lt(S,vt[K]);let Dt=vt[0],Ft=r.convert(S.format,S.colorSpace),Mt=r.convert(S.type),qt=b(S.internalFormat,Ft,Mt,S.colorSpace),Ht=S.isVideoTexture!==!0,se=Y.__version===void 0||$===!0,N=J.dataReady,dt=L(S,Dt);Ut(i.TEXTURE_CUBE_MAP,S);let q;if(Wt){Ht&&se&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,Dt.width,Dt.height);for(let K=0;K<6;K++){q=vt[K].mipmaps;for(let mt=0;mt<q.length;mt++){let ft=q[mt];S.format!==sn?Ft!==null?Ht?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt,0,0,ft.width,ft.height,Ft,ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt,qt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt,0,0,ft.width,ft.height,Ft,Mt,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt,qt,ft.width,ft.height,0,Ft,Mt,ft.data)}}}else{if(q=S.mipmaps,Ht&&se){q.length>0&&dt++;let K=_t(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,qt,K.width,K.height)}for(let K=0;K<6;K++)if(st){Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,vt[K].width,vt[K].height,Ft,Mt,vt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qt,vt[K].width,vt[K].height,0,Ft,Mt,vt[K].data);for(let mt=0;mt<q.length;mt++){let kt=q[mt].image[K].image;Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt+1,0,0,kt.width,kt.height,Ft,Mt,kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt+1,qt,kt.width,kt.height,0,Ft,Mt,kt.data)}}else{Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ft,Mt,vt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qt,Ft,Mt,vt[K]);for(let mt=0;mt<q.length;mt++){let ft=q[mt];Ht?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt+1,0,0,Ft,Mt,ft.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,mt+1,qt,Ft,Mt,ft.image[K])}}}m(S)&&p(i.TEXTURE_CUBE_MAP),Y.__version=J.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function gt(C,S,H,$,J,Y){let bt=r.convert(H.format,H.colorSpace),ht=r.convert(H.type),xt=b(H.internalFormat,bt,ht,H.colorSpace),Wt=n.get(S),st=n.get(H);if(st.__renderTarget=S,!Wt.__hasExternalTextures){let vt=Math.max(1,S.width>>Y),Dt=Math.max(1,S.height>>Y);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,Y,xt,vt,Dt,S.depth,0,bt,ht,null):e.texImage2D(J,Y,xt,vt,Dt,0,bt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),yt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,J,st.__webglTexture,0,et(S)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,J,st.__webglTexture,Y),e.bindFramebuffer(i.FRAMEBUFFER,null)}function at(C,S,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),S.depthBuffer){let $=S.depthTexture,J=$&&$.isDepthTexture?$.type:null,Y=v(S.stencilBuffer,J),bt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=et(S);yt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,Y,S.width,S.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,Y,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Y,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,bt,i.RENDERBUFFER,C)}else{let $=S.textures;for(let J=0;J<$.length;J++){let Y=$[J],bt=r.convert(Y.format,Y.colorSpace),ht=r.convert(Y.type),xt=b(Y.internalFormat,bt,ht,Y.colorSpace),Wt=et(S);H&&yt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,xt,S.width,S.height):yt(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt,xt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Rt(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=n.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),k(S.depthTexture,0);let J=$.__webglTexture,Y=et(S);if(S.depthTexture.format===Ui)yt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(S.depthTexture.format===Vi)yt(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Tt(C){let S=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let $=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){let J=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),S.__depthDisposeCallback=J}S.__boundDepthTexture=$}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Rt(S.__webglFramebuffer,C)}else if(H){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=i.createRenderbuffer(),at(S.__webglDepthbuffer[$],C,!1);else{let J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=S.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,Y)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),at(S.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(C,S,H){let $=n.get(C);S!==void 0&&gt($.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Tt(C)}function Gt(C){let S=C.texture,H=n.get(C),$=n.get(S);C.addEventListener("dispose",A);let J=C.textures,Y=C.isWebGLCubeRenderTarget===!0,bt=J.length>1;if(bt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=S.version,o.memory.textures++),Y){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let xt=0;xt<S.mipmaps.length;xt++)H.__webglFramebuffer[ht][xt]=i.createFramebuffer()}else H.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<S.mipmaps.length;ht++)H.__webglFramebuffer[ht]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(bt)for(let ht=0,xt=J.length;ht<xt;ht++){let Wt=n.get(J[ht]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&yt(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<J.length;ht++){let xt=J[ht];H.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);let Wt=r.convert(xt.format,xt.colorSpace),st=r.convert(xt.type),vt=b(xt.internalFormat,Wt,st,xt.colorSpace,C.isXRRenderTarget===!0),Dt=et(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,vt,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),at(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Ut(i.TEXTURE_CUBE_MAP,S);for(let ht=0;ht<6;ht++)if(S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)gt(H.__webglFramebuffer[ht][xt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,xt);else gt(H.__webglFramebuffer[ht],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(S)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let ht=0,xt=J.length;ht<xt;ht++){let Wt=J[ht],st=n.get(Wt);e.bindTexture(i.TEXTURE_2D,st.__webglTexture),Ut(i.TEXTURE_2D,Wt),gt(H.__webglFramebuffer,C,Wt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),m(Wt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ht=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,$.__webglTexture),Ut(ht,S),S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)gt(H.__webglFramebuffer[xt],C,S,i.COLOR_ATTACHMENT0,ht,xt);else gt(H.__webglFramebuffer,C,S,i.COLOR_ATTACHMENT0,ht,0);m(S)&&p(ht),e.unbindTexture()}C.depthBuffer&&Tt(C)}function Z(C){let S=C.textures;for(let H=0,$=S.length;H<$;H++){let J=S[H];if(m(J)){let Y=w(C),bt=n.get(J).__webglTexture;e.bindTexture(Y,bt),p(Y),e.unbindTexture()}}}let it=[],I=[];function At(C){if(C.samples>0){if(yt(C)===!1){let S=C.textures,H=C.width,$=C.height,J=i.COLOR_BUFFER_BIT,Y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(C),ht=S.length>1;if(ht)for(let xt=0;xt<S.length;xt++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let xt=0;xt<S.length;xt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[xt]);let Wt=n.get(S[xt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Wt,0)}i.blitFramebuffer(0,0,H,$,0,0,H,$,J,i.NEAREST),l===!0&&(it.length=0,I.length=0,it.push(i.COLOR_ATTACHMENT0+xt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(it.push(Y),I.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let xt=0;xt<S.length;xt++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,bt.__webglColorRenderbuffer[xt]);let Wt=n.get(S[xt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let S=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function et(C){return Math.min(s.maxSamples,C.samples)}function yt(C){let S=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function lt(C){let S=o.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function Lt(C,S){let H=C.colorSpace,$=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==ji&&H!==Fn&&(Yt.getTransfer(H)===ne?($!==sn||J!==rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function _t(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=F,this.setTexture2D=k,this.setTexture2DArray=z,this.setTexture3D=j,this.setTextureCube=V,this.rebindTextures=Pt,this.setupRenderTarget=Gt,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=Tt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=yt}function s0(i,t){function e(n,s=Fn){let r,o=Yt.getTransfer(s);if(n===rn)return i.UNSIGNED_BYTE;if(n===Cl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Pl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ph)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Rh)return i.BYTE;if(n===Ch)return i.SHORT;if(n===_s)return i.UNSIGNED_SHORT;if(n===Rl)return i.INT;if(n===ei)return i.UNSIGNED_INT;if(n===nn)return i.FLOAT;if(n===Cs)return i.HALF_FLOAT;if(n===Ih)return i.ALPHA;if(n===Lh)return i.RGB;if(n===sn)return i.RGBA;if(n===Dh)return i.LUMINANCE;if(n===Uh)return i.LUMINANCE_ALPHA;if(n===Ui)return i.DEPTH_COMPONENT;if(n===Vi)return i.DEPTH_STENCIL;if(n===jr)return i.RED;if(n===Il)return i.RED_INTEGER;if(n===Kr)return i.RG;if(n===Ll)return i.RG_INTEGER;if(n===Dl)return i.RGBA_INTEGER;if(n===pr||n===mr||n===gr||n===_r)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===pa||n===ma||n===ga||n===_a)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===pa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_a)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===xa||n===ya||n===va)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===xa||n===ya)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===va)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ma||n===ba||n===Sa||n===wa||n===Ea||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===Ia||n===La||n===Da||n===Ua)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ma)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ba)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Sa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ea)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ta)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Aa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ra)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ca)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Pa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ia)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===La)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Da)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ua)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xr||n===Na||n===Fa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===xr)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Na)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nh||n===Oa||n===Ba||n===ka)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===xr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Oa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ba)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ka)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Qa=class extends Ce{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},he=class extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}},r0={type:"move"},ds=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new he,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new he,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new he,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(r0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new he;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},o0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,a0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,tl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let s=new Fe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ye({vertexShader:o0,fragmentShader:a0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new It(new Rr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},el=class extends En{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,_=new tl,m=e.getContextAttributes(),p=null,w=null,b=[],v=[],L=new tt,P=null,A=new Ce;A.viewport=new Jt;let M=new Ce;M.viewport=new Jt;let y=[A,M],x=new Qa,T=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let nt=b[X];return nt===void 0&&(nt=new ds,b[X]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(X){let nt=b[X];return nt===void 0&&(nt=new ds,b[X]=nt),nt.getGripSpace()},this.getHand=function(X){let nt=b[X];return nt===void 0&&(nt=new ds,b[X]=nt),nt.getHandSpace()};function D(X){let nt=v.indexOf(X.inputSource);if(nt===-1)return;let gt=b[nt];gt!==void 0&&(gt.update(X.inputSource,X.frame,c||o),gt.dispatchEvent({type:X.type,data:X.inputSource}))}function U(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",k);for(let X=0;X<b.length;X++){let nt=v[X];nt!==null&&(v[X]=null,b[X].disconnect(nt))}T=null,F=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,w=null,Zt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",U),s.addEventListener("inputsourceschange",k),m.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){let nt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new Tn(f.framebufferWidth,f.framebufferHeight,{format:sn,type:rn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let nt=null,gt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=m.stencil?Vi:Ui,gt=m.stencil?Hi:ei);let Rt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Rt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),w=new Tn(d.textureWidth,d.textureHeight,{format:sn,type:rn,depthTexture:new Pr(d.textureWidth,d.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Zt.setContext(s),Zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(X){for(let nt=0;nt<X.removed.length;nt++){let gt=X.removed[nt],at=v.indexOf(gt);at>=0&&(v[at]=null,b[at].disconnect(gt))}for(let nt=0;nt<X.added.length;nt++){let gt=X.added[nt],at=v.indexOf(gt);if(at===-1){for(let Tt=0;Tt<b.length;Tt++)if(Tt>=v.length){v.push(gt),at=Tt;break}else if(v[Tt]===null){v[Tt]=gt,at=Tt;break}if(at===-1)break}let Rt=b[at];Rt&&Rt.connect(gt)}}let z=new R,j=new R;function V(X,nt,gt){z.setFromMatrixPosition(nt.matrixWorld),j.setFromMatrixPosition(gt.matrixWorld);let at=z.distanceTo(j),Rt=nt.projectionMatrix.elements,Tt=gt.projectionMatrix.elements,Pt=Rt[14]/(Rt[10]-1),Gt=Rt[14]/(Rt[10]+1),Z=(Rt[9]+1)/Rt[5],it=(Rt[9]-1)/Rt[5],I=(Rt[8]-1)/Rt[0],At=(Tt[8]+1)/Tt[0],et=Pt*I,yt=Pt*At,lt=at/(-I+At),Lt=lt*-I;if(nt.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Lt),X.translateZ(lt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Rt[10]===-1)X.projectionMatrix.copy(nt.projectionMatrix),X.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{let _t=Pt+lt,C=Gt+lt,S=et-Lt,H=yt+(at-Lt),$=Z*Gt/C*_t,J=it*Gt/C*_t;X.projectionMatrix.makePerspective(S,H,$,J,_t,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Q(X,nt){nt===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(nt.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let nt=X.near,gt=X.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(gt=_.depthFar)),x.near=M.near=A.near=nt,x.far=M.far=A.far=gt,(T!==x.near||F!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),T=x.near,F=x.far),A.layers.mask=X.layers.mask|2,M.layers.mask=X.layers.mask|4,x.layers.mask=A.layers.mask|M.layers.mask;let at=X.parent,Rt=x.cameras;Q(x,at);for(let Tt=0;Tt<Rt.length;Tt++)Q(Rt[Tt],at);Rt.length===2?V(x,A,M):x.projectionMatrix.copy(A.projectionMatrix),rt(X,x,at)};function rt(X,nt,gt){gt===null?X.matrix.copy(nt.matrixWorld):(X.matrix.copy(gt.matrixWorld),X.matrix.invert(),X.matrix.multiply(nt.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(nt.projectionMatrix),X.projectionMatrixInverse.copy(nt.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=xs*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let ut=null;function Ut(X,nt){if(h=nt.getViewerPose(c||o),g=nt,h!==null){let gt=h.views;f!==null&&(t.setRenderTargetFramebuffer(w,f.framebuffer),t.setRenderTarget(w));let at=!1;gt.length!==x.cameras.length&&(x.cameras.length=0,at=!0);for(let Tt=0;Tt<gt.length;Tt++){let Pt=gt[Tt],Gt=null;if(f!==null)Gt=f.getViewport(Pt);else{let it=u.getViewSubImage(d,Pt);Gt=it.viewport,Tt===0&&(t.setRenderTargetTextures(w,it.colorTexture,d.ignoreDepthValues?void 0:it.depthStencilTexture),t.setRenderTarget(w))}let Z=y[Tt];Z===void 0&&(Z=new Ce,Z.layers.enable(Tt),Z.viewport=new Jt,y[Tt]=Z),Z.matrix.fromArray(Pt.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(Pt.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(Gt.x,Gt.y,Gt.width,Gt.height),Tt===0&&(x.matrix.copy(Z.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),at===!0&&x.cameras.push(Z)}let Rt=s.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")){let Tt=u.getDepthInformation(gt[0]);Tt&&Tt.isValid&&Tt.texture&&_.init(t,Tt,s.renderState)}}for(let gt=0;gt<b.length;gt++){let at=v[gt],Rt=b[gt];at!==null&&Rt!==void 0&&Rt.update(at,nt,c||o)}ut&&ut(X,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}let Zt=new Vh;Zt.setAnimationLoop(Ut),this.setAnimationLoop=function(X){ut=X},this.dispose=function(){}}},Zn=new dn,l0=new Xt;function c0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Hh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,w,b,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,w,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Pe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Pe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let w=t.get(p),b=w.envMap,v=w.envMapRotation;b&&(m.envMap.value=b,Zn.copy(v),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),m.envMapRotation.value.setFromMatrix4(l0.makeRotationFromEuler(Zn)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,w,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=b*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Pe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let w=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function h0(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,b){let v=b.program;n.uniformBlockBinding(w,v)}function c(w,b){let v=s[w.id];v===void 0&&(g(w),v=h(w),s[w.id]=v,w.addEventListener("dispose",m));let L=b.program;n.updateUBOMapping(w,L);let P=t.render.frame;r[w.id]!==P&&(d(w),r[w.id]=P)}function h(w){let b=u();w.__bindingPointIndex=b;let v=i.createBuffer(),L=w.__size,P=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,L,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,v),v}function u(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){let b=s[w.id],v=w.uniforms,L=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let P=0,A=v.length;P<A;P++){let M=Array.isArray(v[P])?v[P]:[v[P]];for(let y=0,x=M.length;y<x;y++){let T=M[y];if(f(T,P,y,L)===!0){let F=T.__offset,D=Array.isArray(T.value)?T.value:[T.value],U=0;for(let k=0;k<D.length;k++){let z=D[k],j=_(z);typeof z=="number"||typeof z=="boolean"?(T.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,F+U,T.__data)):z.isMatrix3?(T.__data[0]=z.elements[0],T.__data[1]=z.elements[1],T.__data[2]=z.elements[2],T.__data[3]=0,T.__data[4]=z.elements[3],T.__data[5]=z.elements[4],T.__data[6]=z.elements[5],T.__data[7]=0,T.__data[8]=z.elements[6],T.__data[9]=z.elements[7],T.__data[10]=z.elements[8],T.__data[11]=0):(z.toArray(T.__data,U),U+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(w,b,v,L){let P=w.value,A=b+"_"+v;if(L[A]===void 0)return typeof P=="number"||typeof P=="boolean"?L[A]=P:L[A]=P.clone(),!0;{let M=L[A];if(typeof P=="number"||typeof P=="boolean"){if(M!==P)return L[A]=P,!0}else if(M.equals(P)===!1)return M.copy(P),!0}return!1}function g(w){let b=w.uniforms,v=0,L=16;for(let A=0,M=b.length;A<M;A++){let y=Array.isArray(b[A])?b[A]:[b[A]];for(let x=0,T=y.length;x<T;x++){let F=y[x],D=Array.isArray(F.value)?F.value:[F.value];for(let U=0,k=D.length;U<k;U++){let z=D[U],j=_(z),V=v%L,Q=V%j.boundary,rt=V+Q;v+=Q,rt!==0&&L-rt<j.storage&&(v+=L-rt),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=j.storage}}}let P=v%L;return P>0&&(v+=L-P),w.__size=v,w.__cache={},this}function _(w){let b={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(b.boundary=4,b.storage=4):w.isVector2?(b.boundary=8,b.storage=8):w.isVector3||w.isColor?(b.boundary=16,b.storage=12):w.isVector4?(b.boundary=16,b.storage=16):w.isMatrix3?(b.boundary=48,b.storage=48):w.isMatrix4?(b.boundary=64,b.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),b}function m(w){let b=w.target;b.removeEventListener("dispose",m);let v=o.indexOf(b.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function p(){for(let w in s)i.deleteBuffer(s[w]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var Ir=class{constructor(t={}){let{canvas:e=fd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,w=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ce,this.toneMapping=Bn,this.toneMappingExposure=1;let v=this,L=!1,P=0,A=0,M=null,y=-1,x=null,T=new Jt,F=new Jt,D=null,U=new Nt(0),k=0,z=e.width,j=e.height,V=1,Q=null,rt=null,ut=new Jt(0,0,z,j),Ut=new Jt(0,0,z,j),Zt=!1,X=new vs,nt=!1,gt=!1,at=new Xt,Rt=new Xt,Tt=new R,Pt=new Jt,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function it(){return M===null?V:1}let I=n;function At(E,O){return e.getContext(E,O)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${El}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",mt,!1),e.addEventListener("webglcontextcreationerror",ft,!1),I===null){let O="webgl2";if(I=At(O,E),I===null)throw At(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let et,yt,lt,Lt,_t,C,S,H,$,J,Y,bt,ht,xt,Wt,st,vt,Dt,Ft,Mt,qt,Ht,se,N;function dt(){et=new Tm(I),et.init(),Ht=new s0(I,et),yt=new vm(I,et,t,Ht),lt=new e0(I,et),yt.reverseDepthBuffer&&d&&lt.buffers.depth.setReversed(!0),Lt=new Cm(I),_t=new Vg,C=new i0(I,et,lt,_t,yt,Ht,Lt),S=new bm(v),H=new Em(v),$=new Nd(I),se=new xm(I,$),J=new Am(I,$,Lt,se),Y=new Im(I,J,$,Lt),Ft=new Pm(I,yt,C),st=new Mm(_t),bt=new Hg(v,S,H,et,yt,se,st),ht=new c0(v,_t),xt=new Wg,Wt=new jg(et),Dt=new _m(v,S,H,lt,Y,f,l),vt=new Qg(v,Y,yt),N=new h0(I,Lt,yt,lt),Mt=new ym(I,et,Lt),qt=new Rm(I,et,Lt),Lt.programs=bt.programs,v.capabilities=yt,v.extensions=et,v.properties=_t,v.renderLists=xt,v.shadowMap=vt,v.state=lt,v.info=Lt}dt();let q=new el(v,I);this.xr=q,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let E=et.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=et.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(E){E!==void 0&&(V=E,this.setSize(z,j,!1))},this.getSize=function(E){return E.set(z,j)},this.setSize=function(E,O,G=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,j=O,e.width=Math.floor(E*V),e.height=Math.floor(O*V),G===!0&&(e.style.width=E+"px",e.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(z*V,j*V).floor()},this.setDrawingBufferSize=function(E,O,G){z=E,j=O,V=G,e.width=Math.floor(E*G),e.height=Math.floor(O*G),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(T)},this.getViewport=function(E){return E.copy(ut)},this.setViewport=function(E,O,G,W){E.isVector4?ut.set(E.x,E.y,E.z,E.w):ut.set(E,O,G,W),lt.viewport(T.copy(ut).multiplyScalar(V).round())},this.getScissor=function(E){return E.copy(Ut)},this.setScissor=function(E,O,G,W){E.isVector4?Ut.set(E.x,E.y,E.z,E.w):Ut.set(E,O,G,W),lt.scissor(F.copy(Ut).multiplyScalar(V).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(E){lt.setScissorTest(Zt=E)},this.setOpaqueSort=function(E){Q=E},this.setTransparentSort=function(E){rt=E},this.getClearColor=function(E){return E.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(E=!0,O=!0,G=!0){let W=0;if(E){let B=!1;if(M!==null){let ot=M.texture.format;B=ot===Dl||ot===Ll||ot===Il}if(B){let ot=M.texture.type,pt=ot===rn||ot===ei||ot===_s||ot===Hi||ot===Cl||ot===Pl,St=Dt.getClearColor(),wt=Dt.getClearAlpha(),Ot=St.r,zt=St.g,Et=St.b;pt?(g[0]=Ot,g[1]=zt,g[2]=Et,g[3]=wt,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ot,_[1]=zt,_[2]=Et,_[3]=wt,I.clearBufferiv(I.COLOR,0,_))}else W|=I.COLOR_BUFFER_BIT}O&&(W|=I.DEPTH_BUFFER_BIT),G&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",mt,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),xt.dispose(),Wt.dispose(),_t.dispose(),S.dispose(),H.dispose(),Y.dispose(),se.dispose(),N.dispose(),bt.dispose(),q.dispose(),q.removeEventListener("sessionstart",ic),q.removeEventListener("sessionend",sc),Gn.stop()};function K(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function mt(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let E=Lt.autoReset,O=vt.enabled,G=vt.autoUpdate,W=vt.needsUpdate,B=vt.type;dt(),Lt.autoReset=E,vt.enabled=O,vt.autoUpdate=G,vt.needsUpdate=W,vt.type=B}function ft(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function kt(E){let O=E.target;O.removeEventListener("dispose",kt),fe(O)}function fe(E){Te(E),_t.remove(E)}function Te(E){let O=_t.get(E).programs;O!==void 0&&(O.forEach(function(G){bt.releaseProgram(G)}),E.isShaderMaterial&&bt.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,G,W,B,ot){O===null&&(O=Gt);let pt=B.isMesh&&B.matrixWorld.determinant()<0,St=hu(E,O,G,W,B);lt.setMaterial(W,pt);let wt=G.index,Ot=1;if(W.wireframe===!0){if(wt=J.getWireframeAttribute(G),wt===void 0)return;Ot=2}let zt=G.drawRange,Et=G.attributes.position,jt=zt.start*Ot,re=(zt.start+zt.count)*Ot;ot!==null&&(jt=Math.max(jt,ot.start*Ot),re=Math.min(re,(ot.start+ot.count)*Ot)),wt!==null?(jt=Math.max(jt,0),re=Math.min(re,wt.count)):Et!=null&&(jt=Math.max(jt,0),re=Math.min(re,Et.count));let oe=re-jt;if(oe<0||oe===1/0)return;se.setup(B,W,St,G,wt);let Ne,Qt=Mt;if(wt!==null&&(Ne=$.get(wt),Qt=qt,Qt.setIndex(Ne)),B.isMesh)W.wireframe===!0?(lt.setLineWidth(W.wireframeLinewidth*it()),Qt.setMode(I.LINES)):Qt.setMode(I.TRIANGLES);else if(B.isLine){let Ct=W.linewidth;Ct===void 0&&(Ct=1),lt.setLineWidth(Ct*it()),B.isLineSegments?Qt.setMode(I.LINES):B.isLineLoop?Qt.setMode(I.LINE_LOOP):Qt.setMode(I.LINE_STRIP)}else B.isPoints?Qt.setMode(I.POINTS):B.isSprite&&Qt.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Qt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))Qt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let Ct=B._multiDrawStarts,gn=B._multiDrawCounts,te=B._multiDrawCount,Ke=wt?$.get(wt).bytesPerElement:1,mi=_t.get(W).currentProgram.getUniforms();for(let He=0;He<te;He++)mi.setValue(I,"_gl_DrawID",He),Qt.render(Ct[He]/Ke,gn[He])}else if(B.isInstancedMesh)Qt.renderInstances(jt,oe,B.count);else if(G.isInstancedBufferGeometry){let Ct=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,gn=Math.min(G.instanceCount,Ct);Qt.renderInstances(jt,oe,gn)}else Qt.render(jt,oe)};function ee(E,O,G){E.transparent===!0&&E.side===We&&E.forceSinglePass===!1?(E.side=Pe,E.needsUpdate=!0,Os(E,O,G),E.side=kn,E.needsUpdate=!0,Os(E,O,G),E.side=We):Os(E,O,G)}this.compile=function(E,O,G=null){G===null&&(G=E),p=Wt.get(G),p.init(O),b.push(p),G.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),E!==G&&E.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),p.setupLights();let W=new Set;return E.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let ot=B.material;if(ot)if(Array.isArray(ot))for(let pt=0;pt<ot.length;pt++){let St=ot[pt];ee(St,G,B),W.add(St)}else ee(ot,G,B),W.add(ot)}),b.pop(),p=null,W},this.compileAsync=function(E,O,G=null){let W=this.compile(E,O,G);return new Promise(B=>{function ot(){if(W.forEach(function(pt){_t.get(pt).currentProgram.isReady()&&W.delete(pt)}),W.size===0){B(E);return}setTimeout(ot,10)}et.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let je=null;function mn(E){je&&je(E)}function ic(){Gn.stop()}function sc(){Gn.start()}let Gn=new Vh;Gn.setAnimationLoop(mn),typeof self<"u"&&Gn.setContext(self),this.setAnimationLoop=function(E){je=E,q.setAnimationLoop(E),E===null?Gn.stop():Gn.start()},q.addEventListener("sessionstart",ic),q.addEventListener("sessionend",sc),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(O),O=q.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,O,M),p=Wt.get(E,b.length),p.init(O),b.push(p),Rt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),X.setFromProjectionMatrix(Rt),gt=this.localClippingEnabled,nt=st.init(this.clippingPlanes,gt),m=xt.get(E,w.length),m.init(),w.push(m),q.enabled===!0&&q.isPresenting===!0){let ot=v.xr.getDepthSensingMesh();ot!==null&&vo(ot,O,-1/0,v.sortObjects)}vo(E,O,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Q,rt),Z=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Z&&Dt.addToRenderList(m,E),this.info.render.frame++,nt===!0&&st.beginShadows();let G=p.state.shadowsArray;vt.render(G,E,O),nt===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=m.opaque,B=m.transmissive;if(p.setupLights(),O.isArrayCamera){let ot=O.cameras;if(B.length>0)for(let pt=0,St=ot.length;pt<St;pt++){let wt=ot[pt];oc(W,B,E,wt)}Z&&Dt.render(E);for(let pt=0,St=ot.length;pt<St;pt++){let wt=ot[pt];rc(m,E,wt,wt.viewport)}}else B.length>0&&oc(W,B,E,O),Z&&Dt.render(E),rc(m,E,O);M!==null&&(C.updateMultisampleRenderTarget(M),C.updateRenderTargetMipmap(M)),E.isScene===!0&&E.onAfterRender(v,E,O),se.resetDefaultState(),y=-1,x=null,b.pop(),b.length>0?(p=b[b.length-1],nt===!0&&st.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function vo(E,O,G,W){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||X.intersectsSprite(E)){W&&Pt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Rt);let pt=Y.update(E),St=E.material;St.visible&&m.push(E,pt,St,G,Pt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||X.intersectsObject(E))){let pt=Y.update(E),St=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pt.copy(E.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),Pt.copy(pt.boundingSphere.center)),Pt.applyMatrix4(E.matrixWorld).applyMatrix4(Rt)),Array.isArray(St)){let wt=pt.groups;for(let Ot=0,zt=wt.length;Ot<zt;Ot++){let Et=wt[Ot],jt=St[Et.materialIndex];jt&&jt.visible&&m.push(E,pt,jt,G,Pt.z,Et)}}else St.visible&&m.push(E,pt,St,G,Pt.z,null)}}let ot=E.children;for(let pt=0,St=ot.length;pt<St;pt++)vo(ot[pt],O,G,W)}function rc(E,O,G,W){let B=E.opaque,ot=E.transmissive,pt=E.transparent;p.setupLightsView(G),nt===!0&&st.setGlobalState(v.clippingPlanes,G),W&&lt.viewport(T.copy(W)),B.length>0&&Fs(B,O,G),ot.length>0&&Fs(ot,O,G),pt.length>0&&Fs(pt,O,G),lt.buffers.depth.setTest(!0),lt.buffers.depth.setMask(!0),lt.buffers.color.setMask(!0),lt.setPolygonOffset(!1)}function oc(E,O,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new Tn(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?Cs:rn,minFilter:ti,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));let ot=p.state.transmissionRenderTarget[W.id],pt=W.viewport||T;ot.setSize(pt.z,pt.w);let St=v.getRenderTarget();v.setRenderTarget(ot),v.getClearColor(U),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),Z&&Dt.render(G);let wt=v.toneMapping;v.toneMapping=Bn;let Ot=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),nt===!0&&st.setGlobalState(v.clippingPlanes,W),Fs(E,G,W),C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot),et.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Et=0,jt=O.length;Et<jt;Et++){let re=O[Et],oe=re.object,Ne=re.geometry,Qt=re.material,Ct=re.group;if(Qt.side===We&&oe.layers.test(W.layers)){let gn=Qt.side;Qt.side=Pe,Qt.needsUpdate=!0,ac(oe,G,W,Ne,Qt,Ct),Qt.side=gn,Qt.needsUpdate=!0,zt=!0}}zt===!0&&(C.updateMultisampleRenderTarget(ot),C.updateRenderTargetMipmap(ot))}v.setRenderTarget(St),v.setClearColor(U,k),Ot!==void 0&&(W.viewport=Ot),v.toneMapping=wt}function Fs(E,O,G){let W=O.isScene===!0?O.overrideMaterial:null;for(let B=0,ot=E.length;B<ot;B++){let pt=E[B],St=pt.object,wt=pt.geometry,Ot=W===null?pt.material:W,zt=pt.group;St.layers.test(G.layers)&&ac(St,O,G,wt,Ot,zt)}}function ac(E,O,G,W,B,ot){E.onBeforeRender(v,O,G,W,B,ot),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(v,O,G,W,E,ot),B.transparent===!0&&B.side===We&&B.forceSinglePass===!1?(B.side=Pe,B.needsUpdate=!0,v.renderBufferDirect(G,O,W,B,E,ot),B.side=kn,B.needsUpdate=!0,v.renderBufferDirect(G,O,W,B,E,ot),B.side=We):v.renderBufferDirect(G,O,W,B,E,ot),E.onAfterRender(v,O,G,W,B,ot)}function Os(E,O,G){O.isScene!==!0&&(O=Gt);let W=_t.get(E),B=p.state.lights,ot=p.state.shadowsArray,pt=B.state.version,St=bt.getParameters(E,B.state,ot,O,G),wt=bt.getProgramCacheKey(St),Ot=W.programs;W.environment=E.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(E.isMeshStandardMaterial?H:S).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Ot===void 0&&(E.addEventListener("dispose",kt),Ot=new Map,W.programs=Ot);let zt=Ot.get(wt);if(zt!==void 0){if(W.currentProgram===zt&&W.lightsStateVersion===pt)return cc(E,St),zt}else St.uniforms=bt.getUniforms(E),E.onBeforeCompile(St,v),zt=bt.acquireProgram(St,wt),Ot.set(wt,zt),W.uniforms=St.uniforms;let Et=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Et.clippingPlanes=st.uniform),cc(E,St),W.needsLights=du(E),W.lightsStateVersion=pt,W.needsLights&&(Et.ambientLightColor.value=B.state.ambient,Et.lightProbe.value=B.state.probe,Et.directionalLights.value=B.state.directional,Et.directionalLightShadows.value=B.state.directionalShadow,Et.spotLights.value=B.state.spot,Et.spotLightShadows.value=B.state.spotShadow,Et.rectAreaLights.value=B.state.rectArea,Et.ltc_1.value=B.state.rectAreaLTC1,Et.ltc_2.value=B.state.rectAreaLTC2,Et.pointLights.value=B.state.point,Et.pointLightShadows.value=B.state.pointShadow,Et.hemisphereLights.value=B.state.hemi,Et.directionalShadowMap.value=B.state.directionalShadowMap,Et.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Et.spotShadowMap.value=B.state.spotShadowMap,Et.spotLightMatrix.value=B.state.spotLightMatrix,Et.spotLightMap.value=B.state.spotLightMap,Et.pointShadowMap.value=B.state.pointShadowMap,Et.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=zt,W.uniformsList=null,zt}function lc(E){if(E.uniformsList===null){let O=E.currentProgram.getUniforms();E.uniformsList=Oi.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function cc(E,O){let G=_t.get(E);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function hu(E,O,G,W,B){O.isScene!==!0&&(O=Gt),C.resetTextureUnits();let ot=O.fog,pt=W.isMeshStandardMaterial?O.environment:null,St=M===null?v.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:ji,wt=(W.isMeshStandardMaterial?H:S).get(W.envMap||pt),Ot=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,zt=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Et=!!G.morphAttributes.position,jt=!!G.morphAttributes.normal,re=!!G.morphAttributes.color,oe=Bn;W.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(oe=v.toneMapping);let Ne=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Qt=Ne!==void 0?Ne.length:0,Ct=_t.get(W),gn=p.state.lights;if(nt===!0&&(gt===!0||E!==x)){let qe=E===x&&W.id===y;st.setState(W,E,qe)}let te=!1;W.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==gn.state.version||Ct.outputColorSpace!==St||B.isBatchedMesh&&Ct.batching===!1||!B.isBatchedMesh&&Ct.batching===!0||B.isBatchedMesh&&Ct.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ct.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ct.instancing===!1||!B.isInstancedMesh&&Ct.instancing===!0||B.isSkinnedMesh&&Ct.skinning===!1||!B.isSkinnedMesh&&Ct.skinning===!0||B.isInstancedMesh&&Ct.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ct.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ct.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ct.instancingMorph===!1&&B.morphTexture!==null||Ct.envMap!==wt||W.fog===!0&&Ct.fog!==ot||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==st.numPlanes||Ct.numIntersection!==st.numIntersection)||Ct.vertexAlphas!==Ot||Ct.vertexTangents!==zt||Ct.morphTargets!==Et||Ct.morphNormals!==jt||Ct.morphColors!==re||Ct.toneMapping!==oe||Ct.morphTargetsCount!==Qt)&&(te=!0):(te=!0,Ct.__version=W.version);let Ke=Ct.currentProgram;te===!0&&(Ke=Os(W,O,B));let mi=!1,He=!1,es=!1,ae=Ke.getUniforms(),ln=Ct.uniforms;if(lt.useProgram(Ke.program)&&(mi=!0,He=!0,es=!0),W.id!==y&&(y=W.id,He=!0),mi||x!==E){lt.buffers.depth.getReversed()?(at.copy(E.projectionMatrix),md(at),gd(at),ae.setValue(I,"projectionMatrix",at)):ae.setValue(I,"projectionMatrix",E.projectionMatrix),ae.setValue(I,"viewMatrix",E.matrixWorldInverse);let Rn=ae.map.cameraPosition;Rn!==void 0&&Rn.setValue(I,Tt.setFromMatrixPosition(E.matrixWorld)),yt.logarithmicDepthBuffer&&ae.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ae.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,He=!0,es=!0)}if(B.isSkinnedMesh){ae.setOptional(I,B,"bindMatrix"),ae.setOptional(I,B,"bindMatrixInverse");let qe=B.skeleton;qe&&(qe.boneTexture===null&&qe.computeBoneTexture(),ae.setValue(I,"boneTexture",qe.boneTexture,C))}B.isBatchedMesh&&(ae.setOptional(I,B,"batchingTexture"),ae.setValue(I,"batchingTexture",B._matricesTexture,C),ae.setOptional(I,B,"batchingIdTexture"),ae.setValue(I,"batchingIdTexture",B._indirectTexture,C),ae.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&ae.setValue(I,"batchingColorTexture",B._colorsTexture,C));let ns=G.morphAttributes;if((ns.position!==void 0||ns.normal!==void 0||ns.color!==void 0)&&Ft.update(B,G,Ke),(He||Ct.receiveShadow!==B.receiveShadow)&&(Ct.receiveShadow=B.receiveShadow,ae.setValue(I,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(ln.envMap.value=wt,ln.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(ln.envMapIntensity.value=O.environmentIntensity),He&&(ae.setValue(I,"toneMappingExposure",v.toneMappingExposure),Ct.needsLights&&uu(ln,es),ot&&W.fog===!0&&ht.refreshFogUniforms(ln,ot),ht.refreshMaterialUniforms(ln,W,V,j,p.state.transmissionRenderTarget[E.id]),Oi.upload(I,lc(Ct),ln,C)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Oi.upload(I,lc(Ct),ln,C),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ae.setValue(I,"center",B.center),ae.setValue(I,"modelViewMatrix",B.modelViewMatrix),ae.setValue(I,"normalMatrix",B.normalMatrix),ae.setValue(I,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let qe=W.uniformsGroups;for(let Rn=0,Cn=qe.length;Rn<Cn;Rn++){let hc=qe[Rn];N.update(hc,Ke),N.bind(hc,Ke)}}return Ke}function uu(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function du(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(E,O,G){_t.get(E.texture).__webglTexture=O,_t.get(E.depthTexture).__webglTexture=G;let W=_t.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){let G=_t.get(E);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,G=0){M=E,P=O,A=G;let W=!0,B=null,ot=!1,pt=!1;if(E){let wt=_t.get(E);if(wt.__useDefaultFramebuffer!==void 0)lt.bindFramebuffer(I.FRAMEBUFFER,null),W=!1;else if(wt.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(wt.__hasExternalTextures)C.rebindTextures(E,_t.get(E.texture).__webglTexture,_t.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Et=E.depthTexture;if(wt.__boundDepthTexture!==Et){if(Et!==null&&_t.has(Et)&&(E.width!==Et.image.width||E.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}let Ot=E.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(pt=!0);let zt=_t.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(zt[O])?B=zt[O][G]:B=zt[O],ot=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?B=_t.get(E).__webglMultisampledFramebuffer:Array.isArray(zt)?B=zt[G]:B=zt,T.copy(E.viewport),F.copy(E.scissor),D=E.scissorTest}else T.copy(ut).multiplyScalar(V).floor(),F.copy(Ut).multiplyScalar(V).floor(),D=Zt;if(lt.bindFramebuffer(I.FRAMEBUFFER,B)&&W&&lt.drawBuffers(E,B),lt.viewport(T),lt.scissor(F),lt.setScissorTest(D),ot){let wt=_t.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,wt.__webglTexture,G)}else if(pt){let wt=_t.get(E.texture),Ot=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,wt.__webglTexture,G||0,Ot)}y=-1},this.readRenderTargetPixels=function(E,O,G,W,B,ot,pt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=_t.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(St=St[pt]),St){lt.bindFramebuffer(I.FRAMEBUFFER,St);try{let wt=E.texture,Ot=wt.format,zt=wt.type;if(!yt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-W&&G>=0&&G<=E.height-B&&I.readPixels(O,G,W,B,Ht.convert(Ot),Ht.convert(zt),ot)}finally{let wt=M!==null?_t.get(M).__webglFramebuffer:null;lt.bindFramebuffer(I.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(E,O,G,W,B,ot,pt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=_t.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pt!==void 0&&(St=St[pt]),St){let wt=E.texture,Ot=wt.format,zt=wt.type;if(!yt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-W&&G>=0&&G<=E.height-B){lt.bindFramebuffer(I.FRAMEBUFFER,St);let Et=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.bufferData(I.PIXEL_PACK_BUFFER,ot.byteLength,I.STREAM_READ),I.readPixels(O,G,W,B,Ht.convert(Ot),Ht.convert(zt),0);let jt=M!==null?_t.get(M).__webglFramebuffer:null;lt.bindFramebuffer(I.FRAMEBUFFER,jt);let re=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await pd(I,re,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ot),I.deleteBuffer(Et),I.deleteSync(re),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,G=0){E.isTexture!==!0&&(cs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);let W=Math.pow(2,-G),B=Math.floor(E.image.width*W),ot=Math.floor(E.image.height*W),pt=O!==null?O.x:0,St=O!==null?O.y:0;C.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,pt,St,B,ot),lt.unbindTexture()},this.copyTextureToTexture=function(E,O,G=null,W=null,B=0){E.isTexture!==!0&&(cs("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],O=arguments[2],B=arguments[3]||0,G=null);let ot,pt,St,wt,Ot,zt,Et,jt,re,oe=E.isCompressedTexture?E.mipmaps[B]:E.image;G!==null?(ot=G.max.x-G.min.x,pt=G.max.y-G.min.y,St=G.isBox3?G.max.z-G.min.z:1,wt=G.min.x,Ot=G.min.y,zt=G.isBox3?G.min.z:0):(ot=oe.width,pt=oe.height,St=oe.depth||1,wt=0,Ot=0,zt=0),W!==null?(Et=W.x,jt=W.y,re=W.z):(Et=0,jt=0,re=0);let Ne=Ht.convert(O.format),Qt=Ht.convert(O.type),Ct;O.isData3DTexture?(C.setTexture3D(O,0),Ct=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(C.setTexture2DArray(O,0),Ct=I.TEXTURE_2D_ARRAY):(C.setTexture2D(O,0),Ct=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);let gn=I.getParameter(I.UNPACK_ROW_LENGTH),te=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ke=I.getParameter(I.UNPACK_SKIP_PIXELS),mi=I.getParameter(I.UNPACK_SKIP_ROWS),He=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,oe.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,oe.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,wt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ot),I.pixelStorei(I.UNPACK_SKIP_IMAGES,zt);let es=E.isDataArrayTexture||E.isData3DTexture,ae=O.isDataArrayTexture||O.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let ln=_t.get(E),ns=_t.get(O),qe=_t.get(ln.__renderTarget),Rn=_t.get(ns.__renderTarget);lt.bindFramebuffer(I.READ_FRAMEBUFFER,qe.__webglFramebuffer),lt.bindFramebuffer(I.DRAW_FRAMEBUFFER,Rn.__webglFramebuffer);for(let Cn=0;Cn<St;Cn++)es&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_t.get(E).__webglTexture,B,zt+Cn),E.isDepthTexture?(ae&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_t.get(O).__webglTexture,B,re+Cn),I.blitFramebuffer(wt,Ot,ot,pt,Et,jt,ot,pt,I.DEPTH_BUFFER_BIT,I.NEAREST)):ae?I.copyTexSubImage3D(Ct,B,Et,jt,re+Cn,wt,Ot,ot,pt):I.copyTexSubImage2D(Ct,B,Et,jt,re+Cn,wt,Ot,ot,pt);lt.bindFramebuffer(I.READ_FRAMEBUFFER,null),lt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ae?E.isDataTexture||E.isData3DTexture?I.texSubImage3D(Ct,B,Et,jt,re,ot,pt,St,Ne,Qt,oe.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(Ct,B,Et,jt,re,ot,pt,St,Ne,oe.data):I.texSubImage3D(Ct,B,Et,jt,re,ot,pt,St,Ne,Qt,oe):E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,B,Et,jt,ot,pt,Ne,Qt,oe.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,B,Et,jt,oe.width,oe.height,Ne,oe.data):I.texSubImage2D(I.TEXTURE_2D,B,Et,jt,ot,pt,Ne,Qt,oe);I.pixelStorei(I.UNPACK_ROW_LENGTH,gn),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,te),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ke),I.pixelStorei(I.UNPACK_SKIP_ROWS,mi),I.pixelStorei(I.UNPACK_SKIP_IMAGES,He),B===0&&O.generateMipmaps&&I.generateMipmap(Ct),lt.unbindTexture()},this.copyTextureToTexture3D=function(E,O,G=null,W=null,B=0){return E.isTexture!==!0&&(cs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,E=arguments[2],O=arguments[3],B=arguments[4]||0),cs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,O,G,W,B)},this.initRenderTarget=function(E){_t.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),lt.unbindTexture()},this.resetState=function(){P=0,A=0,M=null,lt.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorspace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}};var qi=class extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var bs=class extends Fe{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Ie,h=Ie,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var fn=class extends zn{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Lr=new R,Dr=new R,dh=new Xt,as=new ii,rr=new Gi,Zo=new R,fh=new R,nl=class extends be{constructor(t=new ue,e=new fn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Lr.fromBufferAttribute(e,s-1),Dr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Lr.distanceTo(Dr);t.setAttribute("lineDistance",new pe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,t.ray.intersectsSphere(rr)===!1)return;dh.copy(s).invert(),as.copy(t.ray).applyMatrix4(dh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=h.getX(_),w=h.getX(_+1),b=or(this,t,as,l,p,w);b&&e.push(b)}if(this.isLineLoop){let _=h.getX(g-1),m=h.getX(f),p=or(this,t,as,l,_,m);p&&e.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=or(this,t,as,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){let _=or(this,t,as,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function or(i,t,e,n,s,r){let o=i.geometry.attributes.position;if(Lr.fromBufferAttribute(o,s),Dr.fromBufferAttribute(o,r),e.distanceSqToSegment(Lr,Dr,Zo,fh)>n)return;Zo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Zo);if(!(l<t.near||l>t.far))return{distance:l,point:fh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var ph=new R,mh=new R,on=class extends nl{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)ph.fromBufferAttribute(e,s),mh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ph.distanceTo(mh);t.setAttribute("lineDistance",new pe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Ur=class extends Fe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ze=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new tt:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new R,s=[],r=[],o=[],a=new R,l=new Xt;for(let f=0;f<=t;f++){let g=f/t;s[f]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ge(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ge(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Ss=class extends Ze{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new tt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},il=class extends Ss{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ol(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var ar=new R,jo=new Ol,Ko=new Ol,Jo=new Ol,sl=class extends Ze{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(ar.subVectors(s[0],s[1]).add(s[0]),c=ar);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ar.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ar),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),jo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Ko.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Jo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Ko.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Jo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(jo.calc(l),Ko.calc(l),Jo.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function gh(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function u0(i,t){let e=1-i;return e*e*t}function d0(i,t){return 2*(1-i)*i*t}function f0(i,t){return i*i*t}function fs(i,t,e,n){return u0(i,t)+d0(i,e)+f0(i,n)}function p0(i,t){let e=1-i;return e*e*e*t}function m0(i,t){let e=1-i;return 3*e*e*i*t}function g0(i,t){return 3*(1-i)*i*i*t}function _0(i,t){return i*i*i*t}function ps(i,t,e,n,s){return p0(i,t)+m0(i,e)+g0(i,n)+_0(i,s)}var Nr=class extends Ze{constructor(t=new tt,e=new tt,n=new tt,s=new tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new tt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ps(t,s.x,r.x,o.x,a.x),ps(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},rl=class extends Ze{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ps(t,s.x,r.x,o.x,a.x),ps(t,s.y,r.y,o.y,a.y),ps(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Fr=class extends Ze{constructor(t=new tt,e=new tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new tt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ol=class extends Ze{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Or=class extends Ze{constructor(t=new tt,e=new tt,n=new tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new tt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(fs(t,s.x,r.x,o.x),fs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},al=class extends Ze{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(fs(t,s.x,r.x,o.x),fs(t,s.y,r.y,o.y),fs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Br=class extends Ze{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new tt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(gh(a,l.x,c.x,h.x,u.x),gh(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new tt().fromArray(s))}return this}},ll=Object.freeze({__proto__:null,ArcCurve:il,CatmullRomCurve3:sl,CubicBezierCurve:Nr,CubicBezierCurve3:rl,EllipseCurve:Ss,LineCurve:Fr,LineCurve3:ol,QuadraticBezierCurve:Or,QuadraticBezierCurve3:al,SplineCurve:Br}),cl=class extends Ze{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ll[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new ll[s.type]().fromJSON(s))}return this}},kr=class extends cl{constructor(t){super(),this.type="Path",this.currentPoint=new tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Fr(this.currentPoint.clone(),new tt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Or(this.currentPoint.clone(),new tt(t,e),new tt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Nr(this.currentPoint.clone(),new tt(t,e),new tt(n,s),new tt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Br(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new Ss(t,e,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},zr=class i extends ue{constructor(t=[new tt(0,-.5),new tt(.5,0),new tt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=ge(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new R,d=new tt,f=new R,g=new R,_=new R,m=0,p=0;for(let w=0;w<=t.length-1;w++)switch(w){case 0:m=t[w+1].x-t[w].x,p=t[w+1].y-t[w].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[w+1].x-t[w].x,p=t[w+1].y-t[w].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let w=0;w<=e;w++){let b=n+w*h*s,v=Math.sin(b),L=Math.cos(b);for(let P=0;P<=t.length-1;P++){u.x=t[P].x*v,u.y=t[P].y,u.z=t[P].x*L,o.push(u.x,u.y,u.z),d.x=w/e,d.y=P/(t.length-1),a.push(d.x,d.y);let A=l[3*P+0]*v,M=l[3*P+1],y=l[3*P+0]*L;c.push(A,M,y)}}for(let w=0;w<e;w++)for(let b=0;b<t.length-1;b++){let v=b+w*t.length,L=v,P=v+t.length,A=v+t.length+1,M=v+1;r.push(L,P,M),r.push(A,M,P)}this.setIndex(r),this.setAttribute("position",new pe(o,3)),this.setAttribute("uv",new pe(a,2)),this.setAttribute("normal",new pe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var ye=class i extends ue{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,_=[],m=n/2,p=0;w(),o===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new pe(u,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(f,2));function w(){let v=new R,L=new R,P=0,A=(e-t)/n;for(let M=0;M<=r;M++){let y=[],x=M/r,T=x*(e-t)+t;for(let F=0;F<=s;F++){let D=F/s,U=D*l+a,k=Math.sin(U),z=Math.cos(U);L.x=T*k,L.y=-x*n+m,L.z=T*z,u.push(L.x,L.y,L.z),v.set(k,A,z).normalize(),d.push(v.x,v.y,v.z),f.push(D,1-x),y.push(g++)}_.push(y)}for(let M=0;M<s;M++)for(let y=0;y<r;y++){let x=_[y][M],T=_[y+1][M],F=_[y+1][M+1],D=_[y][M+1];(t>0||y!==0)&&(h.push(x,T,D),P+=3),(e>0||y!==r-1)&&(h.push(T,F,D),P+=3)}c.addGroup(p,P,0),p+=P}function b(v){let L=g,P=new tt,A=new R,M=0,y=v===!0?t:e,x=v===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*x,0),d.push(0,x,0),f.push(.5,.5),g++;let T=g;for(let F=0;F<=s;F++){let U=F/s*l+a,k=Math.cos(U),z=Math.sin(U);A.x=y*z,A.y=m*x,A.z=y*k,u.push(A.x,A.y,A.z),d.push(0,x,0),P.x=k*.5+.5,P.y=z*.5*x+.5,f.push(P.x,P.y),g++}for(let F=0;F<s;F++){let D=L+F,U=T+F;v===!0?h.push(U,U+1,D):h.push(U+1,U,D),M+=3}c.addGroup(p,M,v===!0?1:2),p+=M}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Hr=class i extends ye{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var lr=new R,cr=new R,Qo=new R,hr=new hn,Hn=class extends ue{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(Ni*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:m,c:p}=hr;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),hr.getNormal(Qo),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let w=0;w<3;w++){let b=(w+1)%3,v=u[w],L=u[b],P=hr[h[w]],A=hr[h[b]],M=`${v}_${L}`,y=`${L}_${v}`;y in d&&d[y]?(Qo.dot(d[y].normal)<=r&&(f.push(P.x,P.y,P.z),f.push(A.x,A.y,A.z)),d[y]=null):M in d||(d[M]={index0:c[w],index1:c[b],normal:Qo.clone()})}}for(let g in d)if(d[g]){let{index0:_,index1:m}=d[g];lr.fromBufferAttribute(a,_),cr.fromBufferAttribute(a,m),f.push(lr.x,lr.y,lr.z),f.push(cr.x,cr.y,cr.z)}this.setAttribute("position",new pe(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},$i=class extends kr{constructor(t){super(t),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new kr().fromJSON(s))}return this}},x0={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=$h(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=S0(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return ws(r,o,e,a,l,f,0),o}};function $h(i,t,e,n,s){let r,o;if(s===U0(i,t,e,n)>0)for(r=t;r<e;r+=n)o=_h(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=_h(r,i[r],i[r+1],o);return o&&to(o,o.next)&&(Ts(o),o=o.next),o}function si(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(to(e,e.next)||de(e.prev,e,e.next)===0)){if(Ts(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ws(i,t,e,n,s,r,o){if(!i)return;!o&&r&&R0(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?v0(i,n,s,r):y0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Ts(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=M0(si(i),t,e),ws(i,t,e,n,s,r,2)):o===2&&b0(i,t,e,n,s,r):ws(si(i),t,e,n,s,r,1);break}}}function y0(i){let t=i.prev,e=i,n=i.next;if(de(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Li(s,a,r,l,o,c,g.x,g.y)&&de(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function v0(i,t,e,n){let s=i.prev,r=i,o=i.next;if(de(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=hl(f,g,t,e,n),w=hl(_,m,t,e,n),b=i.prevZ,v=i.nextZ;for(;b&&b.z>=p&&v&&v.z<=w;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==o&&Li(a,h,l,u,c,d,b.x,b.y)&&de(b.prev,b,b.next)>=0||(b=b.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Li(a,h,l,u,c,d,v.x,v.y)&&de(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==o&&Li(a,h,l,u,c,d,b.x,b.y)&&de(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;v&&v.z<=w;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Li(a,h,l,u,c,d,v.x,v.y)&&de(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function M0(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!to(s,r)&&Yh(s,n,n.next,r)&&Es(s,r)&&Es(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Ts(n),Ts(n.next),n=i=r),n=n.next}while(n!==i);return si(n)}function b0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&I0(o,a)){let l=Zh(o,a);o=si(o,o.next),l=si(l,l.next),ws(o,t,e,n,s,r,0),ws(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function S0(i,t,e,n){let s=[],r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=$h(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(P0(c));for(s.sort(w0),r=0;r<s.length;r++)e=E0(s[r],e);return e}function w0(i,t){return i.x-t.x}function E0(i,t){let e=T0(i,t);if(!e)return t;let n=Zh(e,i);return si(n,n.next),si(e,e.next)}function T0(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Li(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Es(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&A0(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function A0(i,t){return de(i.prev,i,t.prev)<0&&de(t.next,i,i.next)<0}function R0(i,t,e,n){let s=i;do s.z===0&&(s.z=hl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,C0(s)}function C0(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function hl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function P0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Li(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function I0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!L0(i,t)&&(Es(i,t)&&Es(t,i)&&D0(i,t)&&(de(i.prev,i,t.prev)||de(i,t.prev,t))||to(i,t)&&de(i.prev,i,i.next)>0&&de(t.prev,t,t.next)>0)}function de(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function to(i,t){return i.x===t.x&&i.y===t.y}function Yh(i,t,e,n){let s=dr(de(i,t,e)),r=dr(de(i,t,n)),o=dr(de(e,n,i)),a=dr(de(e,n,t));return!!(s!==r&&o!==a||s===0&&ur(i,e,t)||r===0&&ur(i,n,t)||o===0&&ur(e,i,n)||a===0&&ur(e,t,n))}function ur(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function dr(i){return i>0?1:i<0?-1:0}function L0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Yh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Es(i,t){return de(i.prev,i,i.next)<0?de(i,t,i.next)>=0&&de(i,i.prev,t)>=0:de(i,t,i.prev)<0||de(i,i.next,t)<0}function D0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Zh(i,t){let e=new ul(i.i,i.x,i.y),n=new ul(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function _h(i,t,e,n){let s=new ul(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ts(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ul(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function U0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var ms=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];xh(t),yh(n,t);let o=t.length;e.forEach(xh);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,yh(n,e[l]);let a=x0.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function xh(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function yh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Vr=class i extends ue{constructor(t=new $i([new tt(.5,.5),new tt(-.5,.5),new tt(-.5,-.5),new tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new pe(s,3)),this.setAttribute("uv",new pe(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,w=e.UVGenerator!==void 0?e.UVGenerator:N0,b,v=!1,L,P,A,M;p&&(b=p.getSpacedPoints(h),v=!0,d=!1,L=p.computeFrenetFrames(h,!1),P=new R,A=new R,M=new R),d||(m=0,f=0,g=0,_=0);let y=a.extractPoints(c),x=y.shape,T=y.holes;if(!ms.isClockWise(x)){x=x.reverse();for(let Z=0,it=T.length;Z<it;Z++){let I=T[Z];ms.isClockWise(I)&&(T[Z]=I.reverse())}}let D=ms.triangulateShape(x,T),U=x;for(let Z=0,it=T.length;Z<it;Z++){let I=T[Z];x=x.concat(I)}function k(Z,it,I){return it||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(it,I)}let z=x.length,j=D.length;function V(Z,it,I){let At,et,yt,lt=Z.x-it.x,Lt=Z.y-it.y,_t=I.x-Z.x,C=I.y-Z.y,S=lt*lt+Lt*Lt,H=lt*C-Lt*_t;if(Math.abs(H)>Number.EPSILON){let $=Math.sqrt(S),J=Math.sqrt(_t*_t+C*C),Y=it.x-Lt/$,bt=it.y+lt/$,ht=I.x-C/J,xt=I.y+_t/J,Wt=((ht-Y)*C-(xt-bt)*_t)/(lt*C-Lt*_t);At=Y+lt*Wt-Z.x,et=bt+Lt*Wt-Z.y;let st=At*At+et*et;if(st<=2)return new tt(At,et);yt=Math.sqrt(st/2)}else{let $=!1;lt>Number.EPSILON?_t>Number.EPSILON&&($=!0):lt<-Number.EPSILON?_t<-Number.EPSILON&&($=!0):Math.sign(Lt)===Math.sign(C)&&($=!0),$?(At=-Lt,et=lt,yt=Math.sqrt(S)):(At=lt,et=Lt,yt=Math.sqrt(S/2))}return new tt(At/yt,et/yt)}let Q=[];for(let Z=0,it=U.length,I=it-1,At=Z+1;Z<it;Z++,I++,At++)I===it&&(I=0),At===it&&(At=0),Q[Z]=V(U[Z],U[I],U[At]);let rt=[],ut,Ut=Q.concat();for(let Z=0,it=T.length;Z<it;Z++){let I=T[Z];ut=[];for(let At=0,et=I.length,yt=et-1,lt=At+1;At<et;At++,yt++,lt++)yt===et&&(yt=0),lt===et&&(lt=0),ut[At]=V(I[At],I[yt],I[lt]);rt.push(ut),Ut=Ut.concat(ut)}for(let Z=0;Z<m;Z++){let it=Z/m,I=f*Math.cos(it*Math.PI/2),At=g*Math.sin(it*Math.PI/2)+_;for(let et=0,yt=U.length;et<yt;et++){let lt=k(U[et],Q[et],At);at(lt.x,lt.y,-I)}for(let et=0,yt=T.length;et<yt;et++){let lt=T[et];ut=rt[et];for(let Lt=0,_t=lt.length;Lt<_t;Lt++){let C=k(lt[Lt],ut[Lt],At);at(C.x,C.y,-I)}}}let Zt=g+_;for(let Z=0;Z<z;Z++){let it=d?k(x[Z],Ut[Z],Zt):x[Z];v?(A.copy(L.normals[0]).multiplyScalar(it.x),P.copy(L.binormals[0]).multiplyScalar(it.y),M.copy(b[0]).add(A).add(P),at(M.x,M.y,M.z)):at(it.x,it.y,0)}for(let Z=1;Z<=h;Z++)for(let it=0;it<z;it++){let I=d?k(x[it],Ut[it],Zt):x[it];v?(A.copy(L.normals[Z]).multiplyScalar(I.x),P.copy(L.binormals[Z]).multiplyScalar(I.y),M.copy(b[Z]).add(A).add(P),at(M.x,M.y,M.z)):at(I.x,I.y,u/h*Z)}for(let Z=m-1;Z>=0;Z--){let it=Z/m,I=f*Math.cos(it*Math.PI/2),At=g*Math.sin(it*Math.PI/2)+_;for(let et=0,yt=U.length;et<yt;et++){let lt=k(U[et],Q[et],At);at(lt.x,lt.y,u+I)}for(let et=0,yt=T.length;et<yt;et++){let lt=T[et];ut=rt[et];for(let Lt=0,_t=lt.length;Lt<_t;Lt++){let C=k(lt[Lt],ut[Lt],At);v?at(C.x,C.y+b[h-1].y,b[h-1].x+I):at(C.x,C.y,u+I)}}}X(),nt();function X(){let Z=s.length/3;if(d){let it=0,I=z*it;for(let At=0;At<j;At++){let et=D[At];Rt(et[2]+I,et[1]+I,et[0]+I)}it=h+m*2,I=z*it;for(let At=0;At<j;At++){let et=D[At];Rt(et[0]+I,et[1]+I,et[2]+I)}}else{for(let it=0;it<j;it++){let I=D[it];Rt(I[2],I[1],I[0])}for(let it=0;it<j;it++){let I=D[it];Rt(I[0]+z*h,I[1]+z*h,I[2]+z*h)}}n.addGroup(Z,s.length/3-Z,0)}function nt(){let Z=s.length/3,it=0;gt(U,it),it+=U.length;for(let I=0,At=T.length;I<At;I++){let et=T[I];gt(et,it),it+=et.length}n.addGroup(Z,s.length/3-Z,1)}function gt(Z,it){let I=Z.length;for(;--I>=0;){let At=I,et=I-1;et<0&&(et=Z.length-1);for(let yt=0,lt=h+m*2;yt<lt;yt++){let Lt=z*yt,_t=z*(yt+1),C=it+At+Lt,S=it+et+Lt,H=it+et+_t,$=it+At+_t;Tt(C,S,H,$)}}}function at(Z,it,I){l.push(Z),l.push(it),l.push(I)}function Rt(Z,it,I){Pt(Z),Pt(it),Pt(I);let At=s.length/3,et=w.generateTopUV(n,s,At-3,At-2,At-1);Gt(et[0]),Gt(et[1]),Gt(et[2])}function Tt(Z,it,I,At){Pt(Z),Pt(it),Pt(At),Pt(it),Pt(I),Pt(At);let et=s.length/3,yt=w.generateSideWallUV(n,s,et-6,et-3,et-2,et-1);Gt(yt[0]),Gt(yt[1]),Gt(yt[3]),Gt(yt[1]),Gt(yt[2]),Gt(yt[3])}function Pt(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function Gt(Z){r.push(Z.x),r.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return F0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ll[s.type]().fromJSON(s)),new i(n,t.options)}},N0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new tt(r,o),new tt(a,l),new tt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new tt(o,1-l),new tt(c,1-u),new tt(d,1-g),new tt(_,1-p)]:[new tt(a,1-l),new tt(h,1-u),new tt(f,1-g),new tt(m,1-p)]}};function F0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var $t=class extends zn{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fh,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function fr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function O0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Yi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},dl=class extends Yi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:mc,endingEnd:mc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case gc:r=t,a=2*e-n;break;case _c:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case gc:o=t,l=2*n-e;break;case _c:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,w=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,b=(-1-f)*m+(1.5+f)*_+.5*g,v=f*m-f*_;for(let L=0;L!==a;++L)r[L]=p*o[h+L]+w*o[c+L]+b*o[l+L]+v*o[u+L];return r}},fl=class extends Yi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},pl=class extends Yi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},an=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=fr(e,this.TimeBufferType),this.values=fr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:fr(t.times,Array),values:fr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new pl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new fl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new dl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case yr:e=this.InterpolantFactoryMethodDiscrete;break;case za:e=this.InterpolantFactoryMethodLinear;break;case bo:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yr;case this.InterpolantFactoryMethodLinear:return za;case this.InterpolantFactoryMethodSmooth:return bo}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&O0(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===bo,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};an.prototype.TimeBufferType=Float32Array;an.prototype.ValueBufferType=Float32Array;an.prototype.DefaultInterpolation=za;var ri=class extends an{constructor(t,e,n){super(t,e,n)}};ri.prototype.ValueTypeName="bool";ri.prototype.ValueBufferType=Array;ri.prototype.DefaultInterpolation=yr;ri.prototype.InterpolantFactoryMethodLinear=void 0;ri.prototype.InterpolantFactoryMethodSmooth=void 0;var ml=class extends an{};ml.prototype.ValueTypeName="color";var gl=class extends an{};gl.prototype.ValueTypeName="number";var _l=class extends Yi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Ee.slerpFlat(r,0,o,c-a,o,c,l);return r}},Gr=class extends an{InterpolantFactoryMethodLinear(t){return new _l(this.times,this.values,this.getValueSize(),t)}};Gr.prototype.ValueTypeName="quaternion";Gr.prototype.InterpolantFactoryMethodSmooth=void 0;var oi=class extends an{constructor(t,e,n){super(t,e,n)}};oi.prototype.ValueTypeName="string";oi.prototype.ValueBufferType=Array;oi.prototype.DefaultInterpolation=yr;oi.prototype.InterpolantFactoryMethodLinear=void 0;oi.prototype.InterpolantFactoryMethodSmooth=void 0;var xl=class extends an{};xl.prototype.ValueTypeName="vector";var yl=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},B0=new yl,vl=class{constructor(t){this.manager=t!==void 0?t:B0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};vl.DEFAULT_MATERIAL_NAME="__DEFAULT";var As=class extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Wr=class extends As{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ta=new Xt,vh=new R,Mh=new R,Xr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new Xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vs,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new Jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;vh.setFromMatrixPosition(t.matrixWorld),e.position.copy(vh),Mh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Mh),e.updateMatrixWorld(),ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ta),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var bh=new Xt,ls=new R,ea=new R,Ml=class extends Xr{constructor(){super(new Ce(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new Jt(2,1,1,1),new Jt(0,1,1,1),new Jt(3,1,1,1),new Jt(1,1,1,1),new Jt(3,0,1,1),new Jt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ls.setFromMatrixPosition(t.matrixWorld),n.position.copy(ls),ea.copy(n.position),ea.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ea),n.updateMatrixWorld(),s.makeTranslation(-ls.x,-ls.y,-ls.z),bh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bh)}},qr=class extends As{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ml}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},bl=class extends Xr{constructor(){super(new Cr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},$r=class extends As{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new bl}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Bl="\\[\\]\\.:\\/",k0=new RegExp("["+Bl+"]","g"),kl="[^"+Bl+"]",z0="[^"+Bl.replace("\\.","")+"]",H0=/((?:WC+[\/:])*)/.source.replace("WC",kl),V0=/(WCOD+)?/.source.replace("WCOD",z0),G0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kl),W0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kl),X0=new RegExp("^"+H0+V0+G0+W0+"$"),q0=["material","materials","bones","map"],Sl=class{constructor(t,e,n){let s=n||le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},le=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(k0,"")}static parseTrackName(t){let e=X0.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);q0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};le.Composite=Sl;le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};le.prototype.GetterByBindingType=[le.prototype._getValue_direct,le.prototype._getValue_array,le.prototype._getValue_arrayElement,le.prototype._getValue_toArray];le.prototype.SetterByBindingTypeAndVersioning=[[le.prototype._setValue_direct,le.prototype._setValue_direct_setNeedsUpdate,le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[le.prototype._setValue_array,le.prototype._setValue_array_setNeedsUpdate,le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[le.prototype._setValue_arrayElement,le.prototype._setValue_arrayElement_setNeedsUpdate,le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[le.prototype._setValue_fromArray,le.prototype._setValue_fromArray_setNeedsUpdate,le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var B_=new Float32Array(1);var Sh=new Xt,Zi=class{constructor(t,e,n=0,s=1/0){this.ray=new ii(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ys,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Sh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Sh),this}intersectObject(t,e=!0,n=[]){return wl(t,this,n,e),n.sort(wh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)wl(t[s],this,n,e);return n.sort(wh),n}};function wh(i,t){return i.distance-t.distance}function wl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)wl(r[o],t,e,!0)}}var Rs=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ge(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Yr=class extends En{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:El}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=El);var jh={type:"change"},Hl={type:"start"},Jh={type:"end"},eo=new ii,Kh=new en,$0=Math.cos(70*Bh.DEG2RAD),ve=new R,Oe=2*Math.PI,ie={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},zl=1e-6,no=class extends Yr{constructor(t,e=null){super(t,e),this.state=ie.NONE,this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ai.ROTATE,MIDDLE:ai.DOLLY,RIGHT:ai.PAN},this.touches={ONE:li.ROTATE,TWO:li.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new Ee,this._lastTargetPosition=new R,this._quat=new Ee().setFromUnitVectors(t.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Rs,this._sphericalDelta=new Rs,this._scale=1,this._panOffset=new R,this._rotateStart=new tt,this._rotateEnd=new tt,this._rotateDelta=new tt,this._panStart=new tt,this._panEnd=new tt,this._panDelta=new tt,this._dollyStart=new tt,this._dollyEnd=new tt,this._dollyDelta=new tt,this._dollyDirection=new R,this._mouse=new tt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Z0.bind(this),this._onPointerDown=Y0.bind(this),this._onPointerUp=j0.bind(this),this._onContextMenu=i_.bind(this),this._onMouseWheel=Q0.bind(this),this._onKeyDown=t_.bind(this),this._onTouchStart=e_.bind(this),this._onTouchMove=n_.bind(this),this._onMouseDown=K0.bind(this),this._onMouseMove=J0.bind(this),this._interceptControlDown=s_.bind(this),this._interceptControlUp=r_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(jh),this.update(),this.state=ie.NONE}update(t=null){let e=this.object.position;ve.copy(e).sub(this.target),ve.applyQuaternion(this._quat),this._spherical.setFromVector3(ve),this.autoRotate&&this.state===ie.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Oe:n>Math.PI&&(n-=Oe),s<-Math.PI?s+=Oe:s>Math.PI&&(s-=Oe),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ve.setFromSpherical(this._spherical),ve.applyQuaternion(this._quatInverse),e.copy(this.target).add(ve),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=ve.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new R(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=ve.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(eo.origin.copy(this.object.position),eo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(eo.direction))<$0?this.object.lookAt(this.target):(Kh.setFromNormalAndCoplanarPoint(this.object.up,this.target),eo.intersectPlane(Kh,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>zl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>zl||this._lastTargetPosition.distanceToSquared(this.target)>zl?(this.dispatchEvent(jh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Oe/60*this.autoRotateSpeed*t:Oe/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ve.setFromMatrixColumn(e,0),ve.multiplyScalar(-t),this._panOffset.add(ve)}_panUp(t,e){this.screenSpacePanning===!0?ve.setFromMatrixColumn(e,1):(ve.setFromMatrixColumn(e,0),ve.crossVectors(this.object.up,ve)),ve.multiplyScalar(t),this._panOffset.add(ve)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;ve.copy(s).sub(this.target);let r=ve.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Oe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Oe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(Oe*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-Oe*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(Oe*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-Oe*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Oe*this._rotateDelta.x/e.clientHeight),this._rotateUp(Oe*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new tt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Y0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Z0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function j0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Jh),this.state=ie.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function K0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case ai.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ie.DOLLY;break;case ai.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ie.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ie.ROTATE}break;case ai.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ie.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ie.PAN}break;default:this.state=ie.NONE}this.state!==ie.NONE&&this.dispatchEvent(Hl)}function J0(i){switch(this.state){case ie.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ie.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ie.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Q0(i){this.enabled===!1||this.enableZoom===!1||this.state!==ie.NONE||(i.preventDefault(),this.dispatchEvent(Hl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Jh))}function t_(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function e_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case li.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ie.TOUCH_ROTATE;break;case li.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ie.TOUCH_PAN;break;default:this.state=ie.NONE}break;case 2:switch(this.touches.TWO){case li.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ie.TOUCH_DOLLY_PAN;break;case li.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ie.TOUCH_DOLLY_ROTATE;break;default:this.state=ie.NONE}break;default:this.state=ie.NONE}this.state!==ie.NONE&&this.dispatchEvent(Hl)}function n_(i){switch(this._trackPointer(i),this.state){case ie.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ie.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ie.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ie.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ie.NONE}}function i_(i){this.enabled!==!1&&i.preventDefault()}function s_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function r_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var io=class extends qi{constructor(){super();let t=new Se;t.deleteAttribute("uv");let e=new $t({side:Pe}),n=new $t,s=new qr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new It(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new It(t,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new It(t,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let l=new It(t,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new It(t,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let h=new It(t,n);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);let u=new It(t,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let d=new It(t,Ji(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let f=new It(t,Ji(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let g=new It(t,Ji(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);let _=new It(t,Ji(43));_.position.set(-.462,8.89,14.52),_.scale.set(4.38,5.441,.088),this.add(_);let m=new It(t,Ji(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let p=new It(t,Ji(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Ji(i){let t=new Xe;return t.color.setScalar(i),t}be.DEFAULT_UP.set(0,0,1);function o_(){let i=document.documentElement.getAttribute("data-theme");return i?i==="dark":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches}var Vn=class{constructor(t,e,{shadows:n=!0}={}){this.container=t,this.stock=e;let s=this.renderer=new Ir({antialias:!0,alpha:!0,powerPreference:"high-performance",preserveDrawingBuffer:!!window.CNCLLM_STATIC});s.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=ce,s.toneMapping=Al,s.toneMappingExposure=1,s.shadowMap.enabled=n,s.shadowMap.type=Tl,s.domElement.className="gl",t.appendChild(s.domElement);let r=this.scene=new qi,o=new Xi(s);r.environment=o.fromScene(new io,.04).texture,r.environmentIntensity=.7,o.dispose();let a=new R(...e.lo),l=new R(...e.hi);this.center=a.clone().add(l).multiplyScalar(.5),this.size=l.clone().sub(a),this.diag=this.size.length();let c=this.camera=new Ce(32,1,this.diag*.01,this.diag*60),h=this.controls=new no(c,s.domElement);h.enableDamping=!0,h.dampingFactor=.12,h.screenSpacePanning=!0,h.zoomToCursor=!0,h.minDistance=this.diag*.05,h.maxDistance=this.diag*12,h.addEventListener("change",()=>this.invalidate());let u=this.key=new $r(16777215,2.2);u.position.set(this.center.x-this.diag*.6,this.center.y-this.diag*.9,this.center.z+this.diag*1.4),u.target.position.copy(this.center),u.castShadow=n;let d=this.diag*.75;Object.assign(u.shadow.camera,{left:-d,right:d,top:d,bottom:-d,near:this.diag*.2,far:this.diag*4}),u.shadow.mapSize.set(2048,2048),u.shadow.bias=-4e-4,u.shadow.normalBias=.02,r.add(u,u.target),r.add(new Wr(15659775,3159098,.35));let f=Math.max(this.size.x,this.size.y)*.12+6,g=new Se(this.size.x+2*f,this.size.y+2*f,6);g.translate(this.center.x,this.center.y,-3-.02),this.plateMat=new $t({color:3883080,metalness:.3,roughness:.75}),this.plate=new It(g,this.plateMat),this.plate.receiveShadow=!0,r.add(this.plate),this.needs=!0,this.onFrame=null,this.visible=!0,this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(t),this.resize(),this.view("iso",!1),this.applyTheme(),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",()=>this.applyTheme());let _=()=>{if(requestAnimationFrame(_),!this.visible)return;let m=this.onFrame?this.onFrame():!1,p=this.controls.update();(m||p||this.needs)&&(this.needs=!1,s.render(r,c),this.frames=(this.frames||0)+1)};requestAnimationFrame(_),window.CNCLLM_STATIC||new IntersectionObserver(p=>{this.visible=p[p.length-1].isIntersecting,this.visible&&this.invalidate()},{rootMargin:"200px"}).observe(t)}applyTheme(){let t=o_();this.plateMat.color.set(t?3159099:4870233),this.invalidate()}invalidate(){this.needs=!0}resize(){let t=this.container.clientWidth,e=this.container.clientHeight;!t||!e||(this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.invalidate())}view(t,e=!0){let s={iso:this.camera.aspect<.9?[-.6,-1,1.55]:[-.85,-1.25,1.05],top:[0,-1e-4,1],front:[0,-1,.28],right:[1,0,.28]},r=new R(...s[t]||s.iso).normalize(),{pos:o,target:a}=this.fitBox(r,this.fitLo||new R(...this.stock.lo),this.fitHi||new R(...this.stock.hi),t==="top"?1.06:1.12);this.flyTo(o,a,e)}fitBox(t,e,n,s=1.12){let r=e.clone().add(n).multiplyScalar(.5),o=new R(0,0,1);Math.abs(t.z)>.999&&o.set(0,1,0);let a=new R().crossVectors(o,t).normalize(),l=new R().crossVectors(t,a).normalize(),c=Math.tan(this.camera.fov*Math.PI/360),h=c*this.camera.aspect,u=0;for(let d=0;d<8;d++){let f=new R(d&1?n.x:e.x,d&2?n.y:e.y,d&4?n.z:e.z).sub(r),g=Math.abs(f.dot(a)),_=Math.abs(f.dot(l)),m=f.dot(t);u=Math.max(u,g*s/h+m,_*s/c+m)}return{pos:r.clone().addScaledVector(t,u),target:r}}flyTo(t,e,n=!0){let s=this.camera,r=this.controls;if(!n){s.position.copy(t),r.target.copy(e),r.update(),this.invalidate();return}let o=s.position.clone(),a=r.target.clone(),l=performance.now(),c=450,h=()=>{let u=Math.min((performance.now()-l)/c,1),d=1-Math.pow(1-u,3);s.position.lerpVectors(o,t,d),r.target.lerpVectors(a,e,d),r.update(),this.invalidate(),u<1&&requestAnimationFrame(h)};h()}project(t){let e=t.clone().project(this.camera),n=this.container.clientWidth,s=this.container.clientHeight;return{x:(e.x*.5+.5)*n,y:(-e.y*.5+.5)*s,behind:e.z>1}}};var so=.5*(Math.sqrt(5)-1),Vl=1e30,Be=16;function hi(i,t,e,n,s,r){if(i===0)return 0;if(i===1)return t-Math.sqrt(Math.max(t*t-r*r,0));if(i===2){let o=Math.max(r-(t-e),0);return e-Math.sqrt(Math.max(e*e-o*o,0))}return Math.max(r-n,0)*s}function a_(i,t,e,n,s,r,o,a,l,c,h,u,d){let f=u-i,g=d-t,_=n-i,m=s-t,p=r-e,w=_*_+m*m;if(w<1e-18){let Q=Math.sqrt(f*f+g*g);return Q>a?Vl:Math.min(e,r)+hi(o,a,l,c,h,Q)}let b=f*_+g*m,v=f*f+g*g-a*a,L=b*b-w*v;if(L<0)return Vl;let P=Math.sqrt(L),A=Math.max((b-P)/w,0),M=Math.min((b+P)/w,1);if(A>M)return Vl;if(o===0)return Math.min(e+A*p,e+M*p);let y=Math.min(Math.max(b/w,A),M);if(Math.abs(p)<1e-12){let Q=f-y*_,rt=g-y*m;return e+hi(o,a,l,c,h,Math.sqrt(Q*Q+rt*rt))}let x=A,T=M,F=T-so*(T-x),D=x+so*(T-x),U=f-F*_,k=g-F*m,z=e+F*p+hi(o,a,l,c,h,Math.sqrt(U*U+k*k));U=f-D*_,k=g-D*m;let j=e+D*p+hi(o,a,l,c,h,Math.sqrt(U*U+k*k));for(let Q=0;Q<30&&!(T-x<1e-9);Q++)z<j?(T=D,D=F,j=z,F=T-so*(T-x),U=f-F*_,k=g-F*m,z=e+F*p+hi(o,a,l,c,h,Math.sqrt(U*U+k*k))):(x=F,F=D,z=j,D=x+so*(T-x),U=f-D*_,k=g-D*m,j=e+D*p+hi(o,a,l,c,h,Math.sqrt(U*U+k*k)));let V=Math.min(z,j);for(let Q of[A,M,y]){U=f-Q*_,k=g-Q*m;let rt=e+Q*p+hi(o,a,l,c,h,Math.sqrt(U*U+k*k));rt<V&&(V=rt)}return V}function l_(i){let t=new Float64Array(160).fill(0);for(let e=0;e<32;e++)t[e*5]=-1;for(let e of Object.keys(i)){let n=+e,s=i[e].row;for(let r=0;r<5;r++)t[n*5+r]=s[r]}return t}function c_(i,t){let{x0:e,y0:n,res:s,nx:r,ny:o}=i,a=new Float32Array(r*o),[l,c]=t.lo,[h,u,d]=t.hi;for(let f=0;f<o;f++){let g=n+(f+.5)*s;if(!(g<c||g>u))for(let _=0;_<r;_++){let m=e+(_+.5)*s;m>=l&&m<=h&&(a[f*r+_]=d)}}return a}var Ps=class{constructor(t,e,n){this.g=t,this.nx=t.nx,this.ny=t.ny,this.H0=c_(t,e),this.H=this.H0.slice(),this.own=new Uint8Array(this.nx*this.ny),this.T=l_(n),this.bnx=Math.ceil(this.nx/Be),this.bny=Math.ceil(this.ny/Be),this.bmax=new Float32Array(this.bnx*this.bny),this.recomputeBlocks(0,this.bny-1,0,this.bnx-1),this.resetDirty(),this.work=0}resetDirty(){this.di0=1e9,this.di1=-1,this.dj0=1e9,this.dj1=-1}markAllDirty(){this.di0=0,this.di1=this.ny-1,this.dj0=0,this.dj1=this.nx-1}get dirty(){return this.di1>=this.di0}load(t,e){this.H.set(t),this.own.set(e),this.recomputeBlocks(0,this.bny-1,0,this.bnx-1),this.markAllDirty()}reset(){this.load(this.H0,new Uint8Array(this.nx*this.ny))}recomputeBlocks(t,e,n,s){let{nx:r,ny:o,H:a,bmax:l,bnx:c}=this;for(let h=t;h<=e;h++)for(let u=n;u<=s;u++){let d=0,f=Math.min((h+1)*Be,o),g=Math.min((u+1)*Be,r);for(let _=h*Be;_<f;_++){let m=_*r;for(let p=u*Be;p<g;p++)a[m+p]>d&&(d=a[m+p])}l[h*c+u]=d}}refreshDirtyBlocks(){this.dirty&&this.recomputeBlocks(Math.floor(this.di0/Be),Math.floor(this.di1/Be),Math.floor(this.dj0/Be),Math.floor(this.dj1/Be))}apply(t,e,n,s,r,o,a){let l=this.T,c=a*5;if(a<=0||a>=32||l[c]<0)return 0;let h=l[c],u=l[c+1],d=l[c+2],f=l[c+3],g=l[c+4],{x0:_,y0:m,res:p}=this.g,w=this.nx,b=this.ny,v=this.H,L=this.own,P=Math.min(n,o),A=Math.max(Math.floor((Math.min(t,s)-u-_)/p),0),M=Math.min(Math.ceil((Math.max(t,s)+u-_)/p),w-1),y=Math.max(Math.floor((Math.min(e,r)-u-m)/p),0),x=Math.min(Math.ceil((Math.max(e,r)+u-m)/p),b-1);if(A>M||y>x)return 0;let T=Math.floor(y/Be),F=Math.floor(x/Be),D=Math.floor(A/Be),U=Math.floor(M/Be),k=!1;for(let X=T;X<=F&&!k;X++){let nt=X*this.bnx;for(let gt=D;gt<=U;gt++)if(this.bmax[nt+gt]>P){k=!0;break}}if(!k)return 0;let z=s-t,j=r-e,V=0,Q=1e9,rt=-1,ut=1e9,Ut=-1,Zt=p*p;for(let X=y;X<=x;X++){let nt=m+(X+.5)*p,gt=A,at=M;if(Math.abs(j)>1e-12){let Tt=Math.max(Math.min((nt-u-e)/j,1),0),Pt=Math.max(Math.min((nt+u-e)/j,1),0),Gt=t+z*Tt,Z=t+z*Pt;gt=Math.max(A,Math.floor((Math.min(Gt,Z)-u-_)/p)),at=Math.min(M,Math.ceil((Math.max(Gt,Z)+u-_)/p))}let Rt=X*w;for(let Tt=gt;Tt<=at;Tt++){let Pt=v[Rt+Tt];if(Pt<=P)continue;let Gt=_+(Tt+.5)*p,Z=a_(t,e,n,s,r,o,h,u,d,f,g,Gt,nt);if(Z<Pt){Z<0&&(Z=Pt>0?0:Pt);let it=Pt-Z;it>0&&(V+=it*Zt,v[Rt+Tt]=Z,L[Rt+Tt]=a,X<Q&&(Q=X),X>rt&&(rt=X),Tt<ut&&(ut=Tt),Tt>Ut&&(Ut=Tt))}}}return this.work+=(x-y+1)*(M-A+1),rt>=0&&(Q<this.di0&&(this.di0=Q),rt>this.di1&&(this.di1=rt),ut<this.dj0&&(this.dj0=ut),Ut>this.dj1&&(this.dj1=Ut)),V}};function Gl(i,t,e,n,s,r,o,a){let l=s;for(;l<r;l++){a&&a(l);let c=l*3;if(i.apply(t[c],t[c+1],t[c+2],e[c],e[c+1],e[c+2],n[l]&31),(l&31)===31&&o&&performance.now()>o){l++;break}}return l}var Wl=["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4","#6250d6","#8a6d3b","#5f7d8c","#a04f9e","#00a0b0"],Is="#e34948",oo=[.73,.75,.78],ao=[.55,.57,.6];var h_={gouge:"#2f66c9",gougeDeep:"#173c8a",ok:"#3fae6a",proud:"#e0614f",proudDeep:"#9e1f1f",undercut:"#8e939c",limited:"#9b72d0",datum:"#b9bcc2"};function ze(i){let t=parseInt(i.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}var $_=Object.fromEntries(Object.entries(h_).map(([i,t])=>[i,ze(t)])),u_=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e];var ke={ok:"#3f9b5a",proudLo:"#f39c34",proudHi:"#8f1414",gouge:"#2160c4",witness:"#8e5bd0"},ro=Object.fromEntries(Object.entries(ke).map(([i,t])=>[i,ze(t)]));function Qh(i,t){return i>t?u_(ro.proudLo,ro.proudHi,Math.min(Math.max((i-t)/.9,0),1)):i<-t?ro.gouge:ro.ok}function tu(i){let t=e=>(50+e*50).toFixed(2)+"%";return`linear-gradient(90deg, ${ke.gouge} 0%, ${ke.gouge} ${t(-i)}, ${ke.ok} ${t(-i)}, ${ke.ok} ${t(i)}, ${ke.proudLo} ${t(i)}, ${ke.proudHi} 100%)`}var d_=`
attribute vec3 color; attribute float aIdx; attribute float aDist; attribute float aRapid;
uniform float uCur; uniform float uWin; uniform float uFrom;
varying vec3 vCol; varying float vDist; varying float vRapid; varying float vPast;
void main() {
  vCol = color; vDist = aDist; vRapid = aRapid; vPast = aIdx < uCur ? (aIdx < uCur - uWin ? 0.5 : 1.0) : 0.0;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // pull the line 0.04 mm towards the camera (view space) so paths on machined floors stay visible,
  // without letting paths inside uncut material show through the stock
  mv.xyz *= max(1.0 - 0.04 / max(length(mv.xyz), 1e-3), 0.0);
  gl_Position = projectionMatrix * mv;
  if (aIdx < uFrom) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // before the window start: clipped
}`,f_=`
uniform float uPastA; uniform float uFutA; uniform float uOldA; uniform float uDash; uniform float uRapids; uniform float uFuture; uniform float uCuts;
varying vec3 vCol; varying float vDist; varying float vRapid; varying float vPast;
void main() {
  if (vRapid > 0.5) {
    if (uRapids < 0.5) discard;
    if (mod(vDist, uDash * 2.0) > uDash) discard;
  } else if (uCuts < 0.5) discard;
  if (vPast < 0.5 && uFuture < 0.5) discard;
  float a = vPast > 0.75 ? uPastA : vPast > 0.25 ? uOldA : uFutA;
  vec3 c = vPast > 0.75 ? vCol : mix(vCol, vec3(0.6), 0.35);
  gl_FragColor = vec4(c, a);
}`;function Xl(i,t,e,n,s){let r=e.length,o=new Float32Array(r*6),a=new Float32Array(r*6),l=new Float32Array(r*2),c=new Float32Array(r*2),h=new Float32Array(r*2),u=ze(Is),d={},f=0;for(let p=0;p<r;p++){let w=p*6,b=p*3;o[w]=i[b],o[w+1]=i[b+1],o[w+2]=i[b+2],o[w+3]=t[b],o[w+4]=t[b+1],o[w+5]=t[b+2];let v=e[p]>>5&1,L=e[p]&31,P=v?u:d[L]||(d[L]=ze(n(L)));if(a[w]=a[w+3]=P[0],a[w+1]=a[w+4]=P[1],a[w+2]=a[w+5]=P[2],l[p*2]=l[p*2+1]=p,h[p*2]=h[p*2+1]=v,v){let A=Math.hypot(t[b]-i[b],t[b+1]-i[b+1],t[b+2]-i[b+2]);c[p*2]=f,f+=A,c[p*2+1]=f,f=f%1e3}}let g=new ue;g.setAttribute("position",new Kt(o,3)),g.setAttribute("color",new Kt(a,3)),g.setAttribute("aIdx",new Kt(l,1)),g.setAttribute("aDist",new Kt(c,1)),g.setAttribute("aRapid",new Kt(h,1)),g.computeBoundingSphere();let _=new Ye({vertexShader:d_,fragmentShader:f_,transparent:!0,depthWrite:!1,uniforms:{uCur:{value:0},uWin:{value:1e9},uFrom:{value:-1},uPastA:{value:.95},uFutA:{value:.22},uOldA:{value:.16},uDash:{value:Math.max(.6,s/80)},uRapids:{value:1},uFuture:{value:1},uCuts:{value:1}}}),m=new on(g,_);return m.frustumCulled=!1,m.renderOrder=2,m}var ui=null;function p_(){if(ui)return ui;let i=document.createElement("canvas");i.width=128,i.height=128;let t=i.getContext("2d");t.fillStyle="#c9ced6",t.fillRect(0,0,128,128),t.fillStyle="#5b6270";for(let e=-2;e<4;e++)t.beginPath(),t.moveTo(e*64,128),t.lineTo(e*64+26,128),t.lineTo(e*64+26+64,0),t.lineTo(e*64+64,0),t.closePath(),t.fill();return ui=new Ur(i),ui.wrapS=ui.wrapT=gs,ui.colorSpace=ce,ui}function m_(i){let t=i.diameter/2,e=i.flute_length,n=[],s=(r,o)=>n.push(new tt(Math.max(r,1e-4),o));if(i.kind==="flat")s(0,0),s(t,0),s(t,e);else if(i.kind==="ball"){s(0,0);for(let r=1;r<=16;r++){let o=r/16*Math.PI/2;s(t*Math.sin(o),t-t*Math.cos(o))}s(t,e)}else if(i.kind==="bull"){let r=i.corner_radius;s(0,0),s(t-r,0);for(let o=1;o<=10;o++){let a=o/10*Math.PI/2;s(t-r+r*Math.sin(a),r-r*Math.cos(a))}s(t,e)}else{let r=(i.tip_diameter||0)/2,o=1/Math.tan(i.half_angle*Math.PI/180),a=(t-r)*o;s(0,0),r>0&&s(r,0),s(t,a),e>a&&s(t,e)}return n}function ql(i,t){let e=new he,n=i.diameter/2,s=i.flute_length,r=i.stickout,o=new $t({color:13949150,metalness:.85,roughness:.28,map:p_()}),a=new $t({color:12830927,metalness:.9,roughness:.22}),l=new $t({color:5922921,metalness:.8,roughness:.35,transparent:!0,opacity:.55,depthWrite:!1}),c=new $t({color:2895926,metalness:.6,roughness:.45,transparent:!0,opacity:.45,depthWrite:!1}),h=new $t({color:new Nt(t),metalness:.2,roughness:.5,emissive:new Nt(t),emissiveIntensity:.25}),u=m_(i),d=u[u.length-1].y;u.push(new tt(1e-4,d));let f=new zr(u,40);f.rotateX(Math.PI/2);let g=o.map.clone();g.needsUpdate=!0,g.repeat.set(i.flutes||2,Math.max(1,s/(i.diameter*1.6))),o.map=g;let _=new It(f,o);_.castShadow=!0;let m=new he;m.add(_);let p=i.neck_length||0,w=d;if(p>d+.01){let U=.95*i.diameter/2,k=new ye(U,U,p-d,32,1,!1);k.rotateX(Math.PI/2),k.translate(0,0,d+(p-d)/2);let z=new It(k,a);z.castShadow=!0,m.add(z),w=p}let b=(i.shank_diameter||i.diameter)/2,v=Math.max(r-w,.1),L=new ye(b,b,v,32,1,!1);L.rotateX(Math.PI/2),L.translate(0,0,w+v/2);let P=new It(L,a);P.castShadow=!0,m.add(P);let A=Math.min(3,v*.3),M=new ye(b*1.02,b*1.02,A,32,1,!0);M.rotateX(Math.PI/2),M.translate(0,0,r-A/2-Math.min(4,v*.2)),m.add(new It(M,h)),e.add(m);let y=i.holder_diameter/2,x=new ye(y,y*.92,10,6,1,!1);x.rotateX(Math.PI/2),x.translate(0,0,r+5);let T=new It(x,l);T.castShadow=!0,e.add(T);let F=new ye(y*1.2,y*1.05,16,40,1,!1);F.rotateX(Math.PI/2),F.translate(0,0,r+10+8);let D=new It(F,c);return D.castShadow=!0,e.add(D),e.userData.spin=m,e.userData.height=r+26,e}var eu=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function g_(i){let t=i,e="",n=i.search(/[;(]/);return n>=0&&(t=i.slice(0,n),e=i.slice(n)),eu(t).replace(/([A-Za-z])\s*([-+]?(?:\d+\.?\d*|\.\d+))/g,(r,o,a)=>{let l=o.toUpperCase(),c="k-w";return l==="G"?c=/^0*0$/.test(a)?"k-gr":/^0*[123]$/.test(a)?"k-gc":"k-g":l==="M"?c="k-m":l==="T"?c="k-t":l==="F"||l==="S"?c="k-f":"XYZIJKR".includes(l)&&(c="k-ax"),`<span class="${c}">${r}</span>`})+(e?`<span class="k-cm">${eu(e)}</span>`:"")}var Ls=class{constructor(t,e,{onPick:n,marks:s}){this.lines=e.split(`
`),this.lines.length&&this.lines[this.lines.length-1]===""&&this.lines.pop(),this.onPick=n,this.marks=s||new Map,t.innerHTML=`
      <div class="gc-tools">
        <label class="sr-only" for="gc-find">Find in G-code</label>
        <input id="gc-find" type="search" placeholder="Find text or go to line\u2026" autocomplete="off" spellcheck="false">
        <span class="gc-count" aria-live="polite"></span>
        <label class="follow" title="Keep the current line in view while playing"><input type="checkbox" checked> follow</label>
      </div>
      <div class="gc-scroll" tabindex="0" aria-label="G-code listing"><div class="gc-spacer"></div><div class="gc-rows"></div></div>`,this.scroll=t.querySelector(".gc-scroll"),this.spacer=t.querySelector(".gc-spacer"),this.rows=t.querySelector(".gc-rows"),this.find=t.querySelector("#gc-find"),this.count=t.querySelector(".gc-count"),this.followBox=t.querySelector(".follow input"),this.spacer.style.height=this.lines.length*20+"px",this.cur=0,this.userScrollT=0,this.scroll.addEventListener("scroll",()=>{this.render()},{passive:!0});for(let a of["wheel","touchmove","pointerdown","keydown"])this.scroll.addEventListener(a,()=>{this.userScrollT=performance.now()},{passive:!0});this.rows.addEventListener("click",a=>{let l=a.target.closest(".gc-row");l&&this.onPick(+l.dataset.line)});let r="",o=0;this.find.addEventListener("keydown",a=>{if(a.key!=="Enter")return;let l=this.find.value.trim();if(!l)return;if(/^\d+$/.test(l)){this.onPick(+l),this.count.textContent="";return}let c=l.toUpperCase(),h=l===r?o:this.cur,u=-1;for(let d=1;d<=this.lines.length;d++){let f=(h-1+d)%this.lines.length;if(this.lines[f].toUpperCase().includes(c)){u=f+1;break}}if(r=l,u<0){this.count.textContent="not found";return}o=u,this.count.textContent=`line ${u}`,this.onPick(u)}),this.render()}get follow(){return this.followBox.checked}setCurrent(t,e=!1){if(t===this.cur&&!e)return;this.cur=t;let n=performance.now()-this.userScrollT<2500;if(e||this.follow&&!n){let s=(t-1)*20,r=this.scroll.clientHeight,o=this.scroll.scrollTop;(e||s<o+20*2||s>o+r-20*3)&&(this.scroll.scrollTop=Math.max(0,s-r*.35))}this.render()}render(){let t=this.scroll.scrollTop,e=this.scroll.clientHeight||300,n=Math.max(0,Math.floor(t/20)-10),s=Math.min(this.lines.length,Math.ceil((t+e)/20)+10);if(n===this.ra&&s===this.rb&&this.cur===this.rc)return;this.ra=n,this.rb=s,this.rc=this.cur;let r="",o=String(this.lines.length).length;for(let a=n;a<s;a++){let l=a+1,c=this.marks.get(l),h="gc-row"+(l===this.cur?" cur":"")+(c?" "+c:"");r+=`<div class="${h}" data-line="${l}" style="top:${a*20}px"><span class="ln">${String(l).padStart(o,"\u2007")}</span><span class="code">${g_(this.lines[a])||"&nbsp;"}</span></div>`}this.rows.innerHTML=r}line(t){return this.lines[t-1]||""}};var __=new Uint8Array(256);for(let i=0;i<256;i++){let t=i/255;__[i]=Math.round(255*(t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)))}function Ds(i){i=Math.max(0,i);let t=Math.floor(i/3600),e=Math.floor(i%3600/60),n=Math.floor(i%60);return(t?t+":"+String(e).padStart(2,"0"):e)+":"+String(n).padStart(2,"0")}function lo(i){let t=new ue;t.setAttribute("position",new Kt(i.meshV,3)),t.setIndex(new Kt(i.meshF,1)),t.computeVertexNormals();let e=new he,n=new It(t,new $t({color:3116287,emissive:867456,transparent:!0,opacity:.38,depthWrite:!1,metalness:0,roughness:.6,side:We,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));n.renderOrder=3;let s;i.meshEdges&&i.meshEdges.length?(s=new ue,s.setAttribute("position",new Kt(i.meshEdges,3))):s=new Hn(t,28);let r=new on(s,new fn({color:675778,transparent:!0,opacity:1,depthWrite:!1,depthTest:!1}));return r.renderOrder=4,e.add(n,r),e}function x_(i,t,e,n,s,r,o,a){let l=-1/0,c=1/0;for(let h=0;h<3;h++){let u=t[h]+i[h][0]*s+i[h][1]*r,d=i[h][2];if(Math.abs(d)<1e-12){if(u<e[h]||u>n[h])return a}else{let f=(e[h]-u)/d,g=(n[h]-u)/d;l=Math.max(l,Math.min(f,g)),c=Math.min(c,Math.max(f,g))}}return c>=l?c+o:a}function co(i,t){let{x0:e,y0:n,res:s,nx:r,ny:o}=i.grid,a=new Float32Array(r*o);for(let l=0;l<o;l++){let c=n+(l+.5)*s;for(let h=0;h<r;h++)a[l*r+h]=x_(i.R,i.o,t.lo,t.hi,e+(h+.5)*s,c,i.zoff,i.big)}return a}function nu(i,t,e){let n=new Ps(i.grid,{lo:[1e9,1e9,0],hi:[-1e9,-1e9,0]},e);return n.H0=t,n.reset(),n.resetDirty(),n}var Us="2e-3";function y_(i){return`
uniform highp sampler2D uHT;
uniform int uActive;
uniform int uSelf;
uniform mat3 uRs[${i}];
uniform vec3 uOs[${i}];
uniform vec4 uGs[${i}];
uniform vec4 uAt[${i}];
uniform vec3 uLo;
uniform vec3 uHi;
float h5At(vec4 at, int j, int i) { return texelFetch(uHT, ivec2(int(at.x) + j, int(at.y) + i), 0).r; }
vec2 h5At2(vec4 at, int j, int i) { return texelFetch(uHT, ivec2(int(at.x) + j, int(at.y) + i), 0).rg; }
bool h5InSeg(int s, vec3 p) {
  vec3 d = p - uOs[s];
  mat3 R = uRs[s];
  vec3 q = vec3(dot(R[0], d), dot(R[1], d), dot(R[2], d));
  vec4 g = uGs[s];
  vec4 at = uAt[s];
  float u = (q.x - g.x) / g.z - 0.5, v = (q.y - g.y) / g.z - 0.5;
  if (u < 0.0 || v < 0.0 || u > at.z - 1.0 || v > at.w - 1.0) return true;
  int j = min(int(u), int(at.z) - 2), i = min(int(v), int(at.w) - 2);
  float fx = u - float(j), fy = v - float(i);
  vec2 a = h5At2(at, j, i), b = h5At2(at, j + 1, i), c = h5At2(at, j, i + 1), e = h5At2(at, j + 1, i + 1);
  if (max(max(a.y, b.y), max(c.y, e.y)) < ${Us}) return true;   // uncut cell: only the stock box limits it
  float h = fx >= fy ? a.x + fx * (b.x - a.x) + fy * (e.x - b.x) : a.x + fy * (c.x - a.x) + fx * (e.x - c.x);
  return q.z + g.w <= h + ${Us};
}
bool h5Inside(vec3 p) {
  if (any(lessThan(p, uLo - ${Us})) || any(greaterThan(p, uHi + ${Us}))) return false;
  for (int s = 0; s < ${i}; s++) {
    if (s >= uActive) break;
    if (s == uSelf || uAt[s].z < 1.5) continue;
    if (!h5InSeg(s, p)) return false;
  }
  return true;
}
`}function v_(i,t){let e=i.map((l,c)=>c).filter(l=>i[l]).sort((l,c)=>i[c][1]-i[l][1]),n=i.map(()=>null),s=0,r=0,o=0,a=1;for(let l of e){let[c,h]=i[l];s+c>t&&(r+=o,s=0,o=0),n[l]=[s,r],s+=c,o=Math.max(o,h),a=Math.max(a,s)}return{off:n,W:a,H:Math.max(1,r+o)}}var di=class{constructor(t,e,n,s,r){this.renderer=t,this.segs=e,this.stock=n;let o=this.N=Math.max(e.length,1),a=Math.min(t.capabilities.maxTextureSize||4096,8192),l=v_(e.map(m=>m.grid?[m.grid.nx,m.grid.ny]:null),a);if(this.atlas=l,l.H>a)throw new Error(`height-field atlas too large (${l.W}x${l.H})`);this.hd=new Float32Array(l.W*l.H*2),this.od=new Uint8Array(l.W*l.H),this.tex=new bs(this.hd,l.W,l.H,Kr,nn),this.tex.magFilter=this.tex.minFilter=Ie,this.tex.generateMipmaps=!1,this.tex.needsUpdate=!0,this.otex=new bs(this.od,l.W,l.H,jr,rn),this.otex.magFilter=this.otex.minFilter=Ie,this.otex.generateMipmaps=!1,this.otex.unpackAlignment=1,this.otex.needsUpdate=!0,this.top=e.map(m=>m.grid?co(m,n):null);let c=[],h=[],u=[],d=[];for(let m=0;m<o;m++){let p=e[m],w=new Bt;p&&w.set(p.R[0][0],p.R[0][1],p.R[0][2],p.R[1][0],p.R[1][1],p.R[1][2],p.R[2][0],p.R[2][1],p.R[2][2]),c.push(w),h.push(new R(...p?p.o:[0,0,0]));let b=p&&p.grid;u.push(new Jt(b?b.x0:0,b?b.y0:0,b?b.res:1,p?p.zoff:0));let v=l.off[m];d.push(new Jt(v?v[0]:0,v?v[1]:0,b?b.nx:0,b?b.ny:0))}this.U={uHT:{value:this.tex},uOT:{value:this.otex},uActive:{value:0},uRs:{value:c},uOs:{value:h},uGs:{value:u},uAt:{value:d},uLo:{value:new R(...n.lo)},uHi:{value:new R(...n.hi)},uToolCol:{value:Array.from({length:32},(m,p)=>new Nt().setRGB(...s[p]||oo,ce))},uMode:{value:0},uHi2:{value:-1},uSegHi:{value:new Nt(16756768)}},this.segRGB=r,this.common=y_(o),this.group=new he;let f=new R(...n.lo),g=new R(...n.hi),_=new Se(g.x-f.x,g.y-f.y,g.z-f.z);_.translate((f.x+g.x)/2,(f.y+g.y)/2,(f.z+g.z)/2),this.boxMat=this.makeMat(-1,!1),this.box=new It(_,this.boxMat),this.box.customDepthMaterial=this.makeMat(-1,!0),this.box.castShadow=this.box.receiveShadow=!0,this.box.frustumCulled=!1,this.group.add(this.box),this.surf=e.map((m,p)=>{if(!m.grid)return null;let{x0:w,y0:b,res:v,nx:L,ny:P}=m.grid,A=new Float32Array(L*P*3);for(let D=0;D<P;D++)for(let U=0;U<L;U++){let k=(D*L+U)*3;A[k]=w+(U+.5)*v,A[k+1]=b+(D+.5)*v,A[k+2]=0}let M=new Uint32Array((L-1)*(P-1)*6),y=0;for(let D=0;D<P-1;D++)for(let U=0;U<L-1;U++){let k=D*L+U,z=k+1,j=k+L,V=j+1;M[y++]=k,M[y++]=z,M[y++]=V,M[y++]=k,M[y++]=V,M[y++]=j}let x=new ue;x.setAttribute("position",new Kt(A,3)),x.setIndex(new Kt(M,1));let T=new It(x,this.makeMat(p,!1));T.customDepthMaterial=this.makeMat(p,!0);let F=new Xt().set(m.R[0][0],m.R[0][1],m.R[0][2],m.o[0],m.R[1][0],m.R[1][1],m.R[1][2],m.o[1],m.R[2][0],m.R[2][1],m.R[2][2],m.o[2],0,0,0,1);return T.matrixAutoUpdate=!1,T.matrix.copy(F),T.frustumCulled=!1,T.castShadow=T.receiveShadow=!0,T.visible=!1,this.group.add(T),T}),this.loaded=e.map(()=>!1)}makeMat(t,e){let n=t>=0?this.segs[t]:null,s=e?new Ms({depthPacking:Ul}):new $t({color:16777215,metalness:.72,roughness:.34,flatShading:!0}),r=this.U,o=this.common,a=new Nt().setRGB(...t>=0?this.segRGB[t%this.segRGB.length]:ao,ce),l=new Nt().setRGB(...ao,ce),c=new Nt().setRGB(...oo,ce),h=new Xt;return n&&h.set(n.R[0][0],n.R[0][1],n.R[0][2],n.o[0],n.R[1][0],n.R[1][1],n.R[1][2],n.o[1],n.R[2][0],n.R[2][1],n.R[2][2],n.o[2],0,0,0,1),s.onBeforeCompile=u=>{for(let _ of Object.keys(r))u.uniforms[_]=r[_];u.uniforms.uSelf={value:t},u.uniforms.uSegCol={value:a},u.uniforms.uRaw={value:l},u.uniforms.uAlu={value:c},u.uniforms.uLocal={value:h};let d=t>=0,f=u.vertexShader.replace("#include <common>",`#include <common>
${o}
uniform highp sampler2D uOT;
uniform mat4 uLocal;
varying vec3 vW5; varying float vCut5; flat out int vOwn5;`);f=f.replace("#include <begin_vertex>",d?`#include <begin_vertex>
{
  vec4 at = uAt[uSelf];
  int jj = gl_VertexID % int(at.z), ii = gl_VertexID / int(at.z);
  vec2 hv = h5At2(at, jj, ii);
  transformed.z = hv.x - uGs[uSelf].w;
  vCut5 = hv.y;
  vOwn5 = int(texelFetch(uOT, ivec2(int(at.x) + jj, int(at.y) + ii), 0).r * 255.0 + 0.5);
}`:`#include <begin_vertex>
vCut5 = 1.0; vOwn5 = 0;`),f=f.replace("#include <project_vertex>",`#include <project_vertex>
vW5 = (uLocal * vec4(transformed, 1.0)).xyz;`),u.vertexShader=f;let g=u.fragmentShader.replace("#include <common>",`#include <common>
${o}
uniform vec3 uToolCol[32]; uniform int uMode; uniform vec3 uSegCol; uniform vec3 uRaw; uniform vec3 uAlu; uniform int uHi2; uniform vec3 uSegHi;
varying vec3 vW5; varying float vCut5; flat in int vOwn5;`);g=g.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
${d?`if (vCut5 < ${Us}) discard;`:""}
if (!h5Inside(vW5)) discard;`),e||(g=g.replace("#include <color_fragment>",`#include <color_fragment>
{
  vec3 base = ${d?"uAlu":"uRaw"};
  ${d?`if (uMode == 0 && vOwn5 > 0) base = uAlu * 0.72 + uToolCol[vOwn5] * 0.28;
  else if (uMode == 1) base = uAlu * 0.55 + uSegCol * 0.45;
  if (uHi2 == uSelf) base = mix(base, uSegHi, 0.55);`:""}
  diffuseColor.rgb *= base;
}`)),u.fragmentShader=g},s.customProgramCacheKey=()=>(e?"h5d":"h5c")+(t>=0?"s":"b")+this.N,s}setActive(t){this.U.uActive.value=t,this.surf.forEach((e,n)=>{e&&(e.visible=n<t)})}setMode(t){this.U.uMode.value=t}write(t,e,n,s=0,r=null){let o=this.segs[t];if(!o.grid)return;let{nx:a,ny:l}=o.grid,[c,h]=this.atlas.off[t],u=this.atlas.W,d=this.top[t];if(r===null&&(r=l-1),s=Math.max(0,s),r=Math.min(l-1,r),r<s)return;let f=this.hd,g=this.od;for(let _=s;_<=r;_++){let m=(h+_)*u+c,p=_*a;for(let w=0;w<a;w++){let b=e[p+w];f[(m+w)*2]=b,f[(m+w)*2+1]=Math.max(d[p+w]-b,0),g[m+w]=n?n[p+w]:0}}this.upload(t,s,r)}upload(t,e,n){let s=this.renderer,r=s.getContext(),o=s.properties.get(this.tex),a=s.properties.get(this.otex);if(!o.__webglTexture||!a.__webglTexture){this.tex.needsUpdate=!0,this.otex.needsUpdate=!0;return}let l=this.segs[t],{nx:c}=l.grid,[h,u]=this.atlas.off[t],d=this.atlas.W,f=n-e+1,g=new Float32Array(c*f*2),_=new Uint8Array(c*f);for(let m=0;m<f;m++){let p=(u+e+m)*d+h;g.set(this.hd.subarray(p*2,(p+c)*2),m*c*2),_.set(this.od.subarray(p,p+c),m*c)}s.state.activeTexture(r.TEXTURE0),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ALIGNMENT,1),s.state.bindTexture(r.TEXTURE_2D,o.__webglTexture),r.texSubImage2D(r.TEXTURE_2D,0,h,u+e,c,f,r.RG,r.FLOAT,g),s.state.bindTexture(r.TEXTURE_2D,a.__webglTexture),r.texSubImage2D(r.TEXTURE_2D,0,h,u+e,c,f,r.RED,r.UNSIGNED_BYTE,_)}};function $l(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new ue,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=iu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);let g=iu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function iu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Kt(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){let _=h.getComponent(d,g);a.setComponent(d+u,g,_)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var M_=new Xt().set(0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,1);function su(i,t,e,n=2){let s=new Vr(i,{depth:e-2*n,bevelEnabled:n>0,bevelThickness:n,bevelSize:n,bevelSegments:2,curveSegments:40});return s.applyMatrix4(M_),s.translate(t+n,0,0),s}function ho(i,t,e,n=48){let s=new ye(i,i,e-t,n);return s.rotateZ(Math.PI/2),s.translate((t+e)/2,0,0),s}function Qi(i,t){let e=new Se(t[0]-i[0],t[1]-i[1],t[2]-i[2]);return e.translate((i[0]+t[0])/2,(i[1]+t[1])/2,(i[2]+t[2])/2),e}function we(i,t,e=!0){let n=new It(i,t);return n.castShadow=e,n.receiveShadow=!0,n}function b_(i){let t=i.stock,e=i.vise||[],n=e.find(D=>D.kind==="body"),s=e.find(D=>D.kind==="table"),r=e.filter(D=>D.kind==="jaw"),o=(t.lo[2]+t.hi[2])/2,a=s?s.hi[2]:n?n.lo[2]:t.lo[2]-40,c=n?(D=>[D.hi[0]-D.lo[0],D.hi[1]-D.lo[1]])(n):[t.hi[0]-t.lo[0],t.hi[1]-t.lo[1]],h=Math.max(.5*Math.max(c[0],c[1])*1.06+8,.5*Math.hypot(t.hi[0]-t.lo[0],t.hi[1]-t.lo[1])*1.1,60);h=Math.ceil(h/5)*5;let u=a-o,d=Math.max(16,h*.15),f=2*h*.8,g=Math.max(22,h*.2),_=Math.max(18,h*.16),m=u-d-_,p=m-g,w=h+Math.max(12,h*.1),b=Math.max(24,h*.22),v=Math.max(Math.min(f/2,h*.55),40),L=Math.hypot(f/2,p),P=-L-14,A=w+b+8,M=Math.max(36,h*.32),y=v*.86,x=[];for(let D of[...r,...n?[n]:[]])for(let U=0;U<8;U++)x.push([U&1?D.hi[0]:D.lo[0],U&2?D.hi[1]:D.lo[1],(U&4?D.hi[2]:D.lo[2])-o]);for(let D=0;D<8;D++)x.push([D&1?t.hi[0]:t.lo[0],D&2?t.hi[1]:t.lo[1],(D&4?t.hi[2]:t.lo[2])-o]);let T=Math.max(...x.map(D=>Math.hypot(...D))),F=Math.hypot(h,u);return{zp:o,zt:a,pivot:[0,0,o],Rp:h,zT:u,tp:d,W:f,tf:g,hc:_,zFt:m,zFb:p,xa:w,ta:b,rB:v,zBed:P,xs0:A,ts:M,rH:y,reach:L,rStock:T,rSweep:Math.max(T,F),zSafe:Math.max(T,F)+15}}function ru(i){let t=b_(i),e={paint:new $t({color:12896461,metalness:.25,roughness:.5}),cradle:new $t({color:8226706,metalness:.45,roughness:.42}),dark:new $t({color:2764340,metalness:.35,roughness:.65}),bed:new $t({color:3817286,metalness:.3,roughness:.7}),platter:new $t({color:11844289,metalness:.78,roughness:.3}),slot:new $t({color:2435117,metalness:.3,roughness:.8}),tick:new Xe({color:1776929}),zero:new Xe({color:15901498}),accent:new $t({color:15901498,metalness:.2,roughness:.5}),head:new $t({color:14804200,metalness:.2,roughness:.45,transparent:!0,opacity:.32,depthWrite:!1}),nose:new $t({color:4935768,metalness:.7,roughness:.35,transparent:!0,opacity:.5,depthWrite:!1})},n=new he,s=new he,r=new he,o=new he;s.add(r),r.add(o),o.position.set(-t.pivot[0],-t.pivot[1],-t.pivot[2]);let a=t.xs0+t.ts+70;n.add(we(Qi([-a,-t.W*.95,t.zBed-34],[a,t.W*.95,t.zBed]),e.bed,!1));for(let L of[-1,1]){let P=L>0?t.xs0:-t.xs0-t.ts,A=new $i,M=t.W*.62;A.moveTo(-M,t.zBed),A.lineTo(M,t.zBed),A.lineTo(t.rH,0),A.absarc(0,0,t.rH,0,Math.PI,!1),A.lineTo(-M,t.zBed),n.add(we(su(A,P,t.ts,3),e.paint));let y=L>0?t.xs0-6:-t.xs0-t.ts-10,x=y+t.ts+16;n.add(we(ho(t.rH*.78,y,x),e.paint)),n.add(we(ho(t.rH*.42,L>0?x:y-6,L>0?x+6:y),e.dark))}let l=t.xs0+t.ts+10;n.add(we(ho(t.rH*.7,l,l+48),e.dark));let c=t.W,h=Qi([-t.xa-1,-c/2,t.zFb],[t.xa+1,c/2,t.zFt]),u=new ye(t.Rp*.78,t.Rp*.82,t.hc+2,72);u.rotateX(Math.PI/2),u.translate(0,0,t.zFt+t.hc/2-1),s.add(we(h,e.cradle),we(u,e.dark));for(let L of[-1,1]){let P=new $i;P.moveTo(-c/2,t.zFb),P.lineTo(c/2,t.zFb),P.lineTo(c/2,t.zFt),P.lineTo(t.rB,0),P.absarc(0,0,t.rB,0,Math.PI,!1),P.lineTo(-c/2,t.zFt),P.lineTo(-c/2,t.zFb);let A=L>0?t.xa:-t.xa-t.ta;s.add(we(su(P,A,t.ta,3),e.cradle));let M=L>0?t.xa+t.ta-1:-t.xa-t.ta-7,y=ho(t.rB*.62,M,M+8);s.add(we(y,e.dark));let x=Qi([M-.5,-3,t.rB*.2],[M+8.5,3,t.rB*.6]);s.add(we(x,e.accent,!1))}let d=new ye(t.Rp,t.Rp,t.tp,128);d.rotateX(Math.PI/2),d.translate(0,0,t.zT-t.tp/2),r.add(we(d,e.platter));let f=[];for(let L=0;L<3;L++){let P=Qi([-t.Rp*.97,-6,t.zT-.2],[t.Rp*.97,6,t.zT+.25]);P.rotateZ(L*Math.PI/3+Math.PI/6),f.push(P)}r.add(we($l(f),e.slot,!1));let g=[];for(let L=0;L<72;L++){if(L===0)continue;let P=L%9===0?12:L%3===0?7:4,A=Qi([t.Rp-P-1.5,-.7,t.zT],[t.Rp-1.5,.7,t.zT+.3]);A.rotateZ(L*Math.PI/36),g.push(A)}r.add(we($l(g),e.tick,!1));let _=Qi([t.Rp-18,-2.2,t.zT],[t.Rp-1,2.2,t.zT+.45]);r.add(we(_,e.zero,!1));let m=new ye(t.Rp+.6,t.Rp+.6,3,128,1,!0);m.rotateX(Math.PI/2),m.translate(0,0,t.zT-t.tp+4),r.add(we(m,e.dark,!1));let p=new he,w=new ye(30,34,40,64);w.rotateX(Math.PI/2),w.translate(0,0,20);let b=new ye(36,36,7,64);b.rotateX(Math.PI/2),b.translate(0,0,43);let v=new ye(44,44,260,64);return v.rotateX(Math.PI/2),v.translate(0,0,176),p.add(we(w,e.nose),we(b,e.dark),we(v,e.head)),{dims:t,fixed:n,cradle:s,platter:r,part:o,head:p,mats:e}}function Yl(i,t,e){i.cradle.rotation.set(t*Math.PI/180,0,0),i.platter.rotation.set(0,0,(90-e)*Math.PI/180)}var fo=Math.PI/180,po=180/Math.PI;function Zl(i){let t=i[2][2],e=Math.acos(Math.max(-1,Math.min(1,t)))*po,n=Math.abs(t)<.9999?Math.atan2(i[1][2],i[0][2])*po:0;return{A:e,C:n}}function S_(i){let t=[i[0][2],i[1][2],i[2][2]],e=Math.acos(Math.max(-1,Math.min(1,t[2])))*po,s=Math.hypot(t[0],t[1])>1e-9?Math.atan2(t[1],t[0])*po:0;return{A:e,C:s}}function w_(i){let t=[];for(let e=0;e<i.length;e++){if(!e){t.push(i[0]);continue}let n=t[e-1],s=Math.round((n-i[e])/360),r=null;for(let o of[s-1,s,s+1]){let a=i[e]+360*o,l=Math.abs(a-n);l>180+1e-9||(r===null||l<Math.abs(r-n)-1e-9||Math.abs(l-Math.abs(r-n))<=1e-9&&Math.abs(a)<Math.abs(r))&&(r=a)}t.push(r)}return t}function jl(i){let t=((i+180)%360+360)%360-180;return t<=-180&&(t+=360),Object.is(t,-0)?0:t}function E_(i,t){let e=[[0,0,0],[0,0,0],[0,0,0]];for(let n=0;n<3;n++)for(let s=0;s<3;s++)e[n][s]=i[n][0]*t[0][s]+i[n][1]*t[1][s]+i[n][2]*t[2][s];return e}function T_(i,t){return[i[0][0]*t[0]+i[0][1]*t[1]+i[0][2]*t[2],i[1][0]*t[0]+i[1][1]*t[1]+i[1][2]*t[2],i[2][0]*t[0]+i[2][1]*t[1]+i[2][2]*t[2]]}function A_(i){let t=Math.cos(i*fo),e=Math.sin(i*fo);return[[1,0,0],[0,t,-e],[0,e,t]]}function R_(i){let t=Math.cos(i*fo),e=Math.sin(i*fo);return[[t,-e,0],[e,t,0],[0,0,1]]}function C_(i){return 90-i}function Kl(i,t){return E_(A_(i),R_(C_(t)))}function mo(i,t,e,n){return T_(Kl(t,e),[i[0]-n[0],i[1]-n[1],i[2]-n[2]])}function ou(i){let t=i.map(Zl),e=i.map(S_),n=w_(e.map(s=>s.C));return i.map((s,r)=>({A:t[r].A,C:t[r].C,Ak:e[r].A,Ck:n[r]}))}function uo(i){return i=Math.min(Math.max(i,0),1),i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}var P_=[.24,.76];function au(i,t,e,n,s,r){let[o,a]=P_,l=Math.max(r,n[2],s[2]);if(i<=o){let u=uo(i/o);return{phase:"retract",A:t.Ak,C:t.Ck,tip:[n[0],n[1],n[2]+(l-n[2])*u]}}if(i<a){let u=uo((i-o)/(a-o));return{phase:"swing",A:t.Ak+(e.Ak-t.Ak)*u,C:t.Ck+(e.Ck-t.Ck)*u,tip:[n[0],n[1],l]}}let c=(i-a)/(1-a);if(c<.5){let u=uo(c/.5);return{phase:"approach",A:e.Ak,C:e.Ck,tip:[n[0]+(s[0]-n[0])*u,n[1]+(s[1]-n[1])*u,l]}}let h=uo((c-.5)/.5);return{phase:"approach",A:e.Ak,C:e.Ck,tip:[s[0],s[1],l+(s[2]-l)*h]}}var pn={play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',start:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.4v14H6zM19 5.5v13L9.5 12z" fill="currentColor"/></svg>',end:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5H18v14h-2.4zM5 5.5v13L14.5 12z" fill="currentColor"/></svg>',back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 6 9.5 12l6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',fwd:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 6 6 6-6 6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',prevSeg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h2.2v14H5zM19 6l-6 6 6 6M13 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',nextSeg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 5H19v14h-2.2zM5 6l6 6-6 6M11 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'},ts=[1,4,16,64,256,1024,4096],I_=2.2,Le=["#3b7dd8","#e0703a","#2fa36b","#a35cc8","#d4a017","#d24f7a","#2aa5b5","#7c6b4f","#5d6fd6","#8aa82e"];function Jl(i,t=30,e="currentColor"){let n=(m,p,w)=>[15+(m-p)*6.2,17+(m+p)*3.1-w*8],s=[[-1,-1,-.5],[1,-1,-.5],[1,1,-.5],[-1,1,-.5],[-1,-1,.5],[1,-1,.5],[1,1,.5],[-1,1,.5]].map(m=>n(m[0]*.75,m[1]*.45,m[2]*.6)),r=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],o=n(i[0]*.55,i[1]*.55,i[2]*.55),a=n(i[0]*1.55,i[1]*1.55,i[2]*1.55),l=o[0]-a[0],c=o[1]-a[1],h=Math.hypot(l,c)||1,u=l/h,d=c/h,f=[o[0]-u*4-d*2.6,o[1]-d*4+u*2.6],g=[o[0]-u*4+d*2.6,o[1]-d*4-u*2.6],_=m=>m.map(p=>p.toFixed(1)).join(",");return`<svg class="axis-ico" viewBox="0 0 30 30" width="${t}" height="${t}" aria-hidden="true"><path d="${r.map(([m,p])=>`M${_(s[m])}L${_(s[p])}`).join("")}" stroke="currentColor" stroke-opacity=".45" stroke-width="1" fill="none"/><path d="M${_(a)}L${_(o)}" stroke="${e}" stroke-width="2.2" stroke-linecap="round"/><path d="M${_(o)}L${_(f)}L${_(g)}Z" fill="${e}"/></svg>`}function _o(i,t){i.controls.enableZoom=!1,t.addEventListener("pointerdown",()=>{i.controls.enableZoom=!0}),t.addEventListener("pointerleave",()=>{i.controls.enableZoom=!1})}function fi(i){return`A${Math.round(i.A_deg??0)} C${Math.round(i.C_deg??0)}`}function Ql(i){let t=new he,e=[],n={jaw:new $t({color:7306380,metalness:.7,roughness:.38}),body:new $t({color:4147799,metalness:.6,roughness:.45}),table:new $t({color:2895926,metalness:.45,roughness:.7})};for(let s of i||[]){let r=s.lo,o=s.hi,a=new Se(o[0]-r[0],o[1]-r[1],o[2]-r[2]);a.translate((r[0]+o[0])/2,(r[1]+o[1])/2,(r[2]+o[2])/2);let l=new It(a,n[s.kind].clone());if(l.receiveShadow=!0,l.castShadow=s.kind!=="table",l.userData.kind=s.kind,t.add(l),e.push(l),s.kind==="table"){let u=o[1]-r[1];for(let d=1;d<5;d++){let f=r[1]+u*d/5,g=new Se(o[0]-r[0],Math.min(14,u/30),.6);g.translate((r[0]+o[0])/2,f,o[2]+.05);let _=new It(g,new Xe({color:1447963}));_.userData.kind="table",t.add(_)}}let c=new on(new Hn(a),new fn({color:0,transparent:!0,opacity:.25}));c.userData.kind=s.kind,t.add(c)}return{group:t,meshes:e}}var L_=(i,t=8)=>(Math.abs(i)<5e-4?0:i).toFixed(3).padStart(t," "),go=class{constructor(t,e,n,s){this.D=t,this.els=e,this.toolColor=n;let r=t.meta,o=this.n=r.n_moves,a=this.segs=t.segs;this.N=a.length;let l=this.stage=new Vn(e.view,r.stock);l.plate.visible=!1,_o(l,e.view);let c=this.mc=ru(r);l.scene.add(c.fixed,c.cradle,c.head),this.machineOnly=[c.fixed,c.head,...c.cradle.children.filter(m=>m!==c.platter),...c.platter.children.filter(m=>m!==c.part)];let h=new R(...r.stock.lo),u=new R(...r.stock.hi);for(let m of r.vise||[])m.kind==="jaw"&&(h.min(new R(...m.lo)),u.max(new R(...m.hi)));this.fitLo=h,this.fitHi=u,this.vise=Ql(r.vise),c.part.add(this.vise.group);let d=c.dims,f=Math.max(d.rStock,30);this.mFitLo=new R(-f*.78,-f*.78,-f*.62),this.mFitHi=new R(f*.78,f*.78,f*.78);let g=ou(a.map(m=>m.R));a.forEach((m,p)=>{m.ang=g[p],m.qTable=new Ee().setFromRotationMatrix(D_(Kl(g[p].Ak,g[p].Ck)))});let _=[];for(let m of t.toolsUsed)_[m]=ze(n(m));this.mat5=new di(l.renderer,a,r.stock,_,Le.map(ze)),c.part.add(this.mat5.group),this.hfs=a.map(()=>null),this.finalH=a.map(m=>m.finalH),this.layer=a.map(()=>"top"),this.cs=-1,this.path=Xl(t.FS,t.FE,t.TL,n,l.diag),c.part.add(this.path),this.ghost=lo(t),this.ghost.visible=!1,c.part.add(this.ghost),this.arrow=this.buildArrow(l.diag),c.part.add(this.arrow),this.toolModels={},this.toolObj=null,this.curTool=-1,this.cursor=0,this.playTime=0,this.playing=!1,this.dIdx=0,this.dFrac=0,this.K=Math.max(400,Math.ceil(o/60)),this.keys=a.map(()=>new Map),this.keyList=a.map(()=>[]),this.total=t.cum[o],this.speed=ts.find(m=>this.total/m<=75)||ts[ts.length-1],this.total/this.speed<8&&this.speed>1&&(this.speed=ts[Math.max(0,ts.indexOf(this.speed)-1)]),this.follow=!0,this.buildTimeline(),this.buildUI(),this.startWorker(s),this.lastT=performance.now(),this.uiT=0,this.stage.onFrame=()=>this.frame(),e.view.querySelector(".vp-msg")?.remove(),this.mode=null,this.setMode("machine",!1),this.setCursor(this.N>1?a[1].a:0),this.updateTool(0),this.stage.invalidate()}setMode(t,e=!0){if(t===this.mode)return;this.mode=t;let n=this.mc,s=t==="machine";for(let l of this.machineOnly)l.visible=s;this.vise.group.children.forEach(l=>{l.userData.kind==="table"&&(l.visible=!s)}),s?n.part.position.set(-n.dims.pivot[0],-n.dims.pivot[1],-n.dims.pivot[2]):(n.part.position.set(0,0,0),Yl(n,0,90)),this.arrow.visible=!1;let r=this.stage.key,o=s?Math.max(n.dims.xs0+n.dims.ts,n.dims.W)*1.25:this.stage.diag*1.1,a=s?new R(0,0,0):this.stage.center;r.position.set(a.x-o*.55,a.y-o*.8,a.z+o*1.3),r.target.position.copy(a),Object.assign(r.shadow.camera,{left:-o,right:o,top:o,bottom:-o,near:o*.1,far:o*5}),r.shadow.camera.updateProjectionMatrix(),this.stage.camera.far=s?o*30:this.stage.diag*60,this.stage.camera.updateProjectionMatrix(),this.stage.controls.maxDistance=s?o*8:this.stage.diag*12,this.stage.fitLo=s?this.mFitLo:this.fitLo,this.stage.fitHi=s?this.mFitHi:this.fitHi,this.modeBtns&&this.modeBtns.forEach(l=>l.setAttribute("aria-pressed",String(l.dataset.mode===t))),this.els.view&&(this.els.view.dataset.mode=t),this.droEl&&(this.droEl.hidden=!s,this.hud.hidden=s),this.shownPos=void 0,this.shownFix=-1,this.view(s?"machine":"iso",e),this.placeTool(this.cursor),this.uiT=0,this.stage.invalidate()}hfOf(t){return this.hfs[t]||(this.hfs[t]=nu(this.segs[t],this.mat5.top[t],this.D.meta.tools)),this.hfs[t]}setLayer(t,e){let n=this.segs[t];!n.grid||this.layer[t]===e||(e==="final"?this.mat5.write(t,this.finalH[t],n.finalOwn):e==="top"&&this.mat5.write(t,this.mat5.top[t],null),this.layer[t]=e)}startWorker(t){if(this.workerState="none",!(!t||typeof Worker>"u"||this.n<2))try{let e=URL.createObjectURL(new Blob([t],{type:"text/javascript"})),n=this.worker=new Worker(e),s=this.D,r=s.meta;this.workerState="running",this.workerProgress=0,this.replayCmp=[],n.onmessage=a=>{let l=a.data;l.type==="progress"?this.workerProgress=l.m:l.type==="key"?(this.addKey(l.s,l.k,l.H,l.own),this.workerProgress=l.k):l.type==="seg"?this.compareSeg(l.s,l.H):l.type==="done"&&(this.workerState="done",this.workerMs=l.ms,this.finishCompare(),n.terminate(),URL.revokeObjectURL(e)),this.uiT=0},n.onerror=a=>{console.warn("replay worker failed, replaying on the main thread",a.message),this.workerState="failed"};let o=this.segs.map(a=>({a:a.a,b:a.b,R:a.R,o:a.o,zoff:a.zoff,big:a.big,grid:a.grid}));n.postMessage({segs:o,stock:r.stock,tools:r.tools,S:s.SZ,E:s.EZ,TL:s.TL,K:this.K})}catch(e){console.warn("no worker",e),this.workerState="failed"}}compareSeg(t,e){let n=this.finalH[t],s=0,r=0;for(let o=0;o<n.length;o++){let a=Math.abs(e[o]-n[o]);a>r&&(r=a),a>.002&&s++}this.replayCmp.push({bad:s,cells:n.length,mx:r})}finishCompare(){let t=this.replayCmp||[],e=t.reduce((s,r)=>s+r.cells,0),n=t.reduce((s,r)=>s+r.bad,0);this.replay=e?{pct:100*(1-n/e),max:Math.max(...t.map(s=>s.mx)),cells:e}:null,this.updateStatus()}addKey(t,e,n,s){this.keys[t].has(e)||(this.keys[t].set(e,{H:n,own:s}),this.keyList[t].push(e),this.keyList[t].sort((r,o)=>r-o))}bestKey(t,e){let n=this.keyList[t],s=this.segs[t].a;for(let r=n.length-1;r>=0;r--)if(n[r]<=e){s=n[r];break}return s}restore(t,e){let n=this.hfOf(t);if(e===this.segs[t].a)n.reset();else{let s=this.keys[t].get(e);n.load(s.H,s.own)}this.dIdx=e,this.dFrac=0}segOf(t){return this.D.segOf[Math.min(Math.max(t,0),this.n-1)]}cutFrac(t,e){let n=this.D.phi[t];return n>0?Math.max(0,(e-n)/(1-n)):e}applySub(t,e,n){let s=this.D.SZ,r=this.D.EZ,o=t*3,a=this.D.TL;if(e=this.cutFrac(t,e),n=this.cutFrac(t,n),n<=e)return;let l=this.hfOf(this.segOf(t)),c=s[o]+(r[o]-s[o])*e,h=s[o+1]+(r[o+1]-s[o+1])*e,u=s[o+2]+(r[o+2]-s[o+2])*e,d=s[o]+(r[o]-s[o])*n,f=s[o+1]+(r[o+1]-s[o+1])*n,g=s[o+2]+(r[o+2]-s[o+2])*n;l.apply(c,h,u,d,f,g,a[t]&31)}advance(t){let e=this.n,n=this.cursor,s=Math.min(Math.floor(n),e),r=s<e?n-s:0;if(!e)return!0;if(s>=e){for(let h=0;h<this.N;h++)this.setLayer(h,"final");return this.cs=-1,this.dIdx=e,this.dFrac=0,this.mat5.setActive(this.N),!0}let o=this.segOf(s),a=this.segs[o];if(o!==this.cs){for(let h=0;h<o;h++)this.setLayer(h,"final");if(this.cs=o,this.mat5.setActive(o+1),!a.grid)return this.dIdx=s,this.dFrac=r,!0;this.restore(o,this.bestKey(o,s)),this.layer[o]="live",this.hfOf(o).markAllDirty()}if(!a.grid)return this.dIdx=s,this.dFrac=r,!0;let l=this.hfOf(o);(s<this.dIdx||s===this.dIdx&&r<this.dFrac-1e-9)&&this.restore(o,this.bestKey(o,s));let c=this.bestKey(o,s);if((c>this.dIdx+64||c>this.dIdx&&this.dFrac===0&&c-this.dIdx>4)&&this.restore(o,c),this.dIdx<s){this.dFrac>0&&(this.applySub(this.dIdx,this.dFrac,1),this.dIdx++,this.dFrac=0);let h=this.workerState==="running"||this.workerState==="done"?null:u=>{u>a.a&&(u-a.a)%this.K===0&&!this.keys[o].has(u)&&this.addKey(o,u,l.H.slice(),l.own.slice())};this.dIdx=Gl(l,this.D.SZ,this.D.EZ,this.D.TL,this.dIdx,s,t,h)}return this.dIdx===s&&r>this.dFrac&&(this.applySub(s,this.dFrac,r),this.dFrac=r),this.dIdx===s&&this.dFrac>=r-1e-9}idxPhase(t){let e=this.segs[t].a,n=this.D.cum;return[n[e],n[e]+this.D.phi[e]*(n[e+1]-n[e])]}swingMoves(t){let e=this.segs[t-1].ang,n=this.segs[t].ang;return Math.abs(e.Ak-n.Ak)>1e-6||Math.abs(e.Ck-n.Ck)>1e-6}swingText(t,e){let n=this.segs[t].ang,s=this.segs[e].ang,r=h=>`${Math.round(h*10)/10}\xB0`,o=Math.abs(n.Ak-s.Ak)>1e-6,a=Math.abs(n.Ck-s.Ck)>1e-6,l=`cradle tilts A ${r(n.A)} \u2192 ${r(s.A)}`,c=`platter turns C ${r(n.C)} \u2192 ${r(s.C)}`;return o&&a?`${l}, ${c}`:o?l:a?c:"same table angles, new work plane"}playFirstTilt(){if(this.N<2){this.togglePlay();return}let t=this.segs[1].a,e=this.D.cum;this.setCursor(this.timeToCursor(Math.max(0,e[t]-this.speed*1.2))),this.playing||this.togglePlay()}advanceClock(t){let e=this.playTime,n=t;for(let s=0;s<8&&n>1e-9&&e<this.total;s++){let r=this.segOf(this.moveAt(this.timeToCursor(e)+1e-9)),o=null;for(let c of[r,r+1])if(c>=1&&c<this.N){let h=this.idxPhase(c);if(e>=h[0]-1e-9&&e<h[1]){o=h;break}}if(o){let c=Math.min(this.speed,(o[1]-o[0])/I_),h=(o[1]-e)/c;n<h?(e+=n*c,n=0):(e=o[1],n-=h);continue}let a=r+1<this.N?this.idxPhase(r+1)[0]:1/0,l=e+n*this.speed;l>=a&&e<a?(n-=(a-e)/this.speed,e=a):(e=l,n=0)}return Math.min(e,this.total)}frame(){let t=performance.now(),e=Math.min(t-this.lastT,250)/1e3;this.lastT=t,this.playing&&(this.playTime=this.advanceClock(e),this.playTime>=this.total&&(this.playTime=this.total,this.playing=!1,this.syncPlay()),this.cursor=this.timeToCursor(this.playTime));let n=this.advance(t+(this.playing?12:60));this.caught=n;let s=!1;if(this.cs>=0){let o=this.hfs[this.cs];o&&o.dirty&&(o.refreshDirtyBlocks(),this.mat5.write(this.cs,o.H,o.own,o.di0,o.di1),o.resetDirty(),s=!0)}let r=n?this.cursor:this.dIdx+this.dFrac;return r!==this.shownPos&&(this.shownPos=r,this.placeTool(r),this.path.material.uniforms.uCur.value=r,this.path.material.uniforms.uFrom.value=(this.pathMode==="recent"||this.pathMode==="next")&&this.n?this.segs[this.segOf(this.moveAt(r))].a:-1,s=!0),this.toolObj&&this.spinning&&this.playing&&this.toolObj.visible&&(this.toolObj.userData.spin.rotation.z-=e*30,s=!0),t-this.uiT>(this.playing?90:30)&&(this.uiT=t,this.updateUI(this.shownPos??this.cursor)),s||this.playing||!n}timeToCursor(t){let e=this.D.cum,n=this.n;if(t>=e[n])return n;let s=0,r=n-1;for(;s<r;){let a=s+r+1>>1;e[a]<=t?s=a:r=a-1}let o=e[s+1]-e[s];return s+(o>0?Math.min((t-e[s])/o,1):1)}cursorToTime(t){let e=Math.min(Math.floor(t),this.n),n=this.D.cum;return e>=this.n?n[this.n]:n[e]+(n[e+1]-n[e])*(t-e)}setCursor(t){this.cursor=Math.max(0,Math.min(t,this.n)),this.playTime=this.cursorToTime(this.cursor),this.uiT=0,this.stage.invalidate()}moveAt(t){return Math.max(0,Math.min(Math.ceil(t)-1,this.n-1))}pose(t,e,n,s){let r=this.D,o=t*3,a=this.segs[this.segOf(t)],l=r.phi[t];if(l>0&&e<l&&t>0){let h=e/l,u=h<.5?4*h*h*h:1-Math.pow(-2*h+2,3)/2,d=this.segs[this.segOf(t-1)],f=d.quat,g=a.quat,_=new R(r.FE[o-3],r.FE[o-2],r.FE[o-1]),m=new R(r.FS[o],r.FS[o+1],r.FS[o+2]),p=new R(...d.o),w=new R(...a.o);s.slerpQuaternions(f,g,u);let b=s.clone().multiply(f.clone().invert()),v=p.clone().lerp(w,u);n.copy(_).sub(p).applyQuaternion(b).add(v);let L=_.clone().sub(p).applyQuaternion(g.clone().multiply(f.clone().invert())).add(w);return n.addScaledVector(m.clone().sub(L),u),!0}let c=this.cutFrac(t,e);return n.set(r.FS[o]+(r.FE[o]-r.FS[o])*c,r.FS[o+1]+(r.FE[o+1]-r.FS[o+1])*c,r.FS[o+2]+(r.FE[o+2]-r.FS[o+2])*c),s.copy(a.quat),!1}machinePose(t,e){let n=this.D,s=t*3,r=this.segOf(t),o=this.segs[r],a=this.mc.dims.pivot,l=n.phi[t];if(l>0&&e<l&&t>0){let d=this.segs[this.segOf(t-1)],f=mo([n.FE[s-3],n.FE[s-2],n.FE[s-1]],d.ang.Ak,d.ang.Ck,a),g=mo([n.FS[s],n.FS[s+1],n.FS[s+2]],o.ang.Ak,o.ang.Ck,a),_=au(e/l,d.ang,o.ang,f,g,this.mc.dims.zSafe),m=jl(_.C);if(Math.abs(Math.abs(m)-180)<1e-9){for(let p of[o.ang,d.ang])if(Math.abs(Math.abs(p.C)-180)<1e-9){m=p.C;break}}return{indexing:!0,phase:_.phase,A:_.A,C:_.C,tip:_.tip,dispA:_.A,dispC:m,seg:r,from:this.segOf(t-1),tableMoves:this.swingMoves(r)}}let c=new R,h=new Ee;this.pose(t,e,c,h);let u=mo([c.x,c.y,c.z],o.ang.Ak,o.ang.Ck,a);return{indexing:!1,phase:"cut",A:o.ang.Ak,C:o.ang.Ck,tip:u,dispA:o.ang.A,dispC:o.ang.C,seg:r,P:c,Q:h}}placeTool(t){let e=this.n;if(!e)return;let n=this.moveAt(t),s=Math.min(Math.max(t-n,0),1);if(this.updateTool(n),!this.toolObj)return;let r=this.toolObj;if(this.mode==="machine"){let l=this.mp=this.machinePose(n,s);Yl(this.mc,l.A,l.C),r.position.set(l.tip[0],l.tip[1],l.tip[2]),l.indexing?r.quaternion.identity():r.quaternion.copy(this.segs[l.seg].qTable).multiply(l.Q),this.indexing=l.indexing,this.mc.head.position.set(r.position.x,r.position.y,r.position.z+(r.userData.height||0)),this.arrow.visible=!1}else{this.mp=null,this.indexing=this.pose(n,s,r.position,r.quaternion);let l=t<e&&n<this.segs[this.segOf(n)].firstCut&&this.segOf(n)>0;this.arrow.visible=(!!this.indexing||l)&&t<e,this.arrow.visible&&this.placeArrow(r.quaternion,this.segOf(n))}this.spinning=(this.D.TL[n]>>6&1)===1&&!this.indexing,r.visible=this.showTool!==!1&&t<e,this.mc.head.visible=this.mode==="machine"&&this.showTool!==!1;let o=t<e&&s>0?this.D.fix[n]:0;o!==this.shownFix&&(this.shownFix=o,this.vise.meshes.forEach((l,c)=>{let h=o>>c&1;l.material.emissive.set(h?13639712:0),l.material.emissiveIntensity=h?.9:0,l.userData.kind==="table"&&this.mc.mats.platter.emissive.set(h?10491157:0)}),r.traverse(l=>{l.material&&l.material.emissive&&!l.userData.band&&l.material.emissive.set(o?8392720:0)}),this.fixWarn.hidden=!o);let a=this.segOf(n);a!==this.shownSeg&&(this.shownSeg=a,this.follow&&this.playing&&this.mode==="part"&&this.view("setup"))}buildArrow(t){let e=new he,n=t*.32,s=t*.012,r=new $t({color:16756768,emissive:16756768,emissiveIntensity:.35,metalness:.1,roughness:.5,transparent:!0,opacity:.9}),o=new Hr(s*2.6,s*7,24);o.rotateX(-Math.PI/2),o.translate(0,0,s*3.5);let a=new ye(s,s,n,16);a.rotateX(Math.PI/2),a.translate(0,0,s*7+n/2),e.add(new It(o,r),new It(a,r)),e.userData.mat=r,e.visible=!1;let l=new R(...this.D.meta.stock.lo),c=new R(...this.D.meta.stock.hi);return e.userData.c=l.clone().add(c).multiplyScalar(.5),e.userData.half=c.clone().sub(l).multiplyScalar(.5),e}placeArrow(t,e){let n=this.arrow,s=new R(0,0,1).applyQuaternion(t),r=n.userData.half,o=Math.abs(s.x)*r.x+Math.abs(s.y)*r.y+Math.abs(s.z)*r.z;n.position.copy(n.userData.c).addScaledVector(s,o+this.stage.diag*.02),n.quaternion.copy(t),n.userData.mat.color.set(Le[e%Le.length]),n.userData.mat.emissive.set(Le[e%Le.length])}updateTool(t){let e=this.n?this.D.TL[Math.min(t,this.n-1)]&31:0;if(e===this.curTool)return;this.curTool=e,this.toolObj&&this.stage.scene.remove(this.toolObj),this.toolObj=null;let n=this.D.meta.tools[e];if(n){if(!this.toolModels[e]){let s=ql(n,this.toolColor(e));s.traverse(r=>{r.material&&r.material.emissive&&r.material.emissiveIntensity>0&&(r.userData.band=!0)}),this.toolModels[e]=s}this.toolObj=this.toolModels[e],this.toolObj.visible=this.showTool!==!1,this.shownFix=-1,this.stage.scene.add(this.toolObj)}}view(t,e=!0){let n=this.stage,s,r=this.fitLo,o=this.fitHi,a=1.3;if(this.mode==="machine"){r=this.mFitLo,o=this.mFitHi,a=1;let u={machine:n.camera.aspect<.9?[-.7,-1,.9]:[-.78,-1.2,.74],iso:[-.78,-1.2,.74],front:[0,-1,.3],side:[-1,-.08,.3],top:[0,-1e-4,1],back:[.6,1,.55]};s=new R(...u[t]||u.machine),t==="top"&&(a=1.02)}else{if(["iso","top","front"].includes(t)){n.view(t,e);return}if(t==="back")s=new R(.25,1,.45);else if(t==="setup"){let h=this.segs[this.segOf(Math.max(this.moveAt(this.cursor),0))];s=new R(h.R[0][2],h.R[1][2],h.R[2][2]).clone().multiplyScalar(1.6).add(new R(-.35,-.5,.45)),s.lengthSq()<1e-6&&s.set(-.85,-1.25,1.05)}else s=new R(-.85,-1.25,1.05)}let{pos:l,target:c}=n.fitBox(s.normalize(),r,o,a);n.flyTo(l,c,e)}buildTimeline(){let t=this.segs,e=this.total||1,n=this.N,s=Math.min(.03,.35/Math.max(n,1)),r=t.map(u=>this.cursorToTime(u.a)),o=t.map(u=>this.cursorToTime(u.b)),a=t.map((u,d)=>Math.max((o[d]-r[d])/e,s)),l=a.reduce((u,d)=>u+d,0)||1;a=a.map(u=>u/l);let c=[],h=0;for(let u of a)c.push(h),h+=u;this.tl={t0:r,t1:o,w:a,U:c}}uToTime(t){let{t0:e,t1:n,w:s,U:r}=this.tl;if(t>=1)return this.total;let o=0;for(;o<this.N-1&&t>=r[o+1];)o++;return e[o]+Math.min(Math.max((t-r[o])/s[o],0),1)*(n[o]-e[o])}timeToU(t){let{t0:e,t1:n,w:s,U:r}=this.tl;if(t>=this.total)return 1;let o=0;for(;o<this.N-1&&t>=e[o+1];)o++;let a=n[o]-e[o];return r[o]+(a>0?Math.min(Math.max((t-e[o])/a,0),1):0)*s[o]}cursorToU(t){return this.timeToU(this.cursorToTime(t))}uToCursor(t){return this.timeToCursor(this.uToTime(t))}seekSwing(t,e){let s=this.segs[Math.max(1,Math.min(t,this.N-1))].a,r=this.D.phi[s]||0;return this.playing=!1,this.syncPlay(),this.hideCta(),this.setCursor(s+Math.min(Math.max(e,0),1)*r),this.shownPos=void 0,{seg:Math.max(1,Math.min(t,this.N-1)),cursor:this.cursor,phi:r}}machineCheck(t=24){let e={mode:this.mode,cursor:this.cursor,playing:this.playing};this.playing=!1,this.mode!=="machine"&&this.setMode("machine",!1);let n=this.stage.scene,s=new Xt,r=new R(0,0,1),o=new R,a=new Ee,l=0,c=0,h=0,u=0,d=0,f=[];for(let p=0;p<this.N;p++){let w=this.segs[p],b=w.b-w.a,v=new Set([w.a,w.b-1,w.firstCut]);for(let A=0;A<t;A++)v.add(w.a+Math.floor((A+.5)*b/t));let L=0;for(let A of v)for(let M of[.5,1,this.D.phi[A]>0?(1+this.D.phi[A])/2:.25]){let y=A+M;if(this.D.phi[A]>0&&M<this.D.phi[A])continue;this.placeTool(y),n.updateMatrixWorld(!0);let x=this.toolObj;if(!x||this.mp.indexing)continue;let T=r.clone().transformDirection(x.matrixWorld);l=Math.max(l,T.distanceTo(r));let F=new R().setFromMatrixPosition(x.matrixWorld);s.copy(this.mc.part.matrixWorld).invert();let D=F.clone().applyMatrix4(s),U=T.clone().transformDirection(s),k=new R(w.R[0][2],w.R[1][2],w.R[2][2]);c=Math.max(c,U.distanceTo(k)),this.pose(A,M,o,a);let z=D.distanceTo(o);h=Math.max(h,z),L=Math.max(L,z),u++}if(p>0&&this.D.phi[w.a]>0)for(let A of[.1,.3,.5,.7,.9])this.placeTool(w.a+A*this.D.phi[w.a]),n.updateMatrixWorld(!0),l=Math.max(l,r.clone().transformDirection(this.toolObj.matrixWorld).distanceTo(r)),d++;this.placeTool(Math.min(w.firstCut+.5,this.n));let P=Zl(w.R);f.push({segment:p+1,A:this.mp.dispA,C:this.mp.dispC,A_expected:P.A,C_expected:P.C,A_sim:w.A_deg??null,C_sim:w.C_deg??null,A_table:w.ang.Ak,C_table:w.ang.Ck,maxTipErrMm:L})}let g=Math.max(0,...f.map(p=>Math.max(Math.abs(p.A-p.A_expected),Math.abs(p.C-p.C_expected)))),_=Math.max(0,...f.filter(p=>p.A_sim!==null).map(p=>Math.max(Math.abs(p.A-p.A_sim),Math.abs(jl(p.C-p.C_sim)))));return e.mode!=="machine"&&this.setMode(e.mode,!1),this.setCursor(e.cursor),this.shownPos=void 0,this.placeTool(e.cursor),this.playing=e.playing,{maxSpindleDirErr:l,maxToolAxisInPartErr:c,maxTipErrMm:h,maxAngleErrDeg:g,maxAngleVsSetupsJsonDeg:_,samples:u,swingSamples:d,setups:f,pass:l<=1e-6&&c<=1e-6&&h<=1e-6&&g<=1e-9&&_<=.006,method:"three.js matrixWorld of the rendered tool and part group; reference tip = Part view pose() in G54"}}buildUI(){let t=this.D,e=this.n,n=this.els,s=this.segs;n.controls.innerHTML=`
      <div class="tl-wrap">
        <div class="tl" role="slider" tabindex="0" aria-label="Program position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="tl-bands"></div><div class="tl-marks"></div><div class="tl-fill"></div><div class="tl-thumb"></div>
        </div>
        <div class="setup-strip" role="group" aria-label="Setups"></div>
      </div>
      <div class="ctl-row">
        <button class="ib play" type="button" aria-label="Play">${pn.play}</button>
        <button class="ib" type="button" data-act="start" aria-label="Back to start" title="Back to start">${pn.start}</button>
        <button class="ib" type="button" data-act="pseg" aria-label="Previous setup" title="Previous setup">${pn.prevSeg}</button>
        <button class="ib" type="button" data-act="back" aria-label="Previous move" title="Previous move (\u2190)">${pn.back}</button>
        <button class="ib" type="button" data-act="fwd" aria-label="Next move" title="Next move (\u2192)">${pn.fwd}</button>
        <button class="ib" type="button" data-act="nseg" aria-label="Next setup" title="Next setup">${pn.nextSeg}</button>
        <button class="ib" type="button" data-act="end" aria-label="Jump to end" title="Jump to the end">${pn.end}</button>
        <span class="time mono" aria-live="off">0:00 / ${Ds(this.total)}</span>
        <label class="speed-l">Speed <select class="speed">${ts.map(M=>`<option value="${M}" ${M===this.speed?"selected":""}>${M}\xD7</option>`).join("")}<option value="turbo">max</option></select></label>
      </div>
      <div class="ctl-row opts">
        <label>Colour <select class="colour"><option value="0">by tool</option><option value="1">by setup</option><option value="2">aluminium</option></select></label>
        <label>Path <select class="pathmode"><option value="recent">recent cuts</option><option value="next">recent + next</option><option value="all">all (past + future)</option><option value="past">past only</option><option value="none">off</option></select></label>
        <label class="chk"><input type="checkbox" class="rapids" checked> rapids</label>
        <label class="chk"><input type="checkbox" class="ghost"> target</label>
        <label class="chk"><input type="checkbox" class="showtool" checked> tool</label>
        <label class="chk"><input type="checkbox" class="showvise" checked> vise</label>
        <label class="chk part-only" title="Part view: turn the camera towards each setup's tool axis when playback enters it"><input type="checkbox" class="follow" checked> follow setup</label>
        <span class="seg views" role="group" aria-label="Camera"><button type="button" data-view="iso">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button><button type="button" data-view="back">Back</button><button type="button" data-view="setup" class="part-only" title="Look along the current setup's tool axis">Setup</button><button type="button" data-view="side" class="mach-only" title="Look along the A axis">Side</button></span>
      </div>`;let r=M=>n.controls.querySelector(M);this.playBtn=r(".play"),this.tlEl=r(".tl"),this.timeEl=r(".time"),this.playBtn.onclick=()=>this.togglePlay();let o=()=>{this.playing=!1,this.syncPlay(),this.hideCta()};n.controls.querySelectorAll("[data-act]").forEach(M=>M.onclick=()=>{let y=M.dataset.act;o(),y==="start"?this.setCursor(0):y==="end"?this.setCursor(e):y==="back"?this.setCursor(Math.ceil(this.cursor)-1):y==="fwd"?this.setCursor(Math.floor(this.cursor)+1):(y==="pseg"||y==="nseg")&&this.stepSeg(y==="nseg"?1:-1)});let a=this.tlEl,l=M=>{let y=a.getBoundingClientRect(),x=Math.min(Math.max((M.clientX-y.left)/Math.max(y.width,1),0),1);this.setCursor(this.uToCursor(x))};a.addEventListener("pointerdown",M=>{if(M.button!==0)return;M.preventDefault(),o(),a.focus({preventScroll:!0});try{a.setPointerCapture(M.pointerId)}catch{}l(M);let y=T=>l(T),x=()=>{a.removeEventListener("pointermove",y),a.removeEventListener("pointerup",x),a.removeEventListener("pointercancel",x)};a.addEventListener("pointermove",y),a.addEventListener("pointerup",x),a.addEventListener("pointercancel",x)}),a.addEventListener("keydown",M=>{let y=this.cursorToU(this.cursor),x=null;if(M.key==="ArrowRight"||M.key==="ArrowUp")x=y+.005;else if(M.key==="ArrowLeft"||M.key==="ArrowDown")x=y-.005;else if(M.key==="PageUp"){M.preventDefault(),o(),this.stepSeg(1);return}else if(M.key==="PageDown"){M.preventDefault(),o(),this.stepSeg(-1);return}else M.key==="Home"?x=0:M.key==="End"&&(x=1);x!==null&&(M.preventDefault(),o(),this.setCursor(this.uToCursor(Math.min(Math.max(x,0),1))))}),r(".speed").onchange=M=>{let y=M.target.value;this.speed=y==="turbo"?Math.max(this.total/12,1):+y},r(".colour").onchange=M=>{this.mat5.setMode(+M.target.value),this.stage.invalidate()},r(".pathmode").onchange=M=>this.setPathMode(M.target.value),r(".pathmode").value=e>3e3?"recent":"next",this.setPathMode(r(".pathmode").value),r(".rapids").onchange=M=>{this.path.material.uniforms.uRapids.value=M.target.checked?1:0,this.stage.invalidate()},r(".ghost").onchange=M=>{this.ghost.visible=M.target.checked,this.legGhost.hidden=!M.target.checked,this.stage.invalidate()},r(".showtool").onchange=M=>{this.showTool=M.target.checked,this.shownPos=void 0,this.stage.invalidate()},r(".showvise").onchange=M=>{this.vise.group.visible=M.target.checked,this.stage.invalidate()},r(".follow").onchange=M=>{this.follow=M.target.checked},n.controls.querySelectorAll("[data-view]").forEach(M=>M.onclick=()=>this.view(M.dataset.view));let c=M=>(100*this.cursorToU(M)).toFixed(3);r(".tl-bands").innerHTML=s.map((M,y)=>`<i style="left:${(100*this.tl.U[y]).toFixed(3)}%;width:${(100*this.tl.w[y]).toFixed(3)}%;--sc:${Le[y%Le.length]}"></i>`).join("");let h="",u=-1;for(let M=0;M<e;M++){let y=t.TL[M]&31;y!==u&&y&&(h+=`<i class="tc" style="left:${c(M)}%;background:${this.toolColor(y)}" title="T${y} from line ${t.line[M]}"></i>`),u=y}let d=0;for(let M=0;M<e&&d<300;M++)t.crash[M]&&(h+=`<i class="err" style="left:${c(M)}%" title="crash flag at line ${t.line[M]}"></i>`,d++);let f=Math.max(1,Math.round(e*.003));for(let M=0,y=0;M<e&&y<200;M++){if(!t.fix[M])continue;let x=M,T=M;for(;T<e&&T-x<=f;)t.fix[T]&&(x=T),T++;let F=this.cursorToU(M),D=this.cursorToU(x+1);h+=`<i class="fixr" style="left:${(100*F).toFixed(3)}%;width:max(2px,${(100*(D-F)).toFixed(3)}%)" title="tool / holder touches the vise or table, lines ${t.line[M]}\u2013${t.line[x]}"></i>`,M=x,y++}r(".tl-marks").innerHTML=h;let g=r(".setup-strip");g.innerHTML=s.map((M,y)=>{let x=Le[y%Le.length],T=(M.tools||[]).map(U=>"T"+U).join(" "),F=M.fixHits?" has-err":"",D=(this.tl.t1[y]-this.tl.t0[y])/60;return`<button type="button" class="sblk${F}" data-seg="${y}" style="flex:${(100*this.tl.w[y]).toFixed(4)} 1 0;--sc:${x}" title="Setup ${y+1} \xB7 ${fi(M)} \xB7 ${D<1?Math.round(D*60)+" s":D.toFixed(1)+" min"} \xB7 tool axis (${M.tool_axis.map(U=>+U.toFixed(3)).join(", ")}) \xB7 ${T} \xB7 lines ${M.first_line}\u2013${M.last_line}${M.fixHits?" \xB7 touches the vise":""}">${Jl(M.tool_axis,18,x)}<span class="sb-n">${y+1}</span><span class="sb-l">${fi(M)}</span></button>`}).join(""),g.querySelectorAll("[data-seg]").forEach(M=>M.onclick=()=>{o(),this.gotoSeg(+M.dataset.seg)}),this.strip=g;let _=document.createElement("div");_.className="vp-mode seg",_.setAttribute("role","group"),_.setAttribute("aria-label","View"),_.innerHTML=`<button type="button" data-mode="machine" aria-pressed="true" title="The table tilts (A) and turns (C) the part under a vertical spindle">Machine view</button><button type="button" data-mode="part" aria-pressed="false" title="The part stays still and the tool comes in along each setup's axis">Part view</button>`,n.view.appendChild(_),this.modeBtns=[..._.querySelectorAll("[data-mode]")],this.modeBtns.forEach(M=>M.onclick=()=>this.setMode(M.dataset.mode));let m=document.createElement("button");m.type="button",m.className="vp-cta",m.innerHTML=`${pn.play}<span>Play the first table move</span>`,m.onclick=()=>{m.hidden=!0,this.playFirstTilt()},n.view.appendChild(m),this.cta=m;let p=document.createElement("div");p.className="dro",p.setAttribute("aria-label","Machine position readout"),p.innerHTML=`<div class="dro-ax">${["X","Y","Z","A","C"].map(M=>`<div class="dro-r ${M==="A"||M==="C"?"rot":""}"><span class="dro-l">${M}</span><span class="dro-v" data-ax="${M}">0.000</span></div>`).join("")}</div><div class="dro-t"><i class="dot"></i><span class="dro-tool">\u2013</span></div><div class="dro-line mono"></div><div class="dro-phase"></div>`,n.view.appendChild(p),this.droEl=p,this.droV=Object.fromEntries([...p.querySelectorAll("[data-ax]")].map(M=>[M.dataset.ax,M]));let w=document.createElement("div");w.className="hud",w.innerHTML='<div class="hud-setup"><span class="hs-ico"></span><span class="hs-txt"></span></div><div class="hud-tool"><i class="dot"></i><span class="tname">\u2013</span></div><div class="hud-state mono"></div>',n.view.appendChild(w),this.hud=w;let b=document.createElement("div");b.className="fix-warn",b.hidden=!0,b.textContent="tool / holder touches the vise or table",n.view.appendChild(b),this.fixWarn=b;let v=document.createElement("div");v.className="vp-status",n.view.appendChild(v),this.statusEl=v;let L=document.createElement("div");L.className="vp-legend",L.innerHTML=t.toolsUsed.map(M=>`<span><i style="background:${this.toolColor(M)}"></i>T${M}</span>`).join("")+`<span><i class="dash" style="--c:${Is}"></i>rapid</span><span class="lg-ghost" hidden><i style="background:#2f8cff"></i>target part (overlay)</span>`,n.view.appendChild(L),this.legGhost=L.querySelector(".lg-ghost"),n.side.innerHTML=`
      <div class="cur-setup"><div class="cs-ico"></div><div class="cs-body"><div class="cs-head"><span class="cb-label">Setup</span><span class="cs-n mono"></span></div>
        <div class="cs-title"></div><div class="cs-sub muted small"></div></div></div>
      <div class="cur-block"><div class="cb-head"><span class="cb-label">Current block</span><span class="cb-line mono"></span></div><div class="cb-code mono"></div>
        <dl class="cb-facts"><div><dt>Tool</dt><dd class="f-tool">\u2013</dd></div><div><dt>Feed</dt><dd class="f-feed">\u2013</dd></div><div><dt>Spindle</dt><dd class="f-rpm">\u2013</dd></div><div><dt>Move</dt><dd class="f-move">\u2013</dd></div>
        <div class="wide"><dt>Tool tip in the setup frame (G68.2)</dt><dd class="f-work mono">\u2013</dd></div></dl></div>
      <div class="gc"></div>`;let P=new Map;for(let M of t.meta.issues||[])for(let y of M.lines?.length?M.lines:[M.line])y&&P.set(y,M.severity==="error"?"error":P.get(y)||"warning");this.list=new Ls(n.side.querySelector(".gc"),t.gcode,{onPick:M=>this.gotoLine(M,!1),marks:P});let A=M=>n.side.querySelector(M);this.cb={line:A(".cb-line"),code:A(".cb-code"),tool:A(".f-tool"),feed:A(".f-feed"),rpm:A(".f-rpm"),move:A(".f-move"),work:A(".f-work")},this.csEl={ico:A(".cs-ico"),n:A(".cs-n"),title:A(".cs-title"),sub:A(".cs-sub")},n.view.tabIndex=0,n.view.addEventListener("keydown",M=>{M.key===" "?(M.preventDefault(),this.togglePlay()):M.key==="ArrowRight"?(M.preventDefault(),this.setCursor(Math.floor(this.cursor)+1)):M.key==="ArrowLeft"&&(M.preventDefault(),this.setCursor(Math.ceil(this.cursor)-1))})}stepSeg(t){let e=this.segOf(this.moveAt(this.cursor)),n=this.cursor<=this.segs[e].firstCut+1e-9,s=t>0?e+1:n?e-1:e;this.gotoSeg(Math.max(0,Math.min(s,this.N-1)),t>0&&e>=this.N-1)}gotoSeg(t,e=!1){if(this.hideCta(),e){this.setCursor(this.n);return}let n=this.segs[t];this.setCursor(n.firstCut),this.uiT=0,this.follow&&this.mode==="part"&&(this.shownSeg=t,this.view("setup"))}setPathMode(t){let e=this.path.material.uniforms;this.pathMode=t,this.shownPos=void 0,this.path.visible=t!=="none",e.uFuture.value=t==="past"||t==="recent"?0:1,e.uWin.value=t==="recent"||t==="next"?Math.max(300,this.n*.006):1e9,e.uFutA.value=t==="next"?.12:.22,e.uOldA.value=.1,this.stage.invalidate()}hideCta(){this.cta&&(this.cta.hidden=!0)}togglePlay(){this.hideCta(),!this.playing&&this.cursor>=this.n&&this.setCursor(0),this.playing=!this.playing,this.lastT=performance.now(),this.syncPlay(),this.playing&&this.follow&&this.mode==="part"&&(this.shownSeg=this.segOf(this.moveAt(this.cursor)),this.view("setup")),this.stage.invalidate()}syncPlay(){this.playBtn.innerHTML=this.playing?pn.pause:pn.play,this.playBtn.setAttribute("aria-label",this.playing?"Pause":"Play"),this.playBtn.classList.toggle("on",this.playing)}gotoLine(t,e=!0){let n=this.D.firstMove,s=Math.max(0,Math.min(t,n.length-1)),r=n[s];this.playing=!1,this.syncPlay(),r>=0&&r<this.n&&this.setCursor(r+1),this.list.setCurrent(r>=0&&r<this.n?this.D.line[r]:t,!0),this.uiT=0,e&&this.els.view.scrollIntoView({behavior:"smooth",block:"center"})}rpmAt(t){let e=this.D.meta.rpm_changes;if(!e.length)return 0;let n=0,s=e.length-1;for(;n<s;){let r=n+s+1>>1;e[r][0]<=t?n=r:s=r-1}return e[n][1]}updateUI(t){let e=this.D,n=this.n,s=this.cursorToU(this.cursor);if(this.tlEl.style.setProperty("--u",(100*s).toFixed(3)+"%"),this.tlEl.setAttribute("aria-valuenow",(100*s).toFixed(1)),this.timeEl.textContent=`${Ds(this.cursorToTime(this.cursor))} / ${Ds(this.total)}`,!n)return;let r=this.moveAt(t),o=this.segOf(r),a=this.segs[o],l=e.line[r];this.list.setCurrent(l);let c=e.TL[r]&31,h=e.TL[r]>>5&1,u=e.TL[r]>>6&1,d=e.meta.tools[c],f=r*3,g=Math.min(Math.max(t-r,0),1),_=this.cutFrac(r,g),m=e.S[f]+(e.E[f]-e.S[f])*_,p=e.S[f+1]+(e.E[f+1]-e.S[f+1])*_,w=e.S[f+2]+(e.E[f+2]-e.S[f+2])*_,b=this.list.line(l)||" ";this.tlEl.setAttribute("aria-valuetext",`${Ds(this.cursorToTime(this.cursor))}, setup ${o+1} of ${this.N}, line ${l}`),this.cb.line.textContent=`line ${l}`,this.cb.code.textContent=b,this.cb.tool.textContent=d?`T${c} \xB7 ${d.name}`:"none",this.cb.feed.textContent=h?"rapid":`F${Math.round(e.feed[r])}`;let v=this.rpmAt(r);this.cb.rpm.textContent=u?`S${Math.round(v)}`:"off",this.cb.move.textContent=`${Math.min(Math.ceil(t),n).toLocaleString()} / ${n.toLocaleString()}`,this.cb.work.textContent=`X${m.toFixed(3)} Y${p.toFixed(3)} Z${w.toFixed(3)}`;let L=Le[o%Le.length];if(this._uiSeg!==o){this._uiSeg=o;let A=a.tool_axis.map(M=>Math.abs(M)<5e-4?0:+M.toFixed(3));this.csEl.ico.innerHTML=Jl(a.tool_axis,44,L),this.csEl.n.textContent=`${o+1} / ${this.N}`,this.csEl.title.textContent=`${fi(a)} \xB7 ${(a.tools||[]).map(M=>"T"+M).join(", ")||"no tool"}`,this.csEl.sub.textContent=`tool axis (${A.join(", ")}) \xB7 G68.2 IJK ${(a.ijk||[0,0,0]).map(M=>+(+M).toFixed(2)).join(" ")} \xB7 lines ${a.first_line}\u2013${a.last_line}`,this.hud.querySelector(".hs-ico").innerHTML=Jl(a.tool_axis,22,L),this.strip.querySelectorAll(".sblk").forEach(M=>M.classList.toggle("cur",+M.dataset.seg===o))}let P=d?`T${c} \xB7 ${d.name}`:"no tool";if(this.mode==="machine"&&this.mp){let A=this.mp,M={X:A.tip[0],Y:A.tip[1],Z:A.tip[2],A:A.dispA,C:A.dispC};for(let F of Object.keys(M))this.droV[F].textContent=L_(M[F],9);this.droEl.querySelector(".dot").style.background=d?this.toolColor(c):"transparent";let y=this.droEl.querySelector(".dro-tool");y.textContent=P,y.title=P,this.droEl.querySelector(".dro-line").textContent=`N${l}  ${b.trim()}`;let x=A.indexing?{retract:"retract (Z up)",swing:this.swingText(A.from,A.seg),approach:"re-approach"}[A.phase]:"",T=this.droEl.querySelector(".dro-phase");T.textContent=A.indexing?`Re-orienting to setup ${o+1} \xB7 ${x}`:`Setup ${o+1}/${this.N} \xB7 ${h?"G0 rapid":"F"+Math.round(e.feed[r])} \xB7 ${u&&!A.indexing?"S"+Math.round(v):"spindle off"}`,T.classList.toggle("on",!!A.indexing),this.droEl.classList.toggle("swinging",!!A.indexing)}else this.hud.querySelector(".hs-txt").textContent=this.indexing?`indexing to setup ${o+1} \xB7 ${fi(a)}`:`setup ${o+1}/${this.N} \xB7 ${fi(a)}`,this.hud.querySelector(".dot").style.background=d?this.toolColor(c):"transparent",this.hud.querySelector(".tname").textContent=P,this.hud.querySelector(".hud-state").textContent=`${h?"G0 rapid":"F"+Math.round(e.feed[r])}  ${u?"S"+Math.round(v):"spindle off"}
X${m.toFixed(3)} Y${p.toFixed(3)} Z${w.toFixed(3)} (G68.2 setup frame)`;this.updateStatus()}updateStatus(){let t="";if(!this.caught)t='<span class="spin"></span> computing\u2026';else if(this.workerState==="running")t=`<span class="spin"></span> pre-computing keyframes ${Math.round(100*(this.workerProgress||0)/this.n)}%`;else if(this.replay){let e=this.replay.pct>=99.5;t=`<span class="${e?"okc":"badc"}">${e?"\u2713":"!"}</span> replay matches simulator on ${this.replay.pct.toFixed(2)}% of cells`,this.statusEl.title=`Browser replay of every setup vs the simulator's exact height fields: max |\u0394| ${this.replay.max.toFixed(4)} mm over ${this.replay.cells.toLocaleString()} cells; pre-computed in ${(this.workerMs/1e3).toFixed(1)} s`}t!==this._st&&(this._st=t,this.statusEl.innerHTML=t,this.statusEl.hidden=!t)}};function D_(i){return new Xt().set(i[0][0],i[0][1],i[0][2],0,i[1][0],i[1][1],i[1][2],0,i[2][0],i[2][1],i[2][2],0,0,0,0,1)}var Ns=i=>String(i??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),pi=[{hi:.4,c:"#e9f5ec"},{hi:.8,c:"#b9e0c3"},{hi:1.6,c:"#7fc597"},{hi:3.2,c:"#f2c14e"},{hi:6.3,c:"#e8833a"},{hi:12.5,c:"#c2412f"},{hi:1/0,c:"#7a1f1f"}],tc=pi.map(i=>ze(i.c));function U_(i){for(let t=0;t<pi.length;t++)if(i<=pi[t].hi)return tc[t];return tc[tc.length-1]}var xo=class{constructor(t,e){this.D=t;let n=t.meta,s=this.tol=n.tolerance||.1,r=this.stage=new Vn(e.view,n.stock);r.plate.visible=!1,_o(r,e.view);let o=t.meshV,a=new R(1/0,1/0,1/0),l=new R(-1/0,-1/0,-1/0);for(let y=0;y<o.length;y+=3)a.min(new R(o[y],o[y+1],o[y+2])),l.max(new R(o[y],o[y+1],o[y+2]));this.partLo=a,this.partHi=l,r.fitLo=a.clone(),r.fitHi=l.clone(),this.touched=!1,e.view.addEventListener("pointerdown",()=>{this.touched=!0}),this.startView=this.bestView(t.meta.regions||[]);let c=new IntersectionObserver(y=>{y[0].isIntersecting&&(this.touched||(r.resize(),this.view(this.startView,!1)),c.disconnect())});c.observe(e.view),this.view(this.startView,!1);let h=r.key.shadow.camera,u=r.diag*1.1;Object.assign(h,{left:-u,right:u,top:u,bottom:-u,far:r.diag*6}),h.updateProjectionMatrix(),this.hasCls=n.mesh?.cls_kind==="score";let d=new ue;d.setAttribute("position",new Kt(t.meshV,3)),d.setIndex(new Kt(t.meshF,1)),d.computeVertexNormals();let f=t.meshDev.length,g=new Float32Array(f*3),_=new Nt,m=ze(ke.witness),p=0;for(let y=0;y<f;y++){let x=this.hasCls&&t.meshCls[y]===1;x&&p++;let T=x?m:Qh(t.meshDev[y],s);_.setRGB(T[0],T[1],T[2],ce),g[y*3]=_.r,g[y*3+1]=_.g,g[y*3+2]=_.b}if(this.nWit=p,d.setAttribute("color",new Kt(g,3)),this.devCol=g,t.meshRa&&t.meshRa.length===f){let y=new Float32Array(f*3);for(let x=0;x<f;x++){let T=U_(t.meshRa[x]);_.setRGB(T[0],T[1],T[2],ce),y[x*3]=_.r,y[x*3+1]=_.g,y[x*3+2]=_.b}this.raCol=y}this.target=new It(d,new $t({vertexColors:!0,metalness:.1,roughness:.55,side:We})),this.target.castShadow=!0,this.target.receiveShadow=!0,r.scene.add(this.target);let w=[];this.mach=new di(r.renderer,t.segs,n.stock,w,Le.map(ze)),t.segs.forEach((y,x)=>{y.grid&&this.mach.write(x,y.finalH,y.finalOwn)}),this.mach.setActive(t.segs.length),this.mach.setMode(1),this.mach.group.visible=!1,r.scene.add(this.mach.group),this.machMats=[],this.mach.group.traverse(y=>{y.isMesh&&this.machMats.push(y.material)}),this.ghost=lo(t),this.ghost.visible=!1,r.scene.add(this.ghost),this.vise=Ql(n.vise),this.vise.group.traverse(y=>{y.material&&(y.material.transparent=!0,y.material.opacity=y.isMesh?.3:.15,y.material.depthWrite=!1),y.isMesh&&(y.castShadow=!1)}),this.vise.group.traverse(y=>{y.userData.kind==="table"&&(y.visible=!1)}),this.vise.group.visible=!1,r.scene.add(this.vise.group);let b=new R(...n.stock.lo),v=new R(...n.stock.hi),L=new Se(v.x-b.x,v.y-b.y,v.z-b.z);L.translate((b.x+v.x)/2,(b.y+v.y)/2,(b.z+v.z)/2),this.stockGhost=new he;let P=new It(L,new Xe({color:15769648,transparent:!0,opacity:.1,depthWrite:!1})),A=new on(new Hn(L),new fn({color:14715408}));this.stockGhost.add(P,A),this.stockGhost.visible=!1,r.scene.add(this.stockGhost),this.mode="dev",this.buildBar(e.bar),this.buildMarkers(e.view);let M=n.score||{};if(M.whole_surface_in_tol_pct!=null){let y=document.createElement("div");y.className="res-sum";let x=T=>T==null?"\u2013":(+T).toFixed(2)+"%";y.innerHTML=`<b>${x(M.whole_surface_in_tol_pct)}</b> in tolerance \xB7 <span class="rs-p">${x(M.whole_surface_proud_pct)} proud</span> \xB7 <span class="rs-g">${x(M.whole_surface_gouge_pct)} gouged</span><div class="rs-v">Some failures face away from this view: use Below / Back, or click a region.</div>`,e.view.appendChild(y)}this.buildCard(e.view),this.buildPick(e.view),r.onFrame=()=>(this.placeMarkers(),!1),e.view.querySelector(".vp-msg")?.remove(),r.invalidate()}viewDirs(){return{iso:this.stage.camera.aspect<.9?[-.6,-1,1.55]:[-.85,-1.25,1.05],top:[0,-1e-4,1],front:[0,-1,.28],back:[0,1,.28],right:[1,0,.28],left:[-1,0,.28],under:[-.6,-1,-.9],isoBack:[.85,1.25,1.05]}}bestView(t){let e=this.viewDirs(),n="iso",s=-1/0;for(let r of["iso","under","isoBack"]){let o=new R(...e[r]).normalize(),a=0;for(let l of t){let c=l.normal||[0,0,1];a+=(l.area_mm2||0)*Math.max(0,o.x*c[0]+o.y*c[1]+o.z*c[2])}r==="iso"&&(a*=1.15),a>s&&(s=a,n=r)}return n}setGhostMach(t){for(let e of this.machMats)e.transparent=t,e.opacity=t?.35:1,e.depthWrite=!t,e.needsUpdate=!0}setMode(t){if(this.markers&&t!==this.mode&&this.closeCard(),this.mode=t,this.target.visible=t==="dev"||t==="ra",this.raCol){let n=this.target.geometry.getAttribute("color");n.array.set(t==="ra"?this.raCol:this.devCol),n.needsUpdate=!0}this.markerLayer&&(this.markerLayer.style.display=t==="dev"?"":"none");let e=this.bar.querySelector(".ra-legend");e&&(e.hidden=t!=="ra"),this.bar.querySelectorAll("[data-mode]").forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.mode===t))),this.bar.querySelector(".ovl-label").textContent=t==="mach"?"target part overlay":"machined part overlay",this.bar.querySelector(".ovl-sw").style.background=t==="mach"?"#2f8cff":"#9aa3ad",this.bar.querySelector(".dev-legend").hidden=t!=="dev",this.bar.querySelector(".mach-legend").hidden=t!=="mach",this.applyOverlay(),this.stage.invalidate()}applyOverlay(){let t=this.bar.querySelector(".ovl").checked;this.ghost.visible=t&&this.mode==="mach",this.mach.group.visible=this.mode==="mach"||t,this.setGhostMach(this.mode==="dev"&&t),this.stage.invalidate()}view(t,e=!0){let n=this.stage,s=this.viewDirs(),r=new R(...s[t]||s.iso).normalize(),{pos:o,target:a}=n.fitBox(r,this.partLo,this.partHi,t==="top"?1.06:1.15);n.flyTo(o,a,e),this.markers&&this.closeCard()}buildBar(t){this.bar=t;let e=this.tol,n=this.D,s=[-1,-.5,0,.5,1];t.innerHTML=`
      <div class="res-ctl">
        <span class="seg" role="group" aria-label="Result display">
          <button type="button" data-mode="dev" aria-pressed="true">Deviation on target</button>
          <button type="button" data-mode="mach" aria-pressed="false">Machined part (by setup)</button>${n.meshRa?'<button type="button" data-mode="ra" aria-pressed="false">Roughness (Ra)</button>':""}
        </span>
        <label class="chk"><input type="checkbox" class="ovl"> <i class="sw ovl-sw" style="background:#9aa3ad"></i><span class="ovl-label">machined part overlay</span></label>
        <label class="chk"><input type="checkbox" class="vise"> <i class="sw" style="background:#6f7c8c"></i>vise</label>
        <label class="chk"><input type="checkbox" class="stk"> <i class="sw" style="background:#f0a030"></i>stock outline</label>
        <label class="chk"><input type="checkbox" class="mk" checked> region labels</label>
        <span class="seg views" role="group" aria-label="View"><button type="button" data-view="iso" title="Reset to the isometric overview">Iso</button><button type="button" data-view="top">Top</button><button type="button" data-view="front">Front</button><button type="button" data-view="back">Back</button><button type="button" data-view="right">Side</button><button type="button" data-view="under">Below</button>${n.meta.partoff&&(n.meta.partoff.tabs||[]).length?'<button type="button" data-view="tabs" title="The part-off tabs on the machined part">Tabs</button>':""}</span>
      </div>
      <div class="cbar dev-legend">
        <div class="cb-title">Signed deviation of the machined part from the target surface (mm). Anything not green is out of tolerance.</div>
        <div class="cb-grad" style="background:${tu(e)}"></div>
        <div class="cb-ticks">${s.map(r=>`<span style="left:${50+r*50}%">${r===0?"\xB1"+e:(r>0?"+":"")+(Math.abs(r)<1?r.toFixed(1):r.toFixed(0))}</span>`).join("")}</div>
        <div class="cb-ends"><span>\u25C0 gouge (cut too deep)</span><span class="mid">in tolerance</span><span>proud (material left) \u25B6</span></div>
        <div class="cls-legend">
          <span><i class="sw" style="background:${ke.ok}"></i>in tolerance (\xB1${e} mm)</span>
          <span><i class="sw" style="background:linear-gradient(90deg, ${ke.proudLo}, ${ke.proudHi})"></i>proud: failed, material left</span>
          <span><i class="sw" style="background:${ke.gouge}"></i>gouge: failed, cut too deep</span>
          <span><i class="sw" style="background:${ke.witness}"></i>tab witness: where a part-off tab joins the part${this.hasCls?this.nWit?"":" (none on this part)":" (not drawn here: this 3D data was exported before the witness was measured)"}</span>
        </div>
      </div>
      ${n.meshRa?`<div class="cbar ra-legend" hidden><div class="cb-title">Estimated surface roughness Ra (\xB5m), kinematic: tool shape, stepover and feed marks only</div>
        <div class="cls-legend">${pi.map((r,o)=>`<span><i class="sw" style="background:${r.c}"></i>${o===0?"\u2264 "+r.hi:o===pi.length-1?"> "+pi[o-1].hi:pi[o-1].hi+"\u2013"+r.hi} \xB5m</span>`).join("")}</div></div>`:""}
      <div class="cbar mach-legend" hidden>
        <div class="cb-title">Machined part = stock \u2229 every setup's cut, coloured by the setup that cut each surface last</div>
        <div class="cls-legend setup-legend">${n.segs.map((r,o)=>`<span><i class="sw" style="background:${Le[o%Le.length]}"></i>${o+1} \xB7 ${fi(r)}</span>`).join("")}<span><i class="sw" style="background:#8c9097"></i>uncut stock face</span></div>
      </div>`,t.querySelectorAll("[data-mode]").forEach(r=>r.onclick=()=>this.setMode(r.dataset.mode)),t.querySelector(".ovl").onchange=()=>this.applyOverlay(),t.querySelector(".vise").onchange=r=>{this.vise.group.visible=r.target.checked,this.stage.invalidate()},t.querySelector(".stk").onchange=r=>{this.stockGhost.visible=r.target.checked,this.stage.invalidate()},t.querySelector(".mk").onchange=r=>{this.markerLayer.hidden=!r.target.checked},t.querySelectorAll("[data-view]").forEach(r=>r.onclick=()=>r.dataset.view==="tabs"?this.viewTabs(0):this.view(r.dataset.view))}regionPoint(t){let e=t.bbox,n=t.normal||[0,0,1],s=[(e[0]+e[3])/2,(e[1]+e[4])/2,(e[2]+e[5])/2],r=[0,1,2].reduce((o,a)=>Math.abs(n[a])>Math.abs(n[o])?a:o,2);return s[r]=n[r]>=0?e[r+3]:e[r],new R(...s)}buildMarkers(t){let e=this.markerLayer=document.createElement("div");e.className="markers",t.appendChild(e),this.regions=this.D.meta.regions||[],this.markers=this.regions.slice(0,12).map(n=>{let s=document.createElement("button");return s.type="button",s.className="marker "+n.type,s.textContent="R"+n.id,s.title=`R${n.id}: ${n.type} ${n.area_mm2} mm\xB2, worst ${n.dev_extreme>0?"+":""}${n.dev_extreme} mm`,s.onclick=()=>this.focusRegion(n.id,!1),e.appendChild(s),{r:n,el:s,p:this.regionPoint(n),n:new R(...n.normal||[0,0,1]).normalize()}})}updateOcclusion(){let t=this.stage.camera.position,e=new Zi;for(let n of this.markers){let s=n.p.clone().sub(t),r=s.length();e.set(t,s.normalize()),e.far=r;let o=e.intersectObject(this.target,!1)[0];n.occluded=!!o&&o.distance<r-Math.max(1,r*.01)}this.occT=performance.now()}placeMarkers(){if(this.markerLayer.hidden)return;let t=this.stage.camera.position,e=t.toArray().map(r=>r.toFixed(2)).join(",");e!==this.camKey&&(this.camKey=e,this.camMoved=performance.now(),this.occDirty=!0),this.occDirty&&performance.now()-this.camMoved>180&&this.mode==="dev"&&(this.occDirty=!1,this.updateOcclusion());let n=this.card&&!this.card.hidden?this.focusId:null,s=[];for(let r of this.markers){let o=this.stage.project(r.p),a=r.n,l=t.clone().sub(r.p).dot(a)>0,c=!o.behind&&(n==null?l&&!r.occluded:r.r.id===n);if(c&&n==null){let h=s.find(u=>Math.abs(u.x-o.x)<30&&Math.abs(u.y-o.y)<20);h?(h.ids.push(r.r.id),c=!1):s.push({x:o.x,y:o.y,mk:r,ids:[r.r.id]})}r.el.hidden=!c,c&&(r.el.style.transform=`translate(${o.x.toFixed(1)}px, ${(o.y-(n!=null?46:0)).toFixed(1)}px)`)}for(let r of s){let o=r.ids.map(a=>"R"+a).join("\xB7");r.mk.el.textContent!==o&&(r.mk.el.textContent=o)}for(let r of this.markers)!s.find(o=>o.mk===r)&&r.el.textContent!=="R"+r.r.id&&(r.el.textContent="R"+r.r.id);if(this.focus&&!this.card.hidden){let r=this.stage.project(this.focus);this.pin.style.transform=`translate(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px)`,this.pin.hidden=r.behind}}buildCard(t){let e=this.card=document.createElement("div");e.className="region-card",e.hidden=!0,e.setAttribute("role","dialog"),e.setAttribute("aria-label","Region details"),window.matchMedia&&window.matchMedia("(max-width: 560px)").matches&&this.bar?(e.classList.add("below"),this.bar.prepend(e)):t.appendChild(e);let n=this.pin=document.createElement("div");n.className="region-pin",n.hidden=!0,t.appendChild(n)}showCard(t){let e=this.D.segs,n={};e.forEach((o,a)=>{o.frame in n||(n[o.frame]=a+1)});let s=(t.nearest_passes||[]).slice(0,5).map(o=>`<button class="gl" type="button" data-gline="${o.line}" title="T${o.tool}, setup ${n[o.frame]??"?"}, missed by ${o.gap_mm} mm">${o.line}</button>`).join(" "),r=t.type==="gouge"?"cut too deep: the surface is below the target":"material left: no pass finished this surface to size";this.card.innerHTML=`<button type="button" class="rc-x" aria-label="Close">\xD7</button>
      <div class="rc-h"><span class="pill ${Ns(t.type)}">${Ns(t.type)}</span> <b>R${t.id}</b> \xB7 ${t.area_mm2} mm\xB2 \xB7 worst ${t.dev_extreme>0?"+":""}${(+t.dev_extreme).toFixed(3)} mm</div>
      <div class="rc-why">Failed: ${r}.</div>
      ${t.where?`<div class="rc-where"><b>Where:</b> ${Ns(t.where)}</div>`:""}
      ${t.hint?`<div class="rc-hint"><b>Why:</b> ${Ns(t.hint_display||t.hint)}</div>`:""}
      ${this.xray?'<div class="rc-f muted">Shown see-through: other faces of the part are in front of this region.</div>':""}
      <div class="rc-f muted">${Ns((t.faces||[]).slice(0,3).join(", "))}</div>
      ${s?`<div class="rc-p"><span class="muted">Nearest passes (G-code line):</span> ${s}</div>`:'<div class="rc-p muted">No pass of the program came near this region.</div>'}`,this.card.hidden=!1,this.card.querySelector(".rc-x").onclick=()=>this.closeCard()}focusRegion(t,e=!0){let n=this.regions.find(_=>_.id===t);if(!n)return;e&&this.stage.container.scrollIntoView({behavior:"smooth",block:"center"}),this.mode!=="dev"&&this.setMode("dev");let s=n.bbox,r=n.normal||[0,0,1],o=new R((s[0]+s[3])/2,(s[1]+s[4])/2,(s[2]+s[5])/2),a=Math.max(s[3]-s[0],s[4]-s[1],s[5]-s[2],6),l=new R(...r).normalize(),c=Math.abs(l.z)>.9?new R(-.6,-.8,0):new R(0,0,1),h=l.clone().addScaledVector(c.sub(l.clone().multiplyScalar(c.dot(l))).normalize(),.06).normalize(),u=Math.max(a*4,14)/Math.tan(this.stage.camera.fov*Math.PI/360)*.5,d=o.clone().addScaledVector(h,u),g=new Zi(d,o.clone().sub(d).normalize(),0,u).intersectObject(this.target,!1)[0];this.setXray(!!g&&g.distance<u-a*.75-1),this.touched=!0,this.stage.flyTo(d,o),this.markers.forEach(_=>_.el.classList.toggle("active",_.r.id===t)),this.focus=this.regionPoint(n),this.focusId=t,this.showCard(n),this.stage.invalidate()}closeCard(){this.card&&(this.card.hidden=!0,this.pin.hidden=!0,this.focusId=null,this.target&&this.xray&&this.setXray(!1),this.markers.forEach(t=>t.el.classList.remove("active")),this.stage.invalidate())}setXray(t){this.xray=t;let e=this.target.material;e.transparent=t,e.opacity=t?.38:1,e.depthWrite=!t,e.needsUpdate=!0,this.stage.invalidate()}viewTabs(t=0){let e=this.D.meta.partoff&&this.D.meta.partoff.tabs||[];if(!e.length)return;this.closeCard(),this.mode!=="mach"&&this.setMode("mach");let n=t<0?e:[e[Math.min(t,e.length-1)]],s=new R(1/0,1/0,1/0),r=new R(-1/0,-1/0,-1/0);for(let l of n){let c=new R(...l.centroid);s.min(c),r.max(c)}s.add(new R(-10,-10,-8)),r.add(new R(10,10,8));let{pos:o,target:a}=this.stage.fitBox(new R(-1,-.3,.05).normalize(),s,r,1.1);this.touched=!0,this.stage.flyTo(o,a)}regionAt(t){let e=null,n=1/0;for(let s of this.regions){let r=s.bbox,o=Math.max(r[0]-t.x,0,t.x-r[3]),a=Math.max(r[1]-t.y,0,t.y-r[4]),l=Math.max(r[2]-t.z,0,t.z-r[5]),c=Math.hypot(o,a,l);c<n&&(n=c,e=s)}return n<1.5?e:null}buildPick(t){let e=this.tip=document.createElement("div");e.className="pick-tip",e.hidden=!0,t.appendChild(e);let n=new Zi,s=null;t.addEventListener("pointerdown",r=>{s=[r.clientX,r.clientY]}),t.addEventListener("pointerup",r=>{if(!s||Math.hypot(r.clientX-s[0],r.clientY-s[1])>4||r.target.closest(".marker, .region-card")||this.mode!=="dev")return;let o=t.getBoundingClientRect(),a=new tt((r.clientX-o.left)/o.width*2-1,-((r.clientY-o.top)/o.height)*2+1);n.setFromCamera(a,this.stage.camera);let l=n.intersectObject(this.target,!1)[0];if(!l){e.hidden=!0;return}let c=l.point,h=l.face,u=this.D,d=new R;hn.getBarycoord(c,new R().fromArray(u.meshV,h.a*3),new R().fromArray(u.meshV,h.b*3),new R().fromArray(u.meshV,h.c*3),d);let f=u.meshDev[h.a]*d.x+u.meshDev[h.b]*d.y+u.meshDev[h.c]*d.z,g=this.hasCls&&u.meshCls[h.a]===1,_=g?"tab witness (where a part-off tab joins the part)":f>this.tol?"proud: failed, material left":f<-this.tol?"gouge: failed, cut too deep":"in tolerance",m=!g&&Math.abs(f)>this.tol?this.regionAt(c):null;e.innerHTML=`<b>${f>0?"+":""}${f.toFixed(3)} mm</b> ${_}<br><span class="mono">X${c.x.toFixed(2)} Y${c.y.toFixed(2)} Z${c.z.toFixed(2)}</span>${m?`<br>part of region R${m.id}`:""}`,e.style.transform=`translate(${Math.min(r.clientX-o.left+12,o.width-270)}px, ${r.clientY-o.top+12}px)`,e.hidden=!1,m&&(this.focus=this.regionPoint(m),this.showCard(m),this.markers.forEach(p=>p.el.classList.toggle("active",p.r.id===m.id)))})}},yo=class{constructor(t,e){this.D=t;let n=t.meta,s=this.tabs=n.partoff&&n.partoff.tabs||[],r=this.stage=new Vn(e,n.stock);r.plate.visible=!1,_o(r,e);let o=this.mach=new di(r.renderer,t.segs,n.stock,[],Le.map(ze));if(t.segs.forEach((d,f)=>{d.grid&&o.write(f,d.finalH,d.finalOwn)}),o.setActive(t.segs.length),o.setMode(2),r.scene.add(o.group),t.meshEdges&&t.meshEdges.length){let d=new ue;d.setAttribute("position",new Kt(t.meshEdges,3)),r.scene.add(new on(d,new fn({color:1925055,transparent:!0,opacity:.55})))}let a=r.key.shadow.camera,l=r.diag*1.1;Object.assign(a,{left:-l,right:l,top:l,bottom:-l,far:r.diag*6}),a.updateProjectionMatrix();let c=this.layer=document.createElement("div");c.className="markers",e.appendChild(c),this.labels=s.map((d,f)=>{let g=document.createElement("div");return g.className="tab-label",g.textContent=`Tab ${f+1} \xB7 ${d.area_mm2} mm\xB2 \xB7 ${d.width_mm} mm wide`,c.appendChild(g),{e:g,p:new R(...d.centroid)}});let h=document.createElement("div");h.className="tab-btns seg",h.innerHTML=s.map((d,f)=>`<button type="button" data-tab="${f}">Tab ${f+1}</button>`).join("")+(s.length>1?'<button type="button" data-tab="-1">All</button>':""),e.appendChild(h),this.btns=[...h.querySelectorAll("[data-tab]")],this.btns.forEach(d=>d.onclick=()=>this.show(+d.dataset.tab)),r.onFrame=()=>(this.place(),!1),e.querySelector(".vp-msg")?.remove(),this.show(0,!1);let u=new IntersectionObserver(d=>{d[0].isIntersecting&&(r.resize(),this.show(this.cur,!1),u.disconnect())});u.observe(e)}show(t,e=!0){let n=this.tabs;if(!n.length)return;this.cur=t;let s=t<0?n:[n[Math.min(t,n.length-1)]],r=new R(1/0,1/0,1/0),o=new R(-1/0,-1/0,-1/0);for(let c of s){let h=new R(...c.centroid);r.min(h),o.max(h)}r.add(new R(-10,-10,-8)),o.add(new R(10,10,8));let{pos:a,target:l}=this.stage.fitBox(new R(-1,-.3,.05).normalize(),r,o,1.05);this.stage.flyTo(a,l,e),this.btns.forEach(c=>c.setAttribute("aria-pressed",String(+c.dataset.tab===t)))}place(){for(let t of this.labels){let e=this.stage.project(t.p);t.e.style.transform=`translate(${e.x.toFixed(1)}px, ${(e.y+18).toFixed(1)}px)`,t.e.hidden=e.behind}}};var lu=`(()=>{var Z=.5*(Math.sqrt(5)-1),S=1e30,d=16;function G(f,e,t,l,x,o){if(f===0)return 0;if(f===1)return e-Math.sqrt(Math.max(e*e-o*o,0));if(f===2){let a=Math.max(o-(e-t),0);return t-Math.sqrt(Math.max(t*t-a*a,0))}return Math.max(o-l,0)*x}function nt(f,e,t,l,x,o,a,r,s,n,i,M,u){let m=M-f,c=u-e,h=l-f,p=x-e,y=o-t,L=h*h+p*p;if(L<1e-18){let j=Math.sqrt(m*m+c*c);return j>r?S:Math.min(t,o)+G(a,r,s,n,i,j)}let U=m*h+c*p,Q=m*m+c*c-r*r,V=U*U-L*Q;if(V<0)return S;let E=Math.sqrt(V),A=Math.max((U-E)/L,0),T=Math.min((U+E)/L,1);if(A>T)return S;if(a===0)return Math.min(t+A*y,t+T*y);let O=Math.min(Math.max(U/L,A),T);if(Math.abs(y)<1e-12){let j=m-O*h,B=c-O*p;return t+G(a,r,s,n,i,Math.sqrt(j*j+B*B))}let H=A,g=T,q=g-Z*(g-H),D=H+Z*(g-H),w=m-q*h,b=c-q*p,v=t+q*y+G(a,r,s,n,i,Math.sqrt(w*w+b*b));w=m-D*h,b=c-D*p;let I=t+D*y+G(a,r,s,n,i,Math.sqrt(w*w+b*b));for(let j=0;j<30&&!(g-H<1e-9);j++)v<I?(g=D,D=q,I=v,q=g-Z*(g-H),w=m-q*h,b=c-q*p,v=t+q*y+G(a,r,s,n,i,Math.sqrt(w*w+b*b))):(H=q,q=D,v=I,D=H+Z*(g-H),w=m-D*h,b=c-D*p,I=t+D*y+G(a,r,s,n,i,Math.sqrt(w*w+b*b)));let N=Math.min(v,I);for(let j of[A,T,O]){w=m-j*h,b=c-j*p;let B=t+j*y+G(a,r,s,n,i,Math.sqrt(w*w+b*b));B<N&&(N=B)}return N}function ot(f){let e=new Float64Array(160).fill(0);for(let t=0;t<32;t++)e[t*5]=-1;for(let t of Object.keys(f)){let l=+t,x=f[t].row;for(let o=0;o<5;o++)e[l*5+o]=x[o]}return e}function rt(f,e){let{x0:t,y0:l,res:x,nx:o,ny:a}=f,r=new Float32Array(o*a),[s,n]=e.lo,[i,M,u]=e.hi;for(let m=0;m<a;m++){let c=l+(m+.5)*x;if(!(c<n||c>M))for(let h=0;h<o;h++){let p=t+(h+.5)*x;p>=s&&p<=i&&(r[m*o+h]=u)}}return r}var _=class{constructor(e,t,l){this.g=e,this.nx=e.nx,this.ny=e.ny,this.H0=rt(e,t),this.H=this.H0.slice(),this.own=new Uint8Array(this.nx*this.ny),this.T=ot(l),this.bnx=Math.ceil(this.nx/d),this.bny=Math.ceil(this.ny/d),this.bmax=new Float32Array(this.bnx*this.bny),this.recomputeBlocks(0,this.bny-1,0,this.bnx-1),this.resetDirty(),this.work=0}resetDirty(){this.di0=1e9,this.di1=-1,this.dj0=1e9,this.dj1=-1}markAllDirty(){this.di0=0,this.di1=this.ny-1,this.dj0=0,this.dj1=this.nx-1}get dirty(){return this.di1>=this.di0}load(e,t){this.H.set(e),this.own.set(t),this.recomputeBlocks(0,this.bny-1,0,this.bnx-1),this.markAllDirty()}reset(){this.load(this.H0,new Uint8Array(this.nx*this.ny))}recomputeBlocks(e,t,l,x){let{nx:o,ny:a,H:r,bmax:s,bnx:n}=this;for(let i=e;i<=t;i++)for(let M=l;M<=x;M++){let u=0,m=Math.min((i+1)*d,a),c=Math.min((M+1)*d,o);for(let h=i*d;h<m;h++){let p=h*o;for(let y=M*d;y<c;y++)r[p+y]>u&&(u=r[p+y])}s[i*n+M]=u}}refreshDirtyBlocks(){this.dirty&&this.recomputeBlocks(Math.floor(this.di0/d),Math.floor(this.di1/d),Math.floor(this.dj0/d),Math.floor(this.dj1/d))}apply(e,t,l,x,o,a,r){let s=this.T,n=r*5;if(r<=0||r>=32||s[n]<0)return 0;let i=s[n],M=s[n+1],u=s[n+2],m=s[n+3],c=s[n+4],{x0:h,y0:p,res:y}=this.g,L=this.nx,U=this.ny,Q=this.H,V=this.own,E=Math.min(l,a),A=Math.max(Math.floor((Math.min(e,x)-M-h)/y),0),T=Math.min(Math.ceil((Math.max(e,x)+M-h)/y),L-1),O=Math.max(Math.floor((Math.min(t,o)-M-p)/y),0),H=Math.min(Math.ceil((Math.max(t,o)+M-p)/y),U-1);if(A>T||O>H)return 0;let g=Math.floor(O/d),q=Math.floor(H/d),D=Math.floor(A/d),w=Math.floor(T/d),b=!1;for(let k=g;k<=q&&!b;k++){let J=k*this.bnx;for(let P=D;P<=w;P++)if(this.bmax[J+P]>E){b=!0;break}}if(!b)return 0;let v=x-e,I=o-t,N=0,j=1e9,B=-1,W=1e9,X=-1,st=y*y;for(let k=O;k<=H;k++){let J=p+(k+.5)*y,P=A,z=T;if(Math.abs(I)>1e-12){let F=Math.max(Math.min((J-M-t)/I,1),0),C=Math.max(Math.min((J+M-t)/I,1),0),Y=e+v*F,K=e+v*C;P=Math.max(A,Math.floor((Math.min(Y,K)-M-h)/y)),z=Math.min(T,Math.ceil((Math.max(Y,K)+M-h)/y))}let $=k*L;for(let F=P;F<=z;F++){let C=Q[$+F];if(C<=E)continue;let Y=h+(F+.5)*y,K=nt(e,t,l,x,o,a,i,M,u,m,c,Y,J);if(K<C){K<0&&(K=C>0?0:C);let R=C-K;R>0&&(N+=R*st,Q[$+F]=K,V[$+F]=r,k<j&&(j=k),k>B&&(B=k),F<W&&(W=F),F>X&&(X=F))}}}return this.work+=(H-O+1)*(T-A+1),B>=0&&(j<this.di0&&(this.di0=j),B>this.di1&&(this.di1=B),W<this.dj0&&(this.dj0=W),X>this.dj1&&(this.dj1=X)),N}};function tt(f,e,t,l,x,o,a,r){let s=x;for(;s<o;s++){r&&r(s);let n=s*3;if(f.apply(e[n],e[n+1],e[n+2],t[n],t[n+1],t[n+2],l[s]&31),(s&31)===31&&a&&performance.now()>a){s++;break}}return s}function ht(f,e,t,l,x,o,a,r){let s=-1/0,n=1/0;for(let i=0;i<3;i++){let M=e[i]+f[i][0]*x+f[i][1]*o,u=f[i][2];if(Math.abs(u)<1e-12){if(M<t[i]||M>l[i])return r}else{let m=(t[i]-M)/u,c=(l[i]-M)/u;s=Math.max(s,Math.min(m,c)),n=Math.min(n,Math.max(m,c))}}return n>=s?n+a:r}function et(f,e){let{x0:t,y0:l,res:x,nx:o,ny:a}=f.grid,r=new Float32Array(o*a);for(let s=0;s<a;s++){let n=l+(s+.5)*x;for(let i=0;i<o;i++)r[s*o+i]=ht(f.R,f.o,e.lo,e.hi,t+(i+.5)*x,n,f.zoff,f.big)}return r}function it(f,e,t){let l=new _(f.grid,{lo:[1e9,1e9,0],hi:[-1e9,-1e9,0]},t);return l.H0=e,l.reset(),l.resetDirty(),l}self.onmessage=f=>{let{segs:e,stock:t,tools:l,S:x,E:o,TL:a,K:r}=f.data,s=performance.now(),n=s;e.forEach((i,M)=>{if(!i.grid)return;let u=it(i,et(i,t),l);tt(u,x,o,a,i.a,i.b,0,c=>{if(c>i.a&&(c-i.a)%r===0){u.refreshDirtyBlocks(),u.resetDirty();let h=u.H.slice(),p=u.own.slice();self.postMessage({type:"key",s:M,k:c,H:h,own:p},[h.buffer,p.buffer])}if(!(c&255)){let h=performance.now();h-n>200&&(n=h,self.postMessage({type:"progress",m:c}))}c&1023||(u.refreshDirtyBlocks(),u.resetDirty())});let m=u.H.slice();self.postMessage({type:"seg",s:M,H:m},[m.buffer])}),self.postMessage({type:"done",ms:performance.now()-s})};})();
`;var F_={float32:Float32Array,float64:Float64Array,uint32:Uint32Array,int32:Int32Array,uint8:Uint8Array,int8:Int8Array,uint16:Uint16Array};async function O_(i){let t=i.meta,e=atob(i.blob),n=new Uint8Array(e.length);for(let x=0;x<e.length;x++)n[x]=e.charCodeAt(x);let s=n.buffer;if(t.gzip){if(typeof DecompressionStream>"u")throw new Error("This browser cannot decompress the viewer data (DecompressionStream missing); use a current Chrome, Edge, Firefox or Safari.");let x=new DecompressionStream("gzip");s=await new Response(new Blob([n]).stream().pipeThrough(x)).arrayBuffer()}let r={};for(let[x,T]of Object.entries(t.arrays))r[x]=new F_[T.type](s,T.off,T.len);let o=t.n_moves,a=r.mv_end,l=new Float32Array(o*3);o&&(l.set(t.start0,0),l.set(a.subarray(0,(o-1)*3),3));for(let x of t.breaks)l.set([x[1],x[2],x[3]],x[0]*3);let c=new Uint16Array(o),h=t.segments.map((x,T)=>{let F=x.R,D=new Xt().makeBasis(new R(F[0][0],F[1][0],F[2][0]),new R(F[0][1],F[1][1],F[2][1]),new R(F[0][2],F[1][2],F[2][2])),U={...x,quat:new Ee().setFromRotationMatrix(D)};if(c.fill(T,x.a,x.b),x.grid){let k=co(U,t.stock),z=r[`seg${T}_D`],j=new Float32Array(k.length);for(let V=0;V<j.length;V++)j[V]=k[V]-z[V];U.finalH=j,U.finalOwn=r[`seg${T}_own`]}return U}),u=new Float32Array(o*3),d=new Float32Array(o*3),f=new Float32Array(o*3),g=new Float32Array(o*3);for(let x of h){let T=x.R,F=x.o,D=x.zoff;for(let U=x.a;U<x.b;U++){let k=U*3;for(let[z,j,V]of[[l,u,f],[a,d,g]]){let Q=z[k],rt=z[k+1],ut=z[k+2];j[k]=Q,j[k+1]=rt,j[k+2]=ut+D,V[k]=F[0]+T[0][0]*Q+T[0][1]*rt+T[0][2]*ut,V[k+1]=F[1]+T[1][0]*Q+T[1][1]*rt+T[1][2]*ut,V[k+2]=F[2]+T[2][0]*Q+T[2][1]*rt+T[2][2]*ut}}}let _=r.mv_tool,m=r.mv_feed,p=new Float64Array(o+1),w=new Float32Array(o),b=t.index_time_s||6;for(let x=0;x<o;x++){let T=x*3,F=Math.hypot(a[T]-l[T],a[T+1]-l[T+1],a[T+2]-l[T+2]),U=_[x]>>5&1?t.rapid_rate:Math.max(m[x],1),k=F/U*60;x>0&&c[x]!==c[x-1]&&(w[x]=b/(b+k),k+=b),p[x+1]=p[x]+k}let v=new TextDecoder().decode(r.gcode),L=r.mv_line,P=Math.max(t.n_lines+2,o?L[o-1]+2:2),A=new Int32Array(P).fill(-1);for(let x=0;x<o;x++)A[L[x]]<0&&(A[L[x]]=x);let M=o;for(let x=P-1;x>=0;x--)A[x]<0?A[x]=M:M=A[x];for(let x of h){x.firstCut=x.a;for(let T=x.a;T<x.b;T++)if(!(r.mv_tool[T]>>5&1)){x.firstCut=T;break}}let y=[];for(let x=0;x<o;x++){let T=_[x]&31;T&&!y.includes(T)&&y.push(T)}for(let x of h){x.fixHits=0;for(let T=x.a;T<x.b;T++)r.mv_fix[T]&&x.fixHits++}return{meta:t,segs:h,segOf:c,S:l,E:a,SZ:u,EZ:d,FS:f,FE:g,TL:_,cum:p,phi:w,gcode:v,firstMove:A,toolsUsed:y,line:L,feed:m,crash:r.mv_crash,fix:r.mv_fix,meshV:r.mesh_V,meshF:r.mesh_F,meshDev:r.mesh_dev,meshCls:r.mesh_cls,meshRa:r.mesh_ra||null,meshEdges:r.mesh_edges}}function ec(i){let t=document.getElementById("toast");t&&(t.textContent=i,t.classList.add("show"),clearTimeout(ec._t),ec._t=setTimeout(()=>t.classList.remove("show"),2200))}var nc=/[?&]static=1\b/.test(location.search)||location.hash==="#static";window.CNCLLM_STATIC=nc;async function cu(){let i=window.CNCViewer={ready:!1},t=window.CNCLLM_DATA,e=document.getElementById("simview");if(!t||!e)return;let n=u=>{console.error(u);for(let d of document.querySelectorAll(".vp-msg"))d.textContent="3D viewer unavailable: "+(u.message||u),d.classList.add("err");i.error=String(u.message||u)},s;try{let u=performance.now();s=await O_(t),i.decodeMs=performance.now()-u}catch(u){n(u);return}let r={};s.toolsUsed.forEach((u,d)=>{r[u]=Wl[d%Wl.length]});let o=u=>r[u]||"#888888";document.querySelectorAll(".swatch[data-tool]").forEach(u=>{u.style.background=o(+u.dataset.tool)});try{i.sim=new go(s,{view:e,controls:document.getElementById("simcontrols"),side:document.getElementById("simside")},o,lu)}catch(u){n(u);return}i.data=s;try{let u=performance.now();window.__machineCheck=i.sim.machineCheck(),window.__machineCheck.ms=Math.round(performance.now()-u),window.__machineCheck.pass||console.warn("Machine view self-check failed",window.__machineCheck)}catch(u){console.error("Machine view self-check could not run",u),window.__machineCheck={error:String(u)}}window.__viewer={seekSwing:(u,d)=>i.sim.seekSwing(u,d),setMode:u=>i.sim.setMode(u,!1),gotoSeg:u=>i.sim.gotoSeg(u),seekU:u=>(i.sim.playing=!1,i.sim.syncPlay(),i.sim.setCursor(i.sim.uToCursor(u)),i.sim.cursor),state:()=>({mode:i.sim.mode,cursor:i.sim.cursor,caught:!!i.sim.caught,u:i.sim.cursorToU(i.sim.cursor),segments:i.sim.N,playing:i.sim.playing,pose:i.sim.mp?{phase:i.sim.mp.phase,A:i.sim.mp.dispA,C:i.sim.mp.dispC,tip:i.sim.mp.tip}:null})};let a=document.getElementById("resview"),l=null,c=()=>{if(i.result||!a)return i.result;try{i.result=new xo(s,{view:a,bar:document.getElementById("resbar")}),l&&i.result.focusRegion(l,!1)}catch(u){n(u)}return i.result};i.makeResult=c;let h=document.getElementById("tabview");if(h){let u=()=>{if(i.tabs)return i.tabs;try{i.tabs=new yo(s,h)}catch(d){n(d)}return i.tabs};if(i.makeTabs=u,nc)u();else{let d=new IntersectionObserver(f=>{f[0].isIntersecting&&(u(),d.disconnect())},{rootMargin:"400px"});d.observe(h)}}if(a)if(nc)c();else{let u=new IntersectionObserver(f=>{f[0].isIntersecting&&(c(),u.disconnect())},{rootMargin:"600px"});u.observe(a),(window.requestIdleCallback||(f=>setTimeout(f,1500)))(()=>c(),{timeout:3e3})}document.addEventListener("click",u=>{let d=u.target.closest("[data-gline]");if(d){u.preventDefault();let _=+d.dataset.gline;i.sim.gotoLine(_,!0),ec(`Line ${_}: animation positioned after its first move`);return}let f=u.target.closest("[data-goseg]");if(f){u.preventDefault(),i.sim.gotoSeg(+f.dataset.goseg),e.scrollIntoView({behavior:"smooth",block:"center"});return}let g=u.target.closest("[data-region]");if(g){u.preventDefault();let _=+g.dataset.region;a&&a.scrollIntoView({behavior:"smooth",block:"center"});let m=c();m?m.focusRegion(_,!1):l=_}}),i.ready=!0,document.documentElement.classList.add("viewer-ready")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",cu):cu();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
