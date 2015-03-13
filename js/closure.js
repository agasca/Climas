//copiar y pegar en console

//ejemplo 1
function f(){
	var b = "b";
	return function(){
		return b;
	}
}

var n = f();
n();


//ejemplo 2
function aumentarFuente(size){
	return function(){
		document.body.style.fontSize = size + 'px';
	}
}


var size30 = aumentarFuente(30);
size30();




//ejemplo 3
//auto inicia
var Contador = (function(){
   var _contadorPrivado =0;

   function _cambiarValor(valor){
     _contadorPrivado += valor;
   };

   return {
      incrementar: function(){
        _cambiarValor(1);
      },
      decrementar: function(){
        _cambiarValor(-1);
      },
      valor: function(){
         return _contadorPrivado;
      }
   };
})();


//llamando con las que tienen return (incrementar, decrementar y valor que estan accesibles, no a contadorPrivado)
Contador.valor
devuelve 0
Contador.incrementar()
Contador.valor()
Contador.incrementar()
Contador.incrementar()
Contador.incrementar()
Contador.incrementar()
Contador.valor()






Contador.valor
Contador.valor();
Contador.incrementar();
Contador.incrementar();
Contador.incrementar();
Contador.incrementar();
Contador.valor();
