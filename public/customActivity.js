// Este archivo debe estar en /public y servirlo vía tu server (ej: /public/customActivity.js)

(function() {
  var connection = new Postmonger.Session();
  var productoIdInput = null;

  document.addEventListener('DOMContentLoaded', function() {
    productoIdInput = document.getElementById('productoId');
    document.getElementById('saveBtn').addEventListener('click', save);
    connection.trigger('ready'); // Indica que el modal está listo
  });

  // Escucha evento para inicializar el modal con datos previos
  connection.on('initActivity', function(payload) {
    var inArgs = payload.arguments && payload.arguments.execute && payload.arguments.execute.inArguments;
    // Si ya había un productoId configurado, lo pone en el campo
    if (inArgs && inArgs[0] && inArgs[0].productoId) {
      productoIdInput.value = inArgs[0].productoId;
    }
  });

  // Cuando el usuario guarda la config
  function save() {
    var productoIdValue = productoIdInput.value || "";
    // Construye los argumentos de entrada
    var payload = {
      arguments: {
        execute: {
          inArguments: [{ productoId: productoIdValue }]
        }
      }
    };
    // Envía a Journey Builder
    connection.trigger('updateActivity', payload);
  }
})();
