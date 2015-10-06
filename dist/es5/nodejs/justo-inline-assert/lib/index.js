"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equal = equal;
exports.notEqual = notEqual;
exports.same = same;
exports.notSame = notSame;
exports.like = like;
exports.notLike = notLike;
exports.between = between;
exports.notBetween = notBetween;
exports.greaterThan = greaterThan;
exports.notGreaterThan = notGreaterThan;
exports.lessThan = lessThan;
exports.notLessThan = notLessThan;
exports.contain = contain;
exports.notContain = notContain;
exports.insideOf = insideOf;
exports.notInsideOf = notInsideOf;
exports.have = have;
exports.notHave = notHave;
exports.haveAny = haveAny;
exports.allHave = allHave;
exports.notAllHave = notAllHave;
exports.raise = raise;
exports.notRaise = notRaise;
exports.instanceOf = instanceOf;
exports.notInstanceOf = notInstanceOf;

function equal(one, two) {
  var res;

  if (typeof one == "object" && typeof two == "object") res = deq(one, two);else res = one == two;

  return res;

  function deq(one, two) {
    var res;

    if (one === null || one === undefined || two === null || two === undefined) {
      res = one == two;
    } else if (one.prototype != two.prototype) {
      res = false;
    } else if (one instanceof Date && two instanceof Date) {
      res = one.getTime() == two.getTime();
    } else if (one instanceof Array && two instanceof Array) {
      if (one.length != two.length) {
        res = false;
      } else {
        res = true;

        for (var i = 0; res && i < one.length; ++i) {
          res = equal(one[i], two[i]);
        }
      }
    } else {
      var keys1 = Object.keys(one);
      var keys2 = Object.keys(two);

      if (keys1.length != keys2.length) {
        res = false;
      } else {
        res = true;

        for (var i = 0; res && i < keys1.length; ++i) {
          var _name = keys1[i];
          res = equal(one[_name], two[_name]);
        }
      }
    }

    return res;
  }
}

var eq = equal;

exports.eq = eq;

function notEqual(one, two) {
  return !equal(one, two);
}

var ne = notEqual;
exports.ne = ne;
var neq = notEqual;

exports.neq = neq;

function same(one, two) {
  return one === two;
}

function notSame(one, two) {
  return !same(one, two);
}

function like(value, re) {
  return re.test(value);
}

function notLike(value, re) {
  return !like(value, re);
}

function between(value, left, right) {
  return value >= left && value <= right;
}

function notBetween(value, left, right) {
  return !between(value, left, right);
}

function greaterThan(one, two) {
  return one > two;
}

var gt = greaterThan;

exports.gt = gt;

function notGreaterThan(one, two) {
  if (typeof one == "object") {
    return true;
  } else {
    return !greaterThan(one, two);
  }
}

var ngt = notGreaterThan;

exports.ngt = ngt;

function lessThan(one, two) {
  return one < two;
}

var lt = lessThan;

exports.lt = lt;

function notLessThan(one, two) {
  if (typeof one == "object") {
    return true;
  } else {
    return !lessThan(one, two);
  }
}

var nlt = notLessThan;

exports.nlt = nlt;

function contain(col, item) {
  var res;

  if (typeof col == "string") {
    res = col.indexOf(item) >= 0;
  } else if (col instanceof Array) {
    res = false;

    for (var i = 0; !res && i < col.length; ++i) {
      res = equal(col[i], item);
    }
  } else {
    res = false;
  }

  return res;
}

function notContain(col, item) {
  if (typeof col == "object" && !(col instanceof Array)) {
    return true;
  } else {
    return !contain(col, item);
  }
}

function insideOf(item, col) {
  return contain(col, item);
}

function notInsideOf(item, col) {
  return !insideOf(item, col);
}

function have(obj, props) {
  return typeof props == "string" ? hasProperty(obj, props) : hasProperties(obj, props);
}

function notHave(obj, props) {
  return !have(obj, props);
}

function haveAny(obj, props) {
  var exist;

  if (props instanceof Array) {
    exist = false;

    if (props.length > 0) {
      for (var i = 0; !exist && i < props.length; ++i) {
        exist = hasProperty(obj, props[i]);
      }
    }
  } else {
    var keys = Object.keys(props);

    exist = false;
    for (var i = 0; !exist && i < keys.length; ++i) {
      var _name2 = keys[i];
      var value = props[_name2];

      exist = hasProperty(obj, _name2) && equal(obj[_name2], value);
    }
  }

  return exist;
}

function allHave(list, props) {
  var res;

  res = false;

  if (list instanceof Array) {
    res = true;

    if (list.length > 0) {
      for (var i = 0; res && i < list.length; ++i) {
        res = have(list[i], props);
      }
    }
  } else {
    res = false;
  }

  return res;
}

function notAllHave(list, props) {
  return !allHave(list, props);
}

function raise(fn) {
  var error, params, thrown, res;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (args.length == 1) {
    if (args[0] instanceof Array) params = args[0];else error = args[0];
  } else if (args.length > 1) {
    params = args[0];
    error = args[1];
  }

  try {
    fn.apply(fn, params);
  } catch (e) {
    thrown = e;
  }

  if (!thrown) {
    res = false;
  } else {
    if (error) {
      if (typeof error == "string") res = thrown.message == error;else if (error instanceof RegExp) res = error.test(thrown.message);else if (error instanceof Function) res = thrown instanceof error;else res = have(thrown, error);
    } else {
      res = true;
    }
  }

  return res;
}

function notRaise(fn) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return !raise.apply(undefined, [fn].concat(args));
}

function instanceOf(obj, clss) {
  var res;

  if (typeof clss == "string") {
    res = obj.constructor.name == clss;
  } else if (typeof clss == "function") {
    if (clss === String) res = typeof obj == "string";else if (clss === Number) res = typeof obj == "number";else if (clss === Boolean) res = typeof obj == "boolean";else res = obj instanceof clss;
  } else {
    res = false;
  }

  return res;
}

function notInstanceOf(obj, clss) {
  return !instanceOf(obj, clss);
}

function hasProperty(obj, prop) {
  var exist;

  exist = obj.hasOwnProperty(prop);

  if (!exist && obj.constructor) {
    for (var clss = obj.constructor; !exist && clss && clss.prototype; clss = clss.super_ || Object.getPrototypeOf(clss)) {
      var desc = Object.getOwnPropertyDescriptor(clss.prototype, prop);
      exist = desc ? !!desc.get : false;
    }
  }

  return exist;
}

function hasProperties(obj, props) {
  var exist;

  if (props instanceof Array) {
    if (props.length === 0) {
      exist = false;
    } else {
      exist = true;

      for (var i = 0; exist && i < props.length; ++i) {
        exist = hasProperty(obj, props[i]);
      }
    }
  } else {
    var keys = Object.keys(props);

    if (keys.length === 0) {
      exist = false;
    } else {
      exist = true;

      for (var i = 0; exist && i < keys.length; ++i) {
        var _name3 = keys[i];
        var value = props[_name3];

        exist = hasProperty(obj, _name3) && equal(obj[_name3], value);
      }
    }
  }

  return exist;
}
