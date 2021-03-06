/* global jQuery */
'use strict';

/* export default */function RotatedBoxShadow(element, options) {
  this.element = element;
  options      = options || {};
  this.reloadCSS();

  // Watch for style or class changes and update
  if (typeof(MutationObserver) !== 'undefined') {
    this.observer = new MutationObserver(function(mutations) {
      for(var i=0; i < mutations.length; i++) {
        if (mutations[i].type === 'attributes' && (
          mutations[i].attributeName === 'style' ||
          mutations[i].attributeName === 'class')) {
            this.apply();
        }
      }
    }.bind(this));
    this.observer.observe(this.element, {attributes: true});
  }
}

// Reload shadow def from CSS and apply according to current rotation
RotatedBoxShadow.prototype.reloadCSS = function() {
  this.css('box-shadow', ''); // remove box-shadow applied by us ?
  var shadowCSS = this.css('box-shadow');
  this.shadow   = this.parseBoxShadow(shadowCSS);
  if (!this.shadow.parsed || this.shadow.x[1] !== 'px' || this.shadow.y[1] !== 'px') {
    throw new Error('Box shadow offsets were not in pixels, or no box shadow CSS found');
  }
  this.boxShadowTheta = Math.atan2(this.shadow.y[0], this.shadow.x[0]);
  this.apply();
};

RotatedBoxShadow.prototype.apply = function(rotation) {
  if (typeof(rotation) === 'undefined') {
    var transformCSS = this.css('transform');
    rotation         = this.parseRotation(transformCSS);
  }
  var shadow    = Object.assign({}, this.shadow); //clone it
  var pt        = this.calcOffsets(shadow.x[0], shadow.y[0], rotation);
  shadow.x[0]   = Number(pt.x).toFixed(5);
  shadow.y[0]   = Number(pt.y).toFixed(5);
  var shadowCSS = this.stringifyBoxShadow(shadow);
  this.css('box-shadow', shadowCSS);
};

RotatedBoxShadow.prototype.dashToCamelCase = function _dashToCamelCase(property) {
  property = property.replace(/-([a-z])/g, function(dash, char) {
    return char.toUpperCase();
  });
  return property;
};

RotatedBoxShadow.prototype.css = function(property, value) {
  // if (typeof(jQuery) !== 'undefined') {
  //   var elt = jQuery(this.element);
  //   return elt.css.apply(elt, arguments);
  // }
  var propertyCamelCase = this.dashToCamelCase(property);

  if (typeof(value) !== 'undefined') {
    this.element.style[propertyCamelCase] = value;
  }
  return this.element.style[property] || window.getComputedStyle(this.element)[property];
};

RotatedBoxShadow.prototype.calcOffsets = function _calcOffsets(x, y, rotationDeg) {
  var theta = Math.PI * rotationDeg / -180;
  var len = Math.sqrt(x * x + y * y);
  theta += this.boxShadowTheta;
  return {
    x: len * Math.cos(theta),
    y: len * Math.sin(theta)
  };
};

RotatedBoxShadow.prototype.matchBoxShadow = function(shadowCSS) {
  var matchColor =
    '(' +
      '(?:(?:rgba?|hsla?)\\s*\\([^)]+\\))' +
      '|(?:#[a-fA-F0-9]+)' +
      '|(?:\\w+)' +
    ')';
  var matchNumberUnit         = '([\\d.-]+)(\\w*)';
  var matchOptionalNumberUnit = '(?:([\\d.-]+)(\\w*))?';
  var matchShadowParts        = matchNumberUnit + '\\s+' +
    matchNumberUnit + '\\s+' +
    matchNumberUnit + '\\s+' +
    matchOptionalNumberUnit;

  var regexColorFirst = new RegExp(matchColor + '\\s+' + matchShadowParts);
  var regexColorLast  = new RegExp(matchShadowParts + '\\s+' + matchColor);

  var shadow = shadowCSS.match(regexColorFirst);
  if (shadow) {
    // this matches the color-first box shadow definition returned from getComputedStyle
    // remove color and place on end so it's always element 9
    shadow[9] = shadow.splice(1, 1)[0];
  } else {
    shadow = shadowCSS.match(regexColorLast);
  }
  return shadow;
};

RotatedBoxShadow.prototype.parseBoxShadow = function _parseBoxShadow(shadowCSS) {
  var parsed={
      x: 0,
      y: 0,
      blur: 0,
      spread: 0,
      color: '#000',
      parsed: false
  };
  var shadow = this.matchBoxShadow(shadowCSS);
  if (!shadow) {
    return parsed;
  }
  parsed.x      = shadow.slice(1, 3);
  parsed.y      = shadow.slice(3, 5);
  parsed.blur   = shadow.slice(5,7);
  parsed.spread = shadow.slice(7,9);
  parsed.color  = shadow[9];
  parsed.parsed = true;
  return parsed;
};

RotatedBoxShadow.prototype.stringifyBoxShadow = function _stringifyBoxShadow(shadow) {
  if (!shadow.parsed) {
    return '';
  }
  var spread = shadow.spread;
  if (spread[0] === undefined) {
    spread = '';
  } else {
    spread = spread.join('');
  }
  return  shadow.x.join('')    + ' ' +
          shadow.y.join('')    + ' ' +
          shadow.blur.join('') + ' ' +
          spread               + ' ' +
          shadow.color;
};

RotatedBoxShadow.prototype.parseTransformMatrix = function _parseTransformMatrix(transformCSS) {
  var matrix = transformCSS.match(/^\s*matrix\s*\(([^)]+)/)[1].split(/,\s*/).map(Number);
  return Math.atan2(matrix[1], matrix[0]) * 180 / Math.PI;
};

RotatedBoxShadow.prototype.parseRotation = function _parseRotation(transform) {
  if (transform.match(/^\s*matrix/)) {
    return this.parseTransformMatrix(transform);
  }
  var rotation = transform.match(/rotateZ?\(\s*([-\d.]+)\s*deg\s*\)/);
  if (!rotation || rotation.length < 1) {
    return 0;
  }
  return rotation[1];
};

if (typeof(module) !== 'undefined') {
  module.exports = RotatedBoxShadow;
}
/* global jQuery, RotatedBoxShadow  */
'use strict';

if (typeof(jQuery) !== 'undefined') {
    jQuery.fn.rotatedBoxShadow = function(action) {

        return this.each(function() {
            var $this = jQuery(this)
            var inst = $this.data('_rotatedBoxShadow');
            if (inst) {
                if (!action) {
                    return; // NOP if no action
                }

                switch(action) {
                    case 'apply':
                        inst.apply();
                        return;
                    case 'reloadCSS':
                        inst.reloadCSS();
                        return;

                    default:
                        throw new Error('jquery rotatedBoxShadow: unknown method ' + action);
                }
            }
            $this.data('_rotatedBoxShadow', new RotatedBoxShadow(this));
        });
    };
}