class Cerveza {
  constructor(id, nombre, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

class Catalogo {
  constructor() {
    this.cervezas = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("json/cervezas.json");
    this.cervezas = await resultado.json();
    cargarProductos(this.cervezas);
  }

  agregarProducto(id, nombre, precio, categoria, imagen) {
    const cerveza = new Cerveza(id, nombre, precio, categoria, imagen);
    this.cervezas.push(cerveza);
  }

  traerProducto() {
    return this.cervezas;
  }

  productoPorId(id) {
    return this.cervezas.find((cerveza) => cerveza.id === id);
  }

  productosPorNombre(palabra) {
    return this.cervezas.filter((cerveza) =>
      cerveza.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidadCervezas = 0;
    this.listar();
  }
  enElCarrito({ id }) {
    return this.carrito.find((cerveza) => cerveza.id === id);
  }
  agregar(cerveza) {
    const cervezaEnCarrito = this.enElCarrito(cerveza);

    if (!cervezaEnCarrito) {
      this.carrito.push({ ...cerveza, cantidad: 1 });
    } else {
      cervezaEnCarrito.cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }
  quitar(id) {
    const indice = this.carrito.findIndex((cerveza) => cerveza.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    this.listar();
  }
  vaciar() {
    this.total = 0;
    this.cantidadCervezas = 0;
    this.carrito = [];
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar() {
    this.total = 0;
    this.cantidadCervezas = 0;

    divCarrito.innerHTML = "";

    for (const cerveza of this.carrito) {
      divCarrito.innerHTML += `
        <div class="cervezaCarrito">
          <h2>${cerveza.nombre}</h2>
          <img src="images/${cerveza.imagen}" width=150px/>
          <p>$${cerveza.precio}</p>
          <p>Cantidad: ${cerveza.cantidad}</p>
          <button class="btnQuitar""btn btn-danger" data-id="${cerveza.id}">Quitar del carrito</button>
        </div>
      `;
      this.total += cerveza.precio * cerveza.cantidad;
      this.cantidadCervezas += cerveza.cantidad;
    }

    const btnsQuitar = document.querySelectorAll(".btnQuitar");

    for (const boton of btnsQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idCerveza = +boton.dataset.id;
        this.quitar(idCerveza);
      });
    }
    spanCantidadCervezas.innerHTML = this.cantidadCervezas;
    spanTotalCarrito.innerText = this.total;
  }
}

const ctlg = new Catalogo();

const spanCantidadCervezas = document.querySelector("#cantidadCervezas");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divCervezas = document.querySelector("#cervezas");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#botonComprar");

const carrito = new Carrito();

cargarProductos(ctlg.cervezas);

function cargarProductos(cervezas) {
  divCervezas.innerHTML = "";

  for (const cerveza of cervezas) {
    divCervezas.innerHTML += `
    <div class="cerveza">
    <h2>${cerveza.nombre}</h2>
    <p class="precio">${cerveza.precio}</p>
    <div class="imagen">
      <img src="images/${cerveza.imagen}" width=150px />
    </div>
    <a href="#" class="btnAgregar"btn btn-primary data-id="${cerveza.id}">Agregar al Carrito</a>
    </div>
    `;
  }

  const btnsAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of btnsAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idCerveza = +boton.dataset.id;
      const cerveza = ctlg.productoPorId(idCerveza);
      carrito.agregar(cerveza);
      Toastify({
        text: `Se ha agregado ${cerveza.nombre} al carrito`,
        gravity: "bottom",
        position: "center",
        style: {
          background: "5f5d8d",
        },
      }).showToast();
    });
  }
}

inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const cervezas = ctlg.productosPorNombre(palabra);
  cargarProductos(cervezas);
});

botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});

botonComprar.addEventListener("click", (event) => {
  event.preventDefault();
  carrito.vaciar();
  Swal.fire({
    title: "Felicidades",
    text: "Gracias por tu compra!",
    imageUrl: "./images/logo-transparente.png",
    imageWidth: 400,
    imageHeight: 300,
    imageAlt: "Img",
  });
});
