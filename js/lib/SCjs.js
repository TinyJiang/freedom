/**
 * SCjs
 * Simple Class System for JavaScript
 * Author Tiny Jiang
 */
(function() {
    var SC = {},
        _ = {},
        classCache = {},
        rootPrototype,
        count = 0,
        errs;

    rootPrototype = {};

    errs = {
        idExsist: function(id) {
            return new RangeError('The id :' + id + ' is exsist in the context, please try anthor one.')
        },
        idType: function() {
            return new TypeError('The id must be String type.');
        }
    };

    /**
     *判断class是否为SCclass
     *
     */
    _.isSC = function(clz) {
        return SC.isType(clz, 'Object') && !SC.isType(classCache[clz.id], 'undefined') && SC.isType(clz.SC_constructor, 'Function');
    };

    _.getID = function(id) {
        var _id, idIndex = count++;
        _id = SC.isType(id, 'String') ? id : ('SC-' + idIndex);
        if (classCache[_id]) {
            throw errs.idExsist(_id)
            return
        }
        return _id;
    }


    _.parseSC = function(fun, id) {
        var clz;
        if (!SC.isType(fun, 'Function')) {
            return
        }
        clz = {
            id: _.getID(id),
            SC_constructor: fun,
        };
        classCache[id] = clz;
        return clz;
    };

    SC.isType = function(obj, type) {
        var rs = {}.toString.call(obj) == ('[object ' + type + ']')
        if (type == 'global' && !rs) {
            return SC.isType(obj, 'Window');
        }
        return rs;
    };

    SC.clone = function(obj, isDeep) {
        var i, o;
        isDeep = SC.isType(isDeep, 'Boolean') && isDeep;
        if (SC.isType(obj, 'Object') || SC.isType(obj, 'Array')) {
            o = SC.isType(obj, 'Object') ? {} : [];
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    o[i] = isDeep ? SC.clone(obj[i]) : obj[i];
                }
            }
        } else {
            o = obj;
        }
        return o;
    };

    SC.apply = function(ori, obj) {
        var i;
        ori = SC.isType(ori, 'Object') ? ori : {};
        if (SC.isType(obj, 'Object')) {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    ori[i] = SC.clone(obj[i]);
                }
            }
        }
        return ori;
    };

    SC.define = function(parent, conf, initial) {
        var clz, _proto, c_obj = {},
            cst, i;
        if (SC.isType(parent, 'Function')) {
            parent = _.parseSC(parent);
        }

        if (!_.isSC(parent)) {
            conf = parent;
            initial = conf;
            parent = null;
        }
        conf = SC.isType(conf, 'Object') ? conf : {};
        initial = SC.isType(initial, 'Function') ? initial : function() {};

        _proto = SC.clone((parent && _.isSC(parent)) ? parent.SC_constructor.prototype : rootPrototype); //没有父节点时使用根节点为prototype

        for (i in conf) {
            if (conf.hasOwnProperty(i)) {
                //将function放入prototype中，其余放入待初始化对象配置中
                if (SC.isType(conf[i], 'Function')) {
                    _proto[i] = conf[i];
                } else {
                    c_obj[i] = conf[i];
                }
            }
        }


        cst = function(custom) {
            var me = this;
            parent && parent.SC_constructor.call(me);
            SC.apply(me, c_obj);
            SC.apply(me, custom);
            initial.call(me);
        };
        cst.prototype = _proto;
        cst.prototype.constructor = cst;

        if (conf.id && !SC.isType(conf.id, 'String')) {
            throw errs.idType();
        }
        return _.parseSC(cst, conf.id)
    };

    SC.create = function(clz, conf) {
        return _.isSC(clz) ? (new clz.SC_constructor(conf)) : conf;
    };

    SC.isInstanceof = function(obj, clz) {
        return SC.isType(obj, 'Object') && _.isSC(clz) && obj instanceof clz.SC_constructor;
    };
    
    if ( typeof define === "function" && define.amd) {
		define( [], function () { return SC; } );
		return
	}
    
    typeof window != 'undefined' && SC.isType(window, 'global') && (window.SC = SC) //浏览器环境
    typeof module != 'undefined' && SC.isType(module, 'Object') && SC.isType(exports, 'Object') && (module.exports = SC) //node 环境
})()