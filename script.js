// SIMULADOR CARRITO DE COMPRAS.


// fetch cargar datos de local json.
fetch("./stock.json")
  .then((response) => response.json())
  .then((data) => {

    // array vacio, almacena los productos elegidos por el usuario.
    let carritoProductos = [];

    // etiqueta padre de las cards
    const divProductosCards = document.getElementById("divProductosCards");
    // etiqueta padre del carrito usuario.
    const tbody = document.getElementById("tablaContenedor");
    // id "precioTotal" < precio final de la compra.
    const precioFinal = document.getElementById("precioFinal");
    // input con id "buscadorProductos"
    const inputBuscador = document.getElementById("buscadorId");
    // btn buscador de productos
    const btnBuscador = document.getElementById("btnBuscadorId");
    // ubica a la etiqueta main con class "main"
    const mainClass = document.querySelector('.main');

    const abrirModal = document.querySelector('.btnAbrirModal')
    const modal = document.querySelector('.modal')
    const cerrarModal = document.querySelector('.btnCerrarModal')


    mostrarCards(data);

    //? mostrar cards de los productos en el html
    function mostrarCards(arrayPlantas) {
      divProductosCards.innerHTML = "";

      // recorrer array de los productos con metodo forEach.
      arrayPlantas.forEach((Planta) => {
        // creacion de etiqueta dinamica div con el metodo > createElement.
        let divCardHijo = document.createElement("div");
        // creacion de class "cardProductos"
        divCardHijo.classList.add("cardProductos");
        //
        divCardHijo.innerHTML += `
            <!-- CARD -->
            <div class="card_img">
                <img class="card_imgProducto" src="${Planta.img}" alt="imagenDelProducto">
            </div>

            <div class="card_contenido">
                

                <h2>${Planta.nombre}</h2>

                <p>${Planta.desc}</p>

                <p> Tipo de Planta: ${Planta.tipoPlanta}.</p>

                <p> Precio: $${Planta.precio}</p>

                    <div class="btn_div">

                        <button id="btnAgregar${Planta.id}" class="btnCard">
                        Comprar
                        </button>

                    </div>

            </div>
        `;

        // añado como nodo hijo a "divCardHijo "en la etiqueta "divProductosCards", con el metodo .appendChild()
        divProductosCards.appendChild(divCardHijo);

        // btnAgregar.onclick = () => agregarAlCarrito(Plantas.id);

        eventoAgregarProducto(`btnAgregar${Planta.id}`, `${Planta.id}`);
      });
    }

    //? FUNCION: agregar uno o mas productos.
    function eventoAgregarProducto(eventoAgregar, plantaId) {
      // evento: agregar producto al carrito.
      let btnAgregar = document.getElementById(eventoAgregar);
      // evento addEventListener (cada vez que haga click en el boton, se va a ejecutar la funcion "agregarAlCarrito")
      btnAgregar.addEventListener("click", () => {
        // ejecutar la funcion "agregarAlCarrito"
        // agregarAlCarrito(Planta.id);
        agregarAlCarrito(plantaId);
        // MODAL:"producto agregado"
        Toastify({
          text: "Producto Agregado.",
          className: "info",
          style: {
            background: "#45B549",
          },
        }).showToast();
      });
    }

    //? FUNCION: agregar productos al carrito vacio.
    function agregarAlCarrito(btnAgregarId) {
      // devovler el valor del primero elemento en el array que cumpla con la condicion
      let cantidadDeProductos = carritoProductos.find((e) => e.id == btnAgregarId); // tiene que ser igual al id que ingresa por parametro

      // condicional: (verifica la cantidad de productos)
      if (cantidadDeProductos) {
        // reemplaza la cantidad y le suma 1
        cantidadDeProductos.cantidad = cantidadDeProductos.cantidad + 1; //aumenta el valor de la cantidad
        let cantidadSuma = document.getElementById(
          `tdCantidad${cantidadDeProductos.id}`
        );
        cantidadSuma.innerHTML = `<td id="tdCantidad${cantidadDeProductos.id}">${cantidadDeProductos.cantidad}</td>`;
        // actualiza le carrito.
        actualizarCarrito();
      } else {
        // buscar un elemento en el array con el metodo find que cumpla con la condicion indicada. (id del array tiene que ser igual a btnId)
        let productoAgregado = data.find((plantaFind) => plantaFind.id == btnAgregarId);
        // llamando al array "carritoProductos" y almacena el producto.
        carritoProductos.push(productoAgregado);
        // actualiza le carrito.
        actualizarCarrito();

        mostrarCarrito(productoAgregado);



      }
      // enviarDatosStorage()

      
    }





    /*
    function mostrarCarrito() {
      let divPadreCarrito = document.createElement('div')
      divPadreCarrito.classList.add('modal')
      divPadreCarrito.innerHTML = `
      <div class="modalContenedor"> 

          <div class="modalHeader">
              <h5 class="modalTitulo">carrito</h5>
              <button type="button" class="modalCerrar" >
                  X
              </button>
          </div>

          <div class="modalBody">
              <table class="modalTable">
                  <thead>
                      <tr>
                          <th>nombre</th>
                          <th>tipo de planta</th>
                          <th>cantidad</th>
                          <th>precio</th>
                          <th>borrar</th>
                      </tr>
                  </thead>
                  
                  <tbody id="tablaContenedor">
                      
                  </tbody>

              </table>
          </div>

          <div class="modalFooter">
              <button>finalizar compra</button>
              <p> Precio Final: $<span id="precioFinal">0</span></p>
          </div>

      </div>
      `
      mainClass.appendChild(divPadreCarrito)

    } */

    localStorage.carritoUsuario && recuperarDatosStorage();

    //? FUNCION: mostrar productos elegidos por el usuario. (MODAL CARRITO.)
    function mostrarCarrito(arrayProducto) {
      // crear etiqueta
      let tablaContenedor = document.createElement("tr"); // padre
      // con class
      tablaContenedor.classList.add("tabla-contador"); // calss de etiqueta padre

      // html
      tablaContenedor.innerHTML = `

        <tr>
            <td>${arrayProducto.nombre}</td>
            <td>${arrayProducto.tipoPlanta}</td>
            <td id="tdCantidad${arrayProducto.id}">${arrayProducto.cantidad}</td>
            <td>$${arrayProducto.precio}</td>
            <button class="btnEliminar" id="eliminar${arrayProducto.id}">Eliminar</button>
        </tr>
    `;
      // imprimir etiqueta en el html
      tbody.appendChild(tablaContenedor);

      // enviarDatosStorage()

      eventoEliminarProducto(`eliminar${arrayProducto.id}`, arrayProducto);
    }

    //? FUNCION: eliminar uno o mas productos.
    function eventoEliminarProducto(productoEliminado, arrayProducto) {
      // EVENTO eliminar producto seleccionado del carrito.
      let btnEliminar = document.getElementById(productoEliminado);
      btnEliminar.addEventListener("click", () => {
        // condicional: eliminar un producto

        if (arrayProducto.cantidad == 1) {
          btnEliminar.parentElement.remove(); // eliminar etiqueta padre
          // devolver un "nuevo" array, devolver los que sean distintos a "arrayProducto.id" con metodo filter
          carritoProductos = carritoProductos.filter(
            (elemento) => elemento.id != arrayProducto.id
          );
          // actualizacion de valores.
          actualizarCarrito();

          // MODAL:"producto eliminado"
          Toastify({
            text: "Producto Eliminado.",
            className: "info",
            style: {
              background: "#E42726",
            },
          }).showToast();
        } else {
          // resta la cantidad del producto -1
          arrayProducto.cantidad = arrayProducto.cantidad - 1; // reduce el valor de la cantidad -1
          let cantidadResta = document.getElementById(
            `tdCantidad${arrayProducto.id}`
          );
          cantidadResta.innerHTML = `<td id="tdCantidad${arrayProducto.id}">${arrayProducto.cantidad}</td>`;
          // actualizar carrito
          actualizarCarrito();

          // enviarDatosStorage()

          // MODAL:"producto eliminado"
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

    // evento abrir modal carrito
    abrirModal.addEventListener("click", () => {
      modal.classList.remove('modalEvento')
    })
    // evento cerrar modal carrito
    cerrarModal.addEventListener("click", () => {
      modal.classList.add('modalEvento')
    })



    //? FUNCION: almacenar datos de array "carritoProductos" en localStorage
    function enviarDatosStorage() {
      localStorage.setItem("carritoUsuario", JSON.stringify(carritoProductos));
    }

    //? FUNCION: recuperar datos de array "carritoProductos" en localStorage
    function recuperarDatosStorage() {
      // recuperar datos llamando a la clave: carritoUsuario
      let recuperarStorage = JSON.parse(localStorage.getItem("carritoUsuario"));
      // condicional
      recuperarStorage && recuperarStorage.forEach((e) => {
          // funcion
          mostrarCarrito(e);
          // añadir elementos al array "carritoProductos"
          carritoProductos.push(e);
          // actualizar valores
          actualizarCarrito();
        });
    }

    //? actualizar precio del carrito.
    function actualizarCarrito() {
      // precio final de los productos agregados en el carrito.
      precioFinal.innerText = carritoProductos.reduce((ac, e) => ac + e.precio * e.cantidad,0);
      enviarDatosStorage();
    }

  });
