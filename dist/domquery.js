;(function(process){  require.m = { 0:[function(require,module,exports){ window.query = window.domQuery = window.DOMQuery = require('./index');
 },{"./index":1}],1:[function(require,module,exports){ var select = require("./lib/select"),
    create = require('./lib/create');

module.exports = select;
module.exports.create = create;
 },{"./lib/select":2,"./lib/create":18}],2:[function(require,module,exports){ var newChain  = require("new-chain"),
    attr      = require('./attr'),
    children  = require('./children'),
    classList = require('./classlist'),
    effects   = require('./effects'),
    events    = require('./events'),
    html      = require('./html'),
    style     = require('./style'),
    text      = require('./text'),
    val       = require('./val');

module.exports = select;

function each(fn, elements){
  return function(){
    var i, len, ret, params, ret;

    len    = elements.length;
    i      = -1;
    params = [undefined].concat(Array.prototype.slice.call(arguments));

    while ( ++i < len ) {
      params[0] = elements[i];
      ret = fn.apply(undefined, params);
    }

    return ret;
  };
}

function select(query){
  var key, chain, methods, elements;

  if ( typeof query == 'string' ) {
    elements = Array.prototype.slice.call(document.querySelectorAll(query));
  } else if ( query == document ) {
    elements = [document.documentElement];
  } else {
    elements = Array.prototype.slice.call(arguments);
  }

  methods = {
    addClass    : each(classList.addClass, elements),
    removeClass : each(classList.removeClass, elements),
    toggleClass : each(classList.toggleClass, elements),
    show        : each(effects.show, elements),
    hide        : each(effects.hide, elements),
    style       : each(style, elements)
  };

  for ( key in events ) {
    methods[ key ] = each(events[key], elements);
  }

  for ( key in children ) {
    methods[ key ] = each(children[key], elements);
  }

  chain = newChain.from(elements)(methods);

  chain.attr     = each(attr(chain), elements);
  chain.hasClass = each(classList.hasClass, elements),
  chain.html     = each(html(chain), elements);
  chain.text     = each(text(chain), elements);
  chain.val      = each(val(chain), elements);

  return chain;
}
 },{"./attr":3,"./children":4,"./classlist":9,"./effects":10,"./events":13,"./html":14,"./style":11,"./text":15,"./val":16,"new-chain":17}],18:[function(require,module,exports){ var select = require("./select");

module.exports = create;

function create(tag){
  return select(document.createElement(tag));
}
 },{"./select":2}],3:[function(require,module,exports){ module.exports = attr;

function attr(chain){

  return function attr(element, name, value){
    if ( arguments.length == 2 ) {
      return element.getAttribute(name);
    }

    element.setAttribute(name, value);

    return chain;
  };

}
 },{}],4:[function(require,module,exports){ var unselect = require("./unselect");

module.exports = {
  add       : add,
  addBefore : addBefore,
  replace   : replace,
  remove    : remove
};

function add(element, child){
  element.appendChild(unselect(child));
}

function addBefore(element, child, ref){
  element.insertBefore(unselect(child), pick(element, ref));
}

function pick(parent, child){
  if ( typeof child == 'string') {
     return parent.querySelector(child);
  }

  return unselect(child);
}

function replace(element, target, replacement){
  element.replaceChild(unselect(replacement), pick(element, target));
}

function remove(element, child){
  element.removeChild(pick(element, child));
}
 },{"./unselect":5}],9:[function(require,module,exports){ module.exports = {
  addClass    : addClass,
  hasClass    : hasClass,
  removeClass : removeClass,
  toggleClass : toggleClass
};

function addClass(element, name){
  element.classList.add(name);
}

function hasClass(element, name){
  return element.classList.contains(name);
}

function removeClass(element, name){
  element.classList.remove(name);
}

function toggleClass(element, name){
  element.classList.toggle(name);
}
 },{}],10:[function(require,module,exports){ var style = require("./style");

module.exports = {
  hide: hide,
  show: show
};

function hide(element){
  style(element, 'display', 'none');
}

function show(element){
  style(element, 'display', '');
}
 },{"./style":11}],13:[function(require,module,exports){ module.exports = {
  change    : event('change'),
  click     : event('click'),
  keydown   : event('keydown'),
  keyup     : event('keyup'),
  keypress  : event('keypress'),
  mousedown : event('mousedown'),
  mouseover : event('mouseover'),
  mouseup   : event('mouseup'),
  resize    : event('resize'),
  on        : on,
  off       : off
};

function event(type){
  return function(element, callback){
    return on(element, type, callback);
  };
}

function off(element, event, callback){
  element.removeEventListener(event, callback, false);
}

function on(element, event, callback){
  element.addEventListener(event, callback, false);
}
 },{}],14:[function(require,module,exports){ module.exports = html;

function html(chain){
  return function(element, newValue){
    if ( arguments.length > 1 ) {
      element.innerHTML = newValue;
      return chain;
    }

    return element.innerHTML;
  };
}
 },{}],11:[function(require,module,exports){ var toCamelCase = require("to-camel-case");

module.exports = style;

function all(element, css){
  var name;
  for ( name in css ) {
    one(element, name, css[name]);
  }
}

function one(element, name, value){
  element.style[toCamelCase(name)] = value;
}

function style(element){
  if ( arguments.length == 3 ) {
    return one(element, arguments[1], arguments[2]);
  }

  return all(element, arguments[1]);
}
 },{"to-camel-case":12}],15:[function(require,module,exports){ module.exports = text;

function text(chain){
  return function(element, newValue){
    if ( arguments.length > 1 ) {
      element.textContent = newValue;
      return chain;
    }

    return element.textContent;
  };
}
 },{}],16:[function(require,module,exports){ module.exports = val;

function val(chain){
  return function(element, newValue){
    if ( arguments.length > 1 ) {
      element.value = newValue;
      return chain;
    }

    return element.value;
  };
}
 },{}],5:[function(require,module,exports){ var isHTML = require("./is-html"),
    parse = require('./parse');

module.exports = unselect;

function unselect(el){
  if ( Array.isArray(el) ) return el[0];
  if ( isHTML(el) ) return parse(el);
  return el;
}
 },{"./is-html":6,"./parse":7}],6:[function(require,module,exports){ module.exports = isHTML;

function isHTML(text){
  return typeof text == 'string' && /<\w+\s/.test(text);
}
 },{}],7:[function(require,module,exports){ module.exports = require("domify");
 },{"domify":8}],17:[function(require,module,exports){ module.exports = newChain;
module.exports.from = from;

function from(chain){

  return function(){
    var m, i;

    m = methods.apply(undefined, arguments);
    i   = m.length;

    while ( i -- ) {
      chain[ m[i].name ] = m[i].fn;
    }

    m.forEach(function(method){
      chain[ method.name ] = function(){
        method.fn.apply(this, arguments);
        return chain;
      };
    });

    return chain;
  };

}

function methods(){
  var all, el, i, len, result, key;

  all    = Array.prototype.slice.call(arguments);
  result = [];
  i      = all.length;

  while ( i -- ) {
    el = all[i];

    if ( typeof el == 'function' ) {
      result.push({ name: el.name, fn: el });
      continue;
    }

    if ( typeof el != 'object' ) continue;

    for ( key in el ) {
      result.push({ name: key, fn: el[key] });
    }
  }

  return result;
}

function newChain(){
  return from({}).apply(undefined, arguments);
}
 },{}],8:[function(require,module,exports){ 
/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}
 },{}],12:[function(require,module,exports){ /**
 * Convert a string to camel case
 *
 * @param {String} str
 * @param {Boolean} first upper-case first too ? (PascalCase)
 */
module.exports = function (str, first) {
  str = str.replace(/[_-]([a-z])/g, function (l) {
  	return l[1].toUpperCase()
  })

  if (first)
    str = str.charAt(0).toUpperCase() + str.slice(1)

  return str
} },{}] }; function require(o){ if(o[2]) return o[2].exports; o[0](function(u){ if(!require.m[o[1][u]]) { throw new Error('Cannot find module "' + u + '"'); } return require(require.m[o[1][u]]); }, o[2] = { exports: {} }, o[2].exports); return o[2].exports; };  return require(require.m[0]); }({ env:{} }));