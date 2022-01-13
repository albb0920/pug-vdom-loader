var h = function(){
  let realH = require('maquette').h;

  return function(selector, props, children) {
    var attributes = Object.assign({}, props.attributes || {}, props);
    delete attributes["attributes"];

    // class attribute should be merged with selector
    if (attributes.class) {
      selector += "." + attributes.class.trim().split(/ +/).join(".");
      delete attributes["class"];
    }

    return realH(selector, attributes, children);
  }
}();
