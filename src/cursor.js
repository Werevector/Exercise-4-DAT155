"use strict";

function Cursor() {
  this._model = null;
}

Cursor.prototype.load = function(objMtlLoader) {
  var self = this;
  objMtlLoader.load("resources/StopSign/StopSign.obj",
                    "resources/StopSign/StopSign.mtl",
                    function(obj) {
                      self._model = obj;
                    });
}
