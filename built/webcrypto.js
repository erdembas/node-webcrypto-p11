"use strict";
var graphene_pk11_1 = require("graphene-pk11");
var subtlecrypto_1 = require("./subtlecrypto");
var key_storage_1 = require("./key_storage");
var utils = require("./utils");
var WebCrypto = (function () {
    function WebCrypto(props) {
        this.subtle = null;
        var mod = this.module = graphene_pk11_1.Module.load(props.library, props.name);
        mod.initialize();
        this.initialized = true;
        var slot = mod.getSlots(props.slot);
        if (!slot)
            throw new Error("Slot by index " + props.slot + " is not found");
        this.session = slot.open(props.sessionFlags);
        this.session.login(props.pin);
        for (var i in props.vendors) {
            graphene_pk11_1.Mechanism.vendor(props.vendors[i]);
        }
        this.subtle = new subtlecrypto_1.SubtleCrypto(this.session);
        this.keyStorage = new key_storage_1.KeyStorage(this.session);
    }
    WebCrypto.prototype.getRandomValues = function (array) {
        return new Uint8Array(this.session.generateRandom(array.byteLength));
    };
    WebCrypto.prototype.getGUID = function () {
        return utils.GUID(this.session);
    };
    WebCrypto.prototype.close = function () {
        if (this.initialized) {
            this.session.logout();
            this.session.close();
            this.module.finalize();
        }
    };
    return WebCrypto;
}());
module.exports = WebCrypto;
//# sourceMappingURL=webcrypto.js.map