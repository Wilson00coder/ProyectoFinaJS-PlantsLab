
// declaracion de funcion asincronica.
async function datosJson() {

  // haciendo una peticion de manera local.
  const Response = await fetch('/stock.json') // stock.json contiene un array con todos los productos.

    const data = await Response.json()

    // console.log(data); //! MOSTRAR POR CONSOLA LOS DATOS DEL ARHIVO JSON.

    // llamando a la funion,recorre e imprime todos los productos en el html.  
    mostrarCards(data);

}

datosJson();

// array vacio, almacena los productos elegidos por el usuario.
let carritoProductos = [];

// id "divProductosCards" < padre contenedor de las cards
const divProductosCards = document.getElementById("divProductosCards");
// id "tablaContenedor" 
const tbody = document.getElementById("tablaContenedor");
// id "precioFinal" < imprime el precio final de la compra.
const precioFinal = document.getElementById("precioFinal");

// modal Carrito 
// llama a la etiqueta boton con class "btnAbrirModal"
const abrirModal = document.querySelector('.btnAbrirModal')
const modal = document.querySelector('.modal')
const cerrarModal = document.querySelector('.btnCerrarModal')

// modal Finalizar Compra
const btnFinCompra = document.querySelector('#btnFinCompra')
const modalFinCompra = document.querySelector('.modalFinCompra')
const btnCerrarFinalizarCompra = document.querySelector('.btnCerrarFinCompra')



//? FUNCION: MOSTRAR TODOS LOS PRODUCTOS EN EL HTML.
function mostrarCards(stockPlantas) {

  divProductosCards.innerHTML = "";

  // recorrer array de los productos con metodo forEach.
  stockPlantas.forEach(Planta => {

    // creacion de etiqueta dinamica div con el metodo > createElement.
    let divCardHijo = document.createElement("div");

    // creacion de class "cardProductos"
    divCardHijo.classList.add("cardProducto");

    //
    divCardHijo.innerHTML += `
              <!-- CARD -->
              <div class="card_img">
                  <img class="card_imgProducto" src="${Planta.img}" alt="imagenDelProducto">
              </div>
  
              <div class="card_contenido">
                  
                  <h2>${Planta.nombre}</h2>
  
                  <p>${Planta.desc}</p>
  
                  <p> Tipo: ${Planta.tipoPlanta}.</p>
                  
                  <span class="precioCard">$${Planta.precio}</span>
  
                      <div class="btn_div">
  
                          <button id="btnAgregar${Planta.id}" class="btnCard">Comprar</button>
  
                      </div>
  
              </div>
          `;

    // añado como nodo hijo a "divCardHijo "en la etiqueta "divProductosCards", con el metodo .appendChild()
    divProductosCards.appendChild(divCardHijo);

    // declaracion de variable "boton", almacena los botones de todos los productos.
    let botonComprar = document.getElementById(`btnAgregar${Planta.id}`);
    // console.log(botonComprar); // ! MOSTRAR EN COSOLA TODOS LOS PRODUCTOS.

    //agrega un producto al carrito por su id.
    botonComprar.addEventListener("click", () => {

      // console.log(Planta.id); // ! MSOTRAR POR CONSOLA EL PRODUCTO QUE DESEA AGREGAR AL CARRITO.
      // ejecutar funcion con el ingreso del parametro "planta.id"() y "stockPlantas" 
      agregandoAlArrayCarrito(Planta.id, stockPlantas);

      // MODAL: MUESTRA MENSAJE "producto agregado".
      Toastify({
        text: "Producto Agregado.",
        className: "info",
        style: {
          background: "#45B549",
        },
      }).showToast();

    })

  });

}

//? FUNCION: AGREGAR PRODUCTOS AL CARRITO DEL USUARIO.
function agregandoAlArrayCarrito(plantaSeleccionada, stockPlantas) {

  // console.log(plantaSeleccionada); //! MOSTRAR EN CONSOLA, CUAL ES EL PRODUCTO QUE QUIERE SER AGREGADO.
  // console.log(stockPlantas); //! MOSTRAR EN CONSOLA, TODOS LOS PRODUCTOS INGRESADOS DEL JSON.

  // verifica si el producto a agregar esta/existe en el carrito del usuario "carritoProductos". < si el c.log devuelve "undefined" es porque no existe en el carrito del usuario.
  let verificacionDelProductoEncarrito = carritoProductos.find(planta => planta.id == plantaSeleccionada);
  // console.log(verificacionDelProductoEncarrito); //! undefined
  // console.log(carritoProductos); //! carrito vacio

  // condicional, si el producto a ingresar existe en el carrito ejecutar bloquer if, en caso contrario ejecutar else...
  if (verificacionDelProductoEncarrito) {

    // reasigna el valor que tenia la cantidad del producto. (le incrementa 1 a la cantidad cada vez que se ingrese el mismo producto.)
    verificacionDelProductoEncarrito.cantidad = verificacionDelProductoEncarrito.cantidad + 1;

    // declaracion de variable "InrementoCantidad" almacena la etiqueta que indica la cantidad de productos repetidos agregados
    let InrementoCantidad = document.getElementById(`tdCantidad${verificacionDelProductoEncarrito.id}`);

    // console.log(InrementoCantidad); //! MOSTRAR EN CONSOLA LA ETIQUETA.

    // actualiza la cantidad de cada producto. 
    InrementoCantidad.innerHTML = `<td id="tdCantidad${verificacionDelProductoEncarrito.id}">${verificacionDelProductoEncarrito.cantidad}</td>`;
    // console.log(InrementoCantidad); //! MOSTRAR EN CONSOLA LA ETIQUETA, CADA VEZ QUE INGRESA EL MISMO PRODUCTO SE ACTUALIZA EL CONTADOR...

    // actualizar valores del carrito.
    actualizarCarrito();

  } else { // si el producto no existe en el carrito del usuario, ejecutar el bloque else. (tiene que devolver "undefined"). 

    // busca en "stockPlantas" con el metodo find la planta que tenga el mismo id que el parametro ingresado "plantaSeleccionada".
    let agregandoProducto = stockPlantas.find(planta => planta.id == plantaSeleccionada);
    // console.log(agregandoProducto); //! MOSTRAR EN CONSOLA EL PRODUCTO A INGRESAR.

    // agrego el producto al array(carrito del usuario) con el metodo .push
    carritoProductos.push(agregandoProducto);

    // console.log(carritoProductos); //! MOSTRAR EN CONSOLA EL ARRAY CON EL PRODUCTO AGREGADO.

    // actualizar valores del carrito.
    actualizarCarrito();

    // visualizar los productos agregados en una lista de productos html
    imprimirProductoEnCarrito(agregandoProducto)

  }

}

localStorage.carritoUsuario && recuperarDatosStorage();

//? FUNCION: crea una lista de los productos elegidos por el usuario y los imprime/muestra/visualiza en el html.
function imprimirProductoEnCarrito(productoEnLista) {
  // "productoEnLista" hace referecnia a cada producto que es agregado 

  // crear etiqueta tr
  let tablaContenedor = document.createElement("tr"); // padre

  // con class
  tablaContenedor.classList.add("tabalLista"); // class de etiqueta padre

  // mostrar cada producto agregado en el html.
  tablaContenedor.innerHTML = `
          <tr>
              <td>${productoEnLista.nombre}</td>
              <td>${productoEnLista.tipoPlanta}</td>
              <td id="tdCantidad${productoEnLista.id}">${productoEnLista.cantidad}</td>
              <td>$${productoEnLista.precio}</td>
              <button class="btnEliminar btn-css" id="eliminar${productoEnLista.id}">
                <img src="/feathericons/trash.svg" alt="Carrito Porductos">
              </button>
          </tr>
      `;

  // imprimir etiqueta en el html
  tbody.appendChild(tablaContenedor);

  // declaracion de variable "botonEliminar" guarda el boton del producto agregado en el carrito.
  let botonEliminar = document.getElementById(`eliminar${productoEnLista.id}`);
  // console.log(botonEliminar); //! MOSTRAR EL BOTON ELIMINAR DEL PRODUCTO.

  // eliminar un producto del carrito.
  eventoEliminarProducto(botonEliminar, productoEnLista)

}

//? FUNCION: eliminar uno o mas productos.
function eventoEliminarProducto(productoEliminado, arrayProducto) {

  // console.log(productoEliminado); //! MOSTRAR POR CONSOLA EL BOTON ELIMINAR(DEL PRODUCTO).

  // EVENTO: eliminar producto del carrito.
  productoEliminado.addEventListener("click", () => {

    // condicional: eliminar un producto del carrito.
    if (arrayProducto.cantidad == 1) { //* si la cantidad del producto es igual a 1, se elimina la etiqueta padre del producto.

      productoEliminado.parentElement.remove(); // eliminar etiqueta padre

      // devolver un "nuevo" array, devolver los que sean distintos a "arrayProducto.id" con metodo filter.
      carritoProductos = carritoProductos.filter((elemento) => elemento.id != arrayProducto.id);

      // actualizacion de valores.
      actualizarCarrito();

      // MODAL mostrar mensaje: "producto eliminado".
      Toastify({
        text: "Producto Eliminado.",
        className: "info",
        style: {
          background: "#E42726",
        },
      }).showToast();

    } else { //* si no cumple con el bloque else, se resta la cantidad del producto 

      // resta la cantidad del producto -1
      arrayProducto.cantidad = arrayProducto.cantidad - 1; // reduce el valor de la cantidad -1

      // guarda la etiqueta en una variable.
      let cantidadResta = document.getElementById(
        `tdCantidad${arrayProducto.id}`
      );

      // console.log(cantidadResta); //! MOSTRAR EN CONSOLA LA ACTUALIZACION DE LA ETIQUETA.

      // vuelve a imprimir la cantidad del producto.
      cantidadResta.innerHTML = `<td id="tdCantidad${arrayProducto.id}">${arrayProducto.cantidad}</td>`;

      // actualiza los valores del carrito.(actualiza el precio total)
      actualizarCarrito();

      // MODAL mostrar mensaje:"producto eliminado".
      Toastify({
        text: "Producto Eliminado.",
        className: "info",
        style: {
          background: "#E42726",
        },
      }).showToast();

    }

  });

}

//? FUNCION: ACTUALIZAR EL PRECIO FINAL DEL CARRITO.
function actualizarCarrito() {
  // llamo a la etiqueta "precioFinal" ejecuta una oepracion, retornando el precio final del pedido.
  precioFinal.innerText = carritoProductos.reduce((ac, e) => ac + e.precio * e.cantidad, 0);
  // guarda los datos en el localstorage.
  enviarDatosStorage();
}

//? FUNCION: ALMAENA DATOS DEL ARRAY "carritoProductos" EN LOCALSTORAGE.
function enviarDatosStorage() {
  // 
  localStorage.setItem("carritoUsuario", JSON.stringify(carritoProductos));
}

//? FUNCION: RECUPERAR DATOS DEL ARRAY "carritoProductos" ACCEDIENDO AL LOCALSTORAGE.
function recuperarDatosStorage() {

  // recuperar datos llamando a la clave: carritoUsuario
  let recuperarStorage = JSON.parse(localStorage.getItem("carritoUsuario"));

  // console.log(recuperarStorage); //! MOSTRAR EN CONSOLA, LOS PRODUCTOS QUE ESTAN EN EL LOCALSTORAGE.

  // 
  recuperarStorage && recuperarStorage.forEach((e) => {

    // console.log(e); // ! MOSTRAR EN CONSOLA LOS PRODUCTOS ALMACENADOS EN EL LOCALSTORAGE.

    // funcion, visualiza los productos almacenados en una lista html.
    imprimirProductoEnCarrito(e);

    // añadir los elementos al carrito del usuario.
    carritoProductos.push(e);

    // actualizar valores
    actualizarCarrito();

  });

}

// EVENTOS.
// evento abrir modal que muestra el carrito
abrirModal.addEventListener("click", () => { // le asigno un evento a la variable "abrirModal" de tipo "click"
  modal.classList.remove('modalEvento')
})
// evento cerrar modal carrito
cerrarModal.addEventListener("click", () => {
  modal.classList.add('modalEvento')
})

// 
verificarCarrito(carritoProductos);

// ? FUNCION: PREGUNTA POR LA CANTIDAD DE OBJETOS QUE TENGO ALMACENADO EN EL CARRITO MODAL, EVALUA UNA SENTENCIA IF ELSE CON EL PRECIO FINAL DE LA COMPRA.
function verificarCarrito(cantidadCarrito) {

  // llamo a la variable que tiene almacenado el el boton "finalizar compra" y le asigno un evento de tipo "click".
  btnFinCompra.addEventListener("click", () => {

    // declaro variable que guarda la etiqueta html con el id "precioFinal".
    let spanPrecioFinalCarrito = document.getElementById('precioFinal');

    // console.log(spanPrecioFinalCarrito.innerText); //! MOSTRAR POR CONSOLA EL VALOR DE LA ETIQUETA.(EL PRECIO FINAL DE LA COMPRA)

    if (spanPrecioFinalCarrito.innerText == "0") { // * SI LA VARIABLE INGRESADA ES IGUAL A 0, SE EJECUTA EL BLOQUE IF.(MOSTRAR EL MENSAJE MODAL)

      // si se cumple la condicion if, mostrar mensaje modal.
      Toastify({
        text: "Por favor, ingresar productos al carrito. ⚠️",
        className: "info",
        style: {
          background: "#E42726",
        },
      }).showToast();

    } else { // * SI NO CUMPLE CON EL IF, EJECUTAR ELSE. (SE VISUALIZA EN PANTALLA UN MENSAJE MODAL "compra finalizada").

      // agregando una class a la etiqueta (se muestra un modal)
      modalFinCompra.classList.add('modalEvento');

      // 
      finalizarCompra(cantidadCarrito);

      // ? FUNCION: finaliza la compra a partir de un evento tipo "click". limpia el contenido del modal carrito, vacia el localstorage, vacia el array de los productos seleccionados y elimina la clase "modalEvento" de la etiqueta...
      function finalizarCompra(cantidadCarrito) {

        // agrego un evento al boton "cerrar". cuando dicho evento se ejecute, se invocan las funciones: limpiarContenidoCarrito - vaciarLocalStorage - vaciarCarritoArray y elimina lade la etiqueta la clase "modalEvento".
        btnCerrarFinalizarCompra.addEventListener("click", () => {

          limpiarContenidoCarrito();

          vaciarLocalStorage();

          vaciarCarritoArray(cantidadCarrito);

          modalFinCompra.classList.remove('modalEvento');

        })

      }

      // ? FUNCION: vaciar carrito en localstorage
      function vaciarLocalStorage() {

        // borrar todos los productos de localstorage con el metodo clear.
        localStorage.clear();

        // console.log(localStorage); //! MOSTRAR EN CONSOLA EL LOCALSTORAGE VACIO.

      }

      // ? FUNCION: LIMPUAR LA LISTA DE PRODUCTO QUE SE IMPRIME EN EL CARRITO HTML.
      function limpiarContenidoCarrito() {

        // seleccionando elemento padre (etiqueta: tbody ) del carrito, con su etiqueta id"tablaContenedor".
        let padre = document.getElementById('tablaContenedor');

        // console.log(padre); //! MOSTRAR LA ETIQUETA.

        // selecciono a todos los elementos hijos con la etiqueta "tr"
        let lista = document.getElementsByTagName('tr');

        // console.log(lista); //! MOSTRAR POR CONSOLA UN HTMLCOLLECTION CON LOS ELEMENTOS HIJOS.

        // eliminar hijos del nodo padre. < elimianr etiqeutas a partir del elemento 1.
        for (let i = lista.length; i > 1; i--) {
          padre.removeChild(lista.item(1));
        }

        // llamo a la etiqueta que muestra el precio final de la compra.
        let spanPrecioFinal = document.getElementById('precioFinal');
        // console.log(spanPrecioFinal);//! MOSTRAR POR CONSOLA EL VALOR ACTUAL DE LA COMPRA.

        // a dicha variable le asigno el valor 0 ("formateando" el precio final).
        spanPrecioFinal.innerText = "0";

      }

      // ? FUNCION: VACIAR EL ARRAY DE PRODUCTOS.
      function vaciarCarritoArray(arrayCarrito) {

        // le asigno un nuevo array vacio.
        arrayCarrito = [];

        // console.log(arrayCarrito); //! MOSTRAR EN CONSOLA EL ARRAY VACIO.

      }

    }

  })
}