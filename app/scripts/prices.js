'use strict';
// Closure
(function () {

  /**
  * Decimal adjustment of a number.
  *
  * @param	{String}	type	The type of adjustment.
  * @param	{Number}	value	The number.
  * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
  * @returns	{Number}			The adjusted value.
  */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function (value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function (value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function (value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

})();
var Departamento = function () {

  var self = this;

  var calcularPrecio = function dptoCalcularPrecio(porcentajeEntradaPropuesto) {
    var valorPedido = 87000;
    var descuentoMaximo = 6960;
    var porcentajeEntrada = porcentajeEntradaPropuesto / 100;
    if (porcentajeEntradaPropuesto < 30) {
      return valorPedido;
    }
    // mas entrada -> mas descuento
    // menos entrada -> X menos descuento
    var entrada = porcentajeEntrada * valorPedido;
    return valorPedido - (entrada * descuentoMaximo / valorPedido);
  };

  var PRECIO = 87000;
  self.entrada = ko.observable(26100);
  self.pctEntrada = ko.observable(30);
  self.updating = false;
  self.entrada.subscribe(function (newVal) {
    if (self.updating) { return; }
    var pct = Math.round10(parseInt(newVal, 10) * 100 / PRECIO, -2);
    self.updating = true;
    self.pctEntrada(pct);
    self.updating = false;
  });
  self.pctEntrada.subscribe(function (newVal) {
    if (self.updating) { return; }
    var entrada = parseInt(newVal, 10) * PRECIO / 100;
    self.updating = true;
    self.entrada(entrada);
    self.updating = false;
  });
  self.precio = ko.observable();

  self.calcular = function () {
    var pct = parseInt(self.pctEntrada(), 10);
    self.precio(calcularPrecio(pct));
  };
};

ko.applyBindings(new Departamento());
