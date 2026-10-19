
let pedidos = [];

const formPedido = document.querySelector("#idFormPedido");
const inputProducto = document.querySelector("#idProducto");
const inputPrecio = document.querySelector("#idPrecio");
const inputCantidad = document.querySelector("#idCantidad");
const inputPrecioMaximo = document.querySelector("#idPrecioMaximo");

const btnAgregar = document.querySelector("#idBtnAgregar");
const btnFiltrar = document.querySelector("#idBtnFiltrar");
const btnMostrarTodos = document.querySelector("#idBtnMostrarTodos");
const btnLimpiar = document.querySelector("#idBtnLimpiar");

const tablaBody = document.querySelector("#idTablaPedidosBody");
const spanTotalUnidades = document.querySelector("#idTotalUnidades");
const spanMontoTotal = document.querySelector("#idMontoTotal");
const divAlerta = document.querySelector("#idAlerta");

function validarDatosPedido(producto, precioTexto, cantidadTexto) {
    const nombreLimpio = producto.trim();
    const precio = Number(precioTexto);
    const cantidad = Number(cantidadTexto);

    if (nombreLimpio === "") {
        return {
            esValido: false,
            mensaje: "El nombre del producto es obligatorio y no puede estar vacío."
        };
    }

    if (precioTexto.trim() === "" || isNaN(precio) || precio <= 0) {
        return {
            esValido: false,
            mensaje: "El precio unitario debe ser un número válido mayor a cero."
        };
    }

    if (
        cantidadTexto.trim() === "" ||
        isNaN(cantidad) ||
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        return {
            esValido: false,
            mensaje: "La cantidad solicitada debe ser un número entero positivo."
        };
    }

    return {
        esValido: true,
        datos: {
            producto: nombreLimpio,
            precio: precio,
            cantidad: cantidad
        }
    };
}


function registrarPedidoEnArreglo(producto, precio, cantidad) {
    const nuevoPedido = {
        producto: producto,
        precio: precio,
        cantidad: cantidad
    };
    pedidos.push(nuevoPedido);
}


function obtenerPedidosConSubtotal(listaPedidos) {
    return listaPedidos.map(pedido => ({
        ...pedido,
        subtotal: pedido.precio * pedido.cantidad
    }));
}


function calcularIndicadoresTotales(listaPedidos) {
    const totalUnidades = listaPedidos.reduce(
        (acumulador, pedido) => acumulador + pedido.cantidad,
        0
    );

    const montoTotal = listaPedidos.reduce(
        (acumulador, pedido) => acumulador + (pedido.precio * pedido.cantidad),
        0
    );

    return {
        totalUnidades,
        montoTotal
    };
}


function filtrarPedidosPorPrecioMaximo(listaPedidos, precioMaximo) {
    return listaPedidos.filter(pedido => pedido.precio <= precioMaximo);
}

function vaciarArregloPedidos() {
    pedidos = [];
}


function mostrarAlerta(mensaje) {
    divAlerta.textContent = mensaje;
    divAlerta.classList.remove("d-none");
}

function ocultarAlerta() {
    divAlerta.textContent = "";
    divAlerta.classList.add("d-none");
}


function actualizarTablaHTML(listaPedidos) {
    if (listaPedidos.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    No hay pedidos para mostrar.
                </td>
            </tr>
        `;
        return;
    }

    const pedidosConSubtotal = obtenerPedidosConSubtotal(listaPedidos);

    const filasHTML = pedidosConSubtotal
        .map(
            item => `
            <tr>
                <td>${item.producto}</td>
                <td class="text-end">$${item.precio.toFixed(2)}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-end fw-bold">$${item.subtotal.toFixed(2)}</td>
            </tr>
        `
        )
        .join("");

    tablaBody.innerHTML = filasHTML;
}

function actualizarIndicadoresHTML(listaPedidos) {
    const { totalUnidades, montoTotal } = calcularIndicadoresTotales(listaPedidos);
    spanTotalUnidades.textContent = totalUnidades;
    spanMontoTotal.textContent = `$${montoTotal.toFixed(2)}`;
}


function actualizarVistaCompleta(listaParaTabla = pedidos) {
    actualizarTablaHTML(listaParaTabla);
    actualizarIndicadoresHTML(pedidos);
}


function manejarAgregarPedido(evento) {
    evento.preventDefault();
    ocultarAlerta();

    const validacion = validarDatosPedido(
        inputProducto.value,
        inputPrecio.value,
        inputCantidad.value
    );

    if (!validacion.esValido) {
        mostrarAlerta(validacion.mensaje);
        return;
    }

    const { producto, precio, cantidad } = validacion.datos;
    registrarPedidoEnArreglo(producto, precio, cantidad);

    formPedido.reset();
    inputProducto.focus();

    actualizarVistaCompleta(pedidos);
}

function manejarFiltrarProductos() {
    ocultarAlerta();
    const valorMaximoTexto = inputPrecioMaximo.value.trim();
    const precioMaximo = Number(valorMaximoTexto);

    if (valorMaximoTexto === "" || isNaN(precioMaximo) || precioMaximo <= 0) {
        mostrarAlerta("Por favor, ingrese un precio máximo válido mayor a cero para filtrar.");
        return;
    }

    const pedidosFiltrados = filtrarPedidosPorPrecioMaximo(pedidos, precioMaximo);
    actualizarTablaHTML(pedidosFiltrados);
}

function manejarMostrarTodos() {
    ocultarAlerta();
    inputPrecioMaximo.value = "";
    actualizarTablaHTML(pedidos);
}

function manejarLimpiarPedidos() {
    ocultarAlerta();
    inputPrecioMaximo.value = "";
    vaciarArregloPedidos();
    actualizarVistaCompleta(pedidos);
}

formPedido.addEventListener("submit", manejarAgregarPedido);
btnFiltrar.addEventListener("click", manejarFiltrarProductos);
btnMostrarTodos.addEventListener("click", manejarMostrarTodos);
btnLimpiar.addEventListener("click", manejarLimpiarPedidos);

actualizarVistaCompleta(pedidos);
