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

    // maquette breaks if children is a number
    if (typeof children == "number"){
      children = children.toString();
    } else if(Array.isArray(children)){
      children = children.map(function(child){
        return (typeof child == "number") ? child.toString() : child;
      })
    }

    return realH(selector, attributes, children);
  }
}();
