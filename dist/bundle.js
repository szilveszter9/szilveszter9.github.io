(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
//lib/index
//
/*
  TODO check for each feature, those are used here, recommend using shims if not found
  TODO make this lib safe

  var ifThen = curry(function _ifThen(compFunc,ifTrue,ifNotTrue,val){if(compFunc(val)){ return ifTrue; }else {return ifNotTrue;}});
*/
window.sf = module.exports = {
    args: require('./lib/base/_arguments'),
    compose: require('./lib/base/_compose'),
    curry: require('./lib/base/_curry'),
    devnull: require('./lib/base/_devnull'),
    identity: require('./lib/base/_identity'),
    map: require('./lib/base/_map'),
    walk: require('./lib/base/_walk'),

    Either: require('./lib/controlflow/_either'),
    Left: require('./lib/controlflow/_left'),
    Maybe: require('./lib/controlflow/_maybe'),
    Right: require('./lib/controlflow/_right'),
    tryCatch: require('./lib/controlflow/_tryCatch'),

    array: require('./lib/_array'),
    channel: require('./lib/_channel'),
    compare: require('./lib/_compare'),
    dom: require('./lib/_dom'),
    domEvent: require('./lib/_domEvent'),
    event: require('./lib/_event'),
    http: require('./lib/_http'),
    json: require('./lib/_json'),
    log: require('./lib/_log'),
    math: require('./lib/_math'),
    object: require('./lib/_object'),
    string: require('./lib/_string'),
    template: require('./lib/_template')
}

},{"./lib/_array":2,"./lib/_channel":3,"./lib/_compare":4,"./lib/_dom":5,"./lib/_domEvent":6,"./lib/_event":7,"./lib/_http":8,"./lib/_json":9,"./lib/_log":10,"./lib/_math":11,"./lib/_object":12,"./lib/_string":14,"./lib/_template":15,"./lib/base/_arguments":16,"./lib/base/_compose":17,"./lib/base/_curry":18,"./lib/base/_devnull":19,"./lib/base/_identity":20,"./lib/base/_map":21,"./lib/base/_walk":22,"./lib/controlflow/_either":23,"./lib/controlflow/_left":24,"./lib/controlflow/_maybe":25,"./lib/controlflow/_right":26,"./lib/controlflow/_tryCatch":27}],2:[function(require,module,exports){
'use strict';
// _array
//
var math = require('./_math');
var curry = require('./base/_curry');
var compare = require('./_compare');
var compose = require('./base/_compose');

var isEvenKey = function _isEvenKey(val,key){return compare.isEven(key);};
var isOddKey = function _isOddKey(val,key){return compare.isOdd(key);};
var each = curry(function _each(f,arrLike){Array.prototype.forEach.call(arrLike,f); return arrLike;});
//each = curry(function _each(f,arr){for(var i=0;i<arr.length;i++){f(arr[i],i,arr)};});
var some = curry(function _some(f,arrLike){return Array.prototype.some.call(arrLike,f);});
var any = some;
var contains = curry(function _contains(given,arrLike){return some(function(elem){return elem===given},arrLike);});
var inRange = curry(function _inRange(range,val){return any(compare.isEqual(val), range);});
var notAny = curry(function(f,arrLike){return !(any(f,arrLike));});
var notInRange = curry(function(f,arrLike){return !inRange(f,arrLike)});
var filter = curry(function _filter(f,arrLike){return Array.prototype.filter.call(arrLike,f);});
var foldl = curry(function _foldl(f,start,arrLike){return Array.prototype.reduce.call(arrLike,f,start); });
var nth = curry(function _nth(n,arrLike){return arrLike[n];})
var reverse = curry(function _reverse(arr){return Array.prototype.reverse.call(arr);});
var reduce = foldl;
var slice = curry(function _slice(from,till,arr){return Array.prototype.slice.call(arr,from,till);});
var head = nth(0);
var headN = function _headN(n){return slice(0,n);};
var toString = foldl(math.addLeft)('');

var array = {
    isEvenKey: isEvenKey,
    isOddKey: isOddKey,
    each: each,
    some: some,
    any: any,
    contains: contains,
    inRange: inRange,
    notAny: notAny,
    notInRange: notInRange,
    filter: filter,
    foldl: foldl,
    nth: nth,
    reverse: reverse,
    reduce: reduce,
    slice: slice,
    head: head,
    headN: headN,
    toString: toString
};

module.exports = array;

},{"./_compare":4,"./_math":11,"./base/_compose":17,"./base/_curry":18}],3:[function(require,module,exports){
'use strict';
var curry = require('./base/_curry');

var create = function _createChannel(sizeOrBuffer, filter) {
    return {
        buffer: [],
        filter: filter,
        consumers: []
    };
}

function put(c, v) {
    if(c.filter(v)) {
        c.buffer.push(v);
    }
    return run(c);
};

function take(c, cb) {
    c.consumers.push(cb);
    return run(c);
};

function run(c) {
    if (c.buffer.length && c.consumers.length) {
        c.consumers.shift()(c.buffer.shift());
    }
    return c;
};

var addListener = curry(function _channelListener(elem, type, channel){
    elem.addEventListener(type, function _addedChannelListerenFn(event){put(channel, event)});
});

var channel = {
    create: create,
    put: put,
    take: take,
    run: run,
    addListener: addListener
};

module.exports = channel;

},{"./base/_curry":18}],4:[function(require,module,exports){
'use strict';
// _compare
//
var curry = require('./base/_curry');
var math = require('./_math');

var isEqual = curry(function _isEqual(x, y){return x===y;});
var isNot = math.not;
var isEven = curry(function _isEven(i){return i%2===0;});
var isOdd = curry(function _isOdd(i){return i%2===1;});

var compare = {
    isEqual: isEqual,
    isNot: isNot,
    isEven: isEven,
    isOdd: isOdd
};

module.exports = compare;

},{"./_math":11,"./base/_curry":18}],5:[function(require,module,exports){
'use strict';
// _dom
//
var obj = require('./_object');
var tryCatch = require('./controlflow/_tryCatch');
var Either = require('./controlflow/_either');
var Right = require('./controlflow/_right');
var Left = require('./controlflow/_left');
var curry = require('./base/_curry');
var compose = require('./base/_compose');

var _getDomElement = curry(function _getDomElement(x){return document.querySelector(x);});
var getDomElement = tryCatch.silent(_getDomElement);
var eitherDomElement = compose(Either('could not find dom element'), getDomElement);
var setAttributeElValue = curry(function _setAttribute(attr, el, x){el[attr] = x;return x;});
var setAttributeValueEl = curry(function _setAttribute(attr, x, el){el[attr] = x;return el;});
var setElAttribute = curry(function(attr, firstParam, secondParam){
    if(firstParam.DOCUMENT_NODE != undefined) {
        return setAttributeElValue(attr, firstParam, secondParam);
    }
    else {
        return setAttributeValueEl(attr, firstParam, secondParam);
    }
});
var setDomElAttribute = curry(function(attr, querySelector, value){
    var el = getDomElement(querySelector);
    if(!el) return Left('could not find element: ' + querySelector);
    setElAttribute(attr, el, value);
    return Right(el);
});
//var setElHtml = compose(map(setElAttribute('innerHTML')), Either('could not find element'), getDomElement);
//var setElHtml = compose(setElAttribute('innerHTML'), Either('errrrr'), getDomElement);
//var setElHtml = compose(setElAttribute('innerHTML'), eitherDomElement);
var setElHtml = setElAttribute('innerHTML');
var setDomElHtml = setDomElAttribute('innerHTML');
//var setStyle = compose(obj.setDeepAttribute(['style']), getDomElement);
var setBgColor = compose(obj.setDeepAttribute(['style', 'backgroundColor']), getDomElement);

var dom = {
    getDomElement: getDomElement,
    eitherDomElement: eitherDomElement,
    setAttributeElValue: setAttributeElValue,
    setAttributeValueEl: setAttributeValueEl,
    setElAttribute: setElAttribute,
    setDomElAttribute: setDomElAttribute,
    setElHtml: setElHtml,
    setDomElHtml: setDomElHtml,
    setBgColor: setBgColor
};

module.exports = dom;

},{"./_object":12,"./base/_compose":17,"./base/_curry":18,"./controlflow/_either":23,"./controlflow/_left":24,"./controlflow/_right":26,"./controlflow/_tryCatch":27}],6:[function(require,module,exports){
'use strict';
// _domEvents
//
var obj = require('./_object');
var evnt = require('./_event');
var curry = require('./base/_curry');

var setBgByEvent = curry(function _setBgByEvent(el, eventType, event){
    var color = 'rgb(' + (event.pageX + 30) + ',' + (event.pageY + 30) + ',' + '50)';

    obj.setDeepAttribute(
        ['style', 'backgroundColor'],
        el,
        color
    );

    return color;
});

var moveByEvent = function _moveByEvent(el, eventType, event){
    var pos = {};
    var zoom = el.style.zoom || 1;
    if(el.style.left === '' || el.style.left === ''){
        var b = el.getBoundingClientRect();
        var bLeft = b.left;
        var bTop = b.top;
    }
    var leftPrev = parseFloat((el.style.left || ''+bLeft || '0').replace('px',''));
    var topPrev = parseFloat((el.style.top || ''+bTop || '0').replace('px',''));

    if(evnt.isLeftMouseButtonDown(event)){
        var pos = {
            position: 'absolute',
            left: leftPrev + event.movementX / zoom + 'px',
            top: topPrev + event.movementY / zoom + 'px'
        };
        return _moveEl(el, pos);
    };

    return pos;
};

var _moveEl = function __moveEl(el, pos){
    obj.setDeepAttribute(['style', 'position'], el, pos.position);
    obj.setDeepAttribute(['style', 'left'], el, pos.left);
    obj.setDeepAttribute(['style', 'top'], el, pos.top);
    return pos;
}

var rotateByEvent = curry(function _rotateByEvent(el, eventType, event){
    var rotate = 'rotate(0rad)';

    if(evnt.isRightMouseButtonDown(event)){
        var zoom = el.style.zoom || 1;
        var t = event.currentTarget;
        var radianPrev = parseFloat(el.style.transform.replace('rotate(', '').replace('rad)', '')) || 0;
        var deltaX = event.pageX / zoom - (t.clientLeft + t.offsetLeft + t.clientWidth/2);
        var deltaY = event.pageY / zoom - (t.clientTop + t.offsetTop + t.clientHeight/2);
        var minX = deltaY > 0 ? -1 : 1;
        var minY = deltaX < 0 ? -1 : 1;
        var delta = minX * event.movementX / zoom + minY * event.movementY / zoom;
        var length = Math.sqrt(deltaY*deltaY + deltaX*deltaX);
        var radian = Math.atan(delta/length*0.80);
        var rotate = 'rotate(' + (radianPrev + radian) + 'rad)';
        obj.setDeepAttribute(
            ['style', 'transform'],
            el,
            rotate
        );
    }

    return rotate;
});

var zoomByEvent = curry(function _zoomByEvent(el, eventType, event){
    var zoomPrev = el.style.zoom || 1;

    if(evnt.isMiddleMouseButtonDown(event)){
        var t = event.currentTarget;
        var zoom = zoomPrev * (1 + event.movementX/80) * (1 + event.movementY/80);
        var leftPrev = parseFloat(el.style.left.replace('px',''));
        var topPrev = parseFloat(el.style.top.replace('px',''));
        //console.log('leftPrev:', leftPrev);
        //console.log('t.clientWidth:', t.clientWidth);
        var pos = {
            position: 'absolute',
            left: leftPrev / zoom * zoomPrev + 'px',
            top: topPrev / zoom * zoomPrev + 'px'
        };
        //console.log('pos.left:',pos.left);
        _moveEl(el, pos);
        _zoomEl(el, zoom);
    }

    return zoom || zoomPrev;
});

var _zoomEl = function(el, zoom) {
    obj.setDeepAttribute(
        ['style', 'zoom'],
        el,
        zoom
    );
}

var domEvents = {
    setBgByEvent: setBgByEvent,
    moveByEvent: moveByEvent,
    rotateByEvent: rotateByEvent,
    zoomByEvent: zoomByEvent
};

module.exports = domEvents;

},{"./_event":7,"./_object":12,"./base/_curry":18}],7:[function(require,module,exports){
'use strict';
// _event
//
var obj = require('./_object');
var compare = require('./_compare');
var array = require('./_array');
var curry = require('./base/_curry');
var compose = require('./base/_compose');

function preventDefault(el, eType, e){ return e.preventDefault()};

var addListener = curry(function _eventListener(fn, eventType, el){
    el.addEventListener(
        eventType,
        function _addedEventListenerFn(){fn(el,eventType, arguments[0]);}
    );
    return el;
});

//left = 1         3 5 7
//right = 2        3 6 7
//middle = 4       5 6 7
//altKey
//ctrlKey
//shiftKey

var getEventButtons = obj.getValue('buttons');
var isLeftMouseButtonDown = compose(compare.isOdd, getEventButtons);
var isRightMouseButtonDown = compose(array.inRange([2,3,6,7]), getEventButtons);
var isMiddleMouseButtonDown = compose(array.inRange([4,5,6,7]), getEventButtons);

var event = {
    preventDefault: preventDefault,
    addListener: addListener,
    getEventButtons: getEventButtons,
    isLeftMouseButtonDown: isLeftMouseButtonDown,
    isRightMouseButtonDown: isRightMouseButtonDown,
    isMiddleMouseButtonDown: isMiddleMouseButtonDown
};

module.exports = event;

},{"./_array":2,"./_compare":4,"./_object":12,"./base/_compose":17,"./base/_curry":18}],8:[function(require,module,exports){
'use strict';
// _http
//
var curry = require('./base/_curry');
var compose = require('./base/_compose');
var json = require('./_json');
var obj = require('./_object');

var request = curry(function _httpRequest(method, firstParam, secondParam, thirdParam){
    var params = [];
    params[typeof firstParam] = firstParam;
    params[typeof secondParam] = secondParam;
    params[typeof thirdParam] = thirdParam;
    return _request(
      method,
      params.function,
      params.string,
      params.object
        || {}
    );
});

var _request = curry(function _httpRequest(method, listenerFunc, url/*, data*/){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener('load', listenerFunc);
    oReq.open(method, url, true);
    oReq.send();
    return oReq;
});

var get = request('get');
get.___handleAsIO = true;
var post = request('post');
post.___handleAsIO = true;
var getResponseText = compose(obj.getValue('responseText'), obj.getThis);
var getResponseJSON = compose(json.toJSON, getResponseText);

var http = {
    request: request,
    get: get,
    post: post,
    getResponseText: getResponseText,
    getResponseJSON: getResponseJSON
};

module.exports = http;

},{"./_json":9,"./_object":12,"./base/_compose":17,"./base/_curry":18}],9:[function(require,module,exports){
'use strict';
// _json
//
var tryCatch = require('./controlflow/_tryCatch');

var toJSON = function _toJSON(text){return tryCatch.loud(JSON.parse)(text);};
var toString = function _toString(json){return tryCatch.loud(JSON.stringify)(json);};
var clone = function _clone(json){return toJSON(toString(json))};

var json = {
    toJSON: toJSON,
    toString: toString,
    clone: clone
};

module.exports = json;

},{"./controlflow/_tryCatch":27}],10:[function(require,module,exports){
'use strict';
// _log
//
var curry = require('./base/_curry');

var log = function(global){
  var obj = curry(function _log(s){global.console.log(s);return arguments;});
  var args = curry(function _log(s){if(this!==undefined && this!=global.window){global.console.log('this:',this);};global.console.log('arguments:',arguments);return arguments;});
  var log = args;
  var value = curry(function _log(s){global.console.log(s && s.toString());return arguments;});
  var part = curry(function _log(partFunc,s){global.console.log(partFunc(s).toString());return s;});

  return log = {
      obj: obj,
      args: args,
      log: log,
      value: value,
      part: part
  };
};

module.exports = log;

},{"./base/_curry":18}],11:[function(require,module,exports){
'use strict';
// _math
//
var curry = require('./base/_curry');

var not = curry(function _not(x){return !x});
var add = curry(function _add(inc,x){ return x+inc;});
var addLeft = curry(function _add(inc,x){ return inc+x;});

var math = {
    not: not,
    add: add,
    addLeft: addLeft
};

module.exports = math;

},{"./base/_curry":18}],12:[function(require,module,exports){
'use strict';
// _object
//
var curry = require('./base/_curry');
var json = require('./_json');

var getValue = curry(function _getValue(key,obj){return obj[key];});
var getThis = curry(function _getThis(){return this;});
var hasKey = curry(function _objHasKey(key, obj){return obj.hasOwnProperty(key);});
var keys = curry(function _keys(obj){return Object.keys(obj);});
var keyIsValue = curry(function _objKeyIsValue(val,key,obj){if(obj[key] && obj[key]===val) return obj;});
var keyIsNotValue = curry(function _objKeyIsNotValue(val,key,obj){if(!obj[key] || obj[key]!==val) return obj;});
var eachKeys = curry(function _eachKeys(f, obj){
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            f.call(this, obj[key], key, obj);
        }
    };
    return obj;
});
var setAttribute = curry(function _setAttribute(attr, el, x){
    var y = json.clone(x);
    y[attr] = el;
    return y;
});
/*
TODO split by dot and square brackets
  plus set array instead of {} where needed
  eg: 'obj.arr[0].obj'
*/
// important! setDeepAttribute mutates the original object
var setDeepAttribute = curry(function _setDeepAttribute(attrArr, el, x){
    var sub = el;
    for(var i = 0; i < attrArr.length - 1; i++){
        var attr = attrArr[i];
        if(!sub[attr]) {
            sub[attr] = {};
        }
        sub = sub[attr];
    }
    sub[attrArr[attrArr.length - 1]] = x;
    return el;
});

var obj = {
    getValue: getValue,
    getThis: getThis,
    hasKey: hasKey,
    keys: keys,
    keyIsValue: keyIsValue,
    keyIsNotValue: keyIsNotValue,
    eachKeys: eachKeys,
    setAttribute: setAttribute,
    setDeepAttribute: setDeepAttribute
};

module.exports = obj;

},{"./_json":9,"./base/_curry":18}],13:[function(require,module,exports){
'use strict';
// _sp
//
function sp(num){var ret=' ';for(var i=0;i<num;i++)ret+=' '; return ret;}
module.exports = sp;

},{}],14:[function(require,module,exports){
'use strict';
// _string
//
var math = require('./_math');
var array = require('./_array');
var curry = require('./base/_curry');
var json = require ('./_json');

var cat = curry(function _cat(a,b){return '' + a + b;});
var tac = curry(function _cat(a,b){return '' + b + a;});
var split = curry(function _split(splitter,str){return String.prototype.split.call(str,splitter);});
var trim = curry(function _trim(s){return String.prototype.trim.call(s);});
var upper = curry(function _upper(s){return String.prototype.toUpperCase.call(s);});
var toArray = function _str2arr(str){return array.slice(0)(str.length, str)};

var string = {
    cat: cat,
    tac: tac,
    split: split,
    trim: trim,
    upper: upper,
    toArray: toArray,
    toJSON: json.toJSON
};

module.exports = string;

},{"./_array":2,"./_json":9,"./_math":11,"./base/_curry":18}],15:[function(require,module,exports){
'use strict';
// _template
//
var array = require('./_array');
var curry = require('./base/_curry');

var set = curry(function(template, inputObj){
    var snippets = template.match(/{{\w+}}/g);
    array.each(function(snippet/*, key, object*/){
            var key = snippet.replace(/^{{/,'').replace(/}}$/,'');
            template = template.replace(snippet, inputObj[key]);
        }, snippets);
    return template;
});

var template = {
    set: set
};

module.exports = template;

},{"./_array":2,"./base/_curry":18}],16:[function(require,module,exports){
'use strict';
// _arguments
//
var curry = require('./_curry');

var transparent = curry(function _transparent(f){
    return function __transparent(){
        f.apply(this, arguments);
        return arguments;
    }
});
var prepend = curry(function(x){
    var args = Array.isArray(x)
      ? x
      : [x];
    args.___handleAsArguments = true;
    return function(){
        for(var i=0; i<arguments.length; i++) {
            args.push(arguments[i]);
        }
        return args;
    }
});
var append = curry(function(x){
    var args = Array.isArray(x)
      ? x
      : [x];
    args.___handleAsArguments = true;
    return function(){
        for(var i=0, len=arguments.length; i<len; i++) {
            args.unshift(arguments[len - 1 - i]);
        }
        return args;
    }
});
var opaque = curry(function _opaque(nr,f){
    var argsUse = [];
    argsUse.___handleAsArguments = true;
    var argsForward = [];
    argsForward.___handleAsArguments = true;
    return function __opaque(){
        for(var i=0; i<nr; i++) {
            argsUse.push(arguments[i]);
        }
        for(var i=nr, len=arguments.length; i<len; i++) {
            argsForward.push(arguments[i]);
        }
        var fReturn = f.apply(this, argsUse);

        if(Array.isArray(fReturn) && fReturn.___handleAsArguments
           || typeof fReturn == 'object'
           && fReturn !== null
           && fReturn.toString() == "[object Arguments]") {
            for(var i=0, len=fReturn.length; i<len; i++) {
                argsForward.push(fReturn[i]);
            }
        }
        else {
            argsForward.push(fReturn);
        }

        return argsForward;
    }
});

var args = {
    transparent: transparent,
    prepend: prepend,
    append: append,
    opaque: opaque
};

module.exports = args;

},{"./_curry":18}],17:[function(require,module,exports){
'use strict';
// _compose
//
var identity = require ('./_identity');

function compose2func(g,f){
    //var composedFuncs = curry(function _compose2func(){return g(f.apply(this,arguments));});
    function _compose2func(){
        var fReturn = f.apply(this,arguments);
        if(Array.isArray(fReturn) && fReturn.___handleAsArguments) {
            return g.apply(this, fReturn);
        }
        if(typeof fReturn == 'object' && fReturn !== null && fReturn.toString() == "[object Arguments]") {
            var pass = Array.prototype.slice.apply(fReturn);
            return g.apply(this, pass);
        }
        else {
            return g(fReturn);
        }
    }
    _compose2func._f = f;
    _compose2func._g = g;
    return _compose2func;
}
function compose(g,f){
    if(arguments.length==0) {
        console.info('composing nothing');
        return identity;
    }
    if(arguments.length==1) {
        console.info('composing only 1 function');
        return g;
    }
    if(arguments.length>2){
        var argarr = [].slice.call(arguments);
        var last = argarr.pop();
        //console.log('...');
        return compose(argarr, last);
    } else if(Array.isArray(g)){
        var lastG = g.pop()
        //console.log('lastG,f,g:',g);
        var composed = compose2func(lastG, f);
        if(g.length)
            return compose(g, composed);
        else
            return composed;
    } else{
        //console.log('g,f:',g,f);
        return compose2func(g,f);
    }
}

module.exports = compose;

},{"./_identity":20}],18:[function(require,module,exports){
'use strict';
// _curry
//
var sp = require('../_sp')
/* Essence:

function curry(f){
    return function(){
        if (arguments.length>=f.length || arguments.length === 0)
            return f.apply(this,arguments);
        //else
            g = binder(f,arguments);
            return g;

            function binder(fn,args){
                g=fn;
                for(i=0; i<args.length; i++){
                    curried = f;
                    g=g.bind(self,args[i]);
                    g = curry(g,args);
                }
                return g;
            }
    };
}
*/
function curry(f){
    function _curriedFunc(){
        var self = this;
        var g;
        if (arguments.length>=f.length || arguments.length === 0){
            return f.apply(this,arguments);
        }
        //else...
            function binder(fn,args){
                var g=fn;
                for(var i=0; i<args.length; i++){
                    var curried = f;
                    g=g.bind(self,args[i]);
                    g.toString = function(){return /*'#1 CFWB: ' + */f.toString();};
                    g._orig = f;
                    g._length = g.length;
                    g._curried = curried;
                }
                g._boundArgs = [].slice.call(args);
                g = curry(g);
                return g;
            }
            g = binder(f,arguments);
            g._boundArgs = [].slice.call(arguments);//.concat('#2');
            g._sense = 'CFWB:' + sp(12) + f.name;
            g._wb = true;
            g._orig = f;
            g.toString = function toString(){return /*'#2 => ' + */f.name + '  See ._boundArgs for bindings';};
            return g;
    };
    f._length = f.length;
    _curriedFunc._curried = f;
    _curriedFunc._sense = 'CF:' + sp(14) + f.name;
    _curriedFunc._wb = false;
    _curriedFunc.toString = function toString(){
        //Curried function = Functor(a function that returns a function)
        return /*'#3 CF: ' + */(f.name || 'Give it a name') + ': ' + f.toString() + '.';
    };
    return _curriedFunc;
}

module.exports = curry;

},{"../_sp":13}],19:[function(require,module,exports){
'use strict';
// _devnull
//
module.exports = function _devnull(){};

},{}],20:[function(require,module,exports){
'use strict';
// _identity
//
module.exports = function _identity(x){return x;};

},{}],21:[function(require,module,exports){
'use strict';
// _map
//
var curry = require('./_curry');
var map = curry(function _map(f, obj){return obj.map(f)});

module.exports = map;

},{"./_curry":18}],22:[function(require,module,exports){
'use strict';
// _walk
//
var sp = require('../_sp')
function gr(obj, cb){
    var gr = Object.create(null);
    gr['...']=obj;
    var typ = (typeof obj == 'function') ? 'group' : 'info';
    if(obj._wb === false) typ = 'log';
        var isCompose = obj.name==='_compose2func';
    if(isCompose) console.group('(' + sp(8));
    else
        console[typ](
            obj && obj._sense || typeof obj + ':' + sp(8)
            , obj && obj._orig || ''
            , typ==='group'?gr:(typeof obj=='string'?'"'+obj+'"':obj)
        );
    cb && cb();
    if(typ==='group') console.groupEnd();
        if(isCompose) console.log(')');
}
function walk(f,sub){
    if(!sub) console.group('-=== walk ===-' + sp(56) + '(C:curried, F:function, W:with, B:binding)');
        if(!sub) gr(f,_inner);
    else _inner();
    if(!sub) console.groupEnd('-============-');

        function _inner(){
            if(f._boundArgs)
                f._boundArgs.forEach(function each(b){
                    gr(b, function(){walk(b,true)});
                });
            if(f._g) gr(f._g,function(){walk(f._g,true)});
                if(f._f) gr(f._f,function(){walk(f._f,true)});
                    if(f._orig) gr(f._orig,function(){walk(f._orig,true)});
        }
};

module.exports = walk;

},{"../_sp":13}],23:[function(require,module,exports){
'use strict';
// _either
//
var curry = require('../base/_curry');
var Right = require('./_right');
var Left = require('./_left');

var _Either = function __Either(msg, x) {
    this.val = x;
    this.msg = msg;
    return undefined;
};

_Either.prototype.map = function _map_Either(f) {
  if (this.val) {
    return Right(f(this.val));
  } else {
    console.info(this.msg);
    return Left(this.msg);
  }
};

var Either = curry(function _newEither(msg, x) {
    return new _Either(msg, x);
});

module.exports = Either;

},{"../base/_curry":18,"./_left":24,"./_right":26}],24:[function(require,module,exports){
'use strict';
// _left
//
var _Left = function __Left(x) {
  this.val = x;
  return undefined;
};

_Left.prototype.map = function _map_Left(f) {
  if (this.val) {
    console.info(this.val);
    return Left(logObj(this.val));
  } else {
    return Left('crazy error');
  }
};

var Left = function _newLeft(x) {
  return new _Left(x);
};

module.exports = Left;

},{}],25:[function(require,module,exports){
'use strict';
// _maybe
//
var _Maybe = function __Maybe(x) {
  this.val = x;
  return undefined;
};

_Maybe.prototype.map = function _map_Maybe(f) {
  if (this.val) {
    return Maybe(f(this.val));
  } else {
    return Maybe(null);
  }
};

var Maybe = function _newMaybe(x) {
  return new _Maybe(x);
};

module.exports = Maybe;

},{}],26:[function(require,module,exports){
'use strict';
// _right
//
var _Right = function __Right(x) {
  this.val = x;
  return undefined;
};

_Right.prototype.map = function _map_Right(f) {
  if (this.val) {
    return Right(f(this.val));
  } else {
    return Left('crazy error');
  }
};

var Right = function _newRight(x) {
  return new _Right(x);
};

module.exports = Right;

},{}],27:[function(require,module,exports){
'use strict';
// _tryCatch
//
var devnull = require('../base/_devnull')
var log = require('../_log');
var curry = require('../base/_curry');

var tryCatch = curry(function _tryCatch(errFunc, f){
    return function __tryCatch(){
        try{var res = f.apply(this, arguments);}catch(e){errFunc(e);}
        return res;
    };
});

var loud = tryCatch(log.obj);
var silent = tryCatch(devnull);

var tryCatch = {
    try: tryCatch,
    loud: loud,
    silent: silent
}

module.exports = tryCatch;

},{"../_log":10,"../base/_curry":18,"../base/_devnull":19}]},{},[1])
//# sourceMappingURL=smallfoot.js.map
