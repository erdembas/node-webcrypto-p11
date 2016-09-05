"use strict";
var error_1 = require("./error");
var key_1 = require("./key");
var KeyStorage = (function () {
    function KeyStorage(session) {
        this.session = session;
    }
    Object.defineProperty(KeyStorage.prototype, "length", {
        get: function () {
            throw new Error("Not implemented yet");
        },
        enumerable: true,
        configurable: true
    });
    KeyStorage.prototype.clear = function () {
        this.session.clear();
    };
    KeyStorage.prototype.getItemById = function (id) {
        var keys = this.session.find({ id: new Buffer(id) });
        if (!keys.length) {
            return null;
        }
        if (keys.length > 1)
            console.log("WebCrypto:PKCS11: " + keys.length + " keys matches ID '" + id + "'");
        return keys.items(0);
    };
    KeyStorage.prototype.getItemByClassName = function (cls) {
        var keys = this.session.find({ class: cls });
        if (!keys.length) {
            return null;
        }
        if (keys.length > 1)
            console.log("WebCrypto:PKCS11: " + keys.length + " keys matches ID '" + cls + "'");
        return keys.items(0);
    };
    KeyStorage.prototype.getItemByClass = function (cls, alg) {
        var sobj = this.getItemByClassName(cls);
        if (sobj) {
            var _key = sobj.toType();
            return new key_1.CryptoKey(_key, alg);
        }
        else
            return null;
    };
    KeyStorage.prototype.getItem = function (key) {
        var sobj = this.getItemById(key);
        if (sobj) {
            var _key = sobj.toType();
            var alg = JSON.parse(_key.label);
            return new key_1.CryptoKey(_key, alg);
        }
        else
            return null;
    };
    KeyStorage.prototype.key = function (index) {
        throw new Error("Not implemented yet");
    };
    KeyStorage.prototype.removeItem = function (key) {
        var sobj = this.getItemById(key);
        if (sobj) {
            sobj.destroy();
        }
    };
    KeyStorage.prototype.setItem = function (key, data) {
        if (!(data instanceof key_1.CryptoKey))
            throw new error_1.WebCryptoError("Parameter 2 is not P11CryptoKey");
        var _key = data;
        if (!_key.key.token) {
            this.session.copy(_key.key, {
                token: true,
                id: new Buffer(key),
                label: JSON.stringify(data.algorithm)
            });
        }
    };
    return KeyStorage;
}());
exports.KeyStorage = KeyStorage;
//# sourceMappingURL=key_storage.js.map