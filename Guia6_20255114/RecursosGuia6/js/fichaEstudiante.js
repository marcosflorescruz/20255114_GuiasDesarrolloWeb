// Referencias a los elementos del formulario
const inputCarnet = document.getElementById("idTxtCarnet");
const inputNombreCompleto = document.getElementById("idTxtNombreCompleto");
const inputDui = document.getElementById("idTxtDui");
const inputNit = document.getElementById("idTxtNit");
const inputFechaNac = document.getElementById("idTxtFechaNac");
const inputCorreo = document.getElementById("idTxtCorreo");
const inputEdad = document.getElementById("idTxtEdad");

const btnValidar = document.getElementById("idBtnValidar");
const btnLimpiar = document.getElementById("idBtnLimpiarFicha");
const divResultado = document.getElementById("idResultadoFicha");

// Diccionario de Expresiones Regulares (Actividad 3)
const regexValidaciones = {
    // Dos letras y tres números (Ej: AB001)
    carnet: /^[A-Za-z]{2}\d{3}$/,
    // Solo letras (incluyendo tildes y ñ) y espacios, sin números ni caracteres especiales
    nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/,
    // Formato ########-#
    dui: /^\d{8}-\d{1}$/,
    // Formato ####-######-###-#
    nit: /^\d{4}-\d{6}-\d{3}-\d{1}$/,
    // Formato día, mes y año (dd/mm/aaaa o dd-mm-aaaa) con validación de calendario
    fecha: /^(0[1-9]|[12]\d|3[01])[\/\-](0[1-9]|1[0-2])[\/\-](19\d{2}|20\d{2})$/,
    // Correo electrónico estándar
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Solo números enteros positivos
    edad: /^\d+$/
};

// Función que aplica las clases visuales de Bootstrap (is-valid / is-invalid)
const evaluarCampo = (input, expresion) => {
    const valor = input.value.trim();
    const esValido = expresion.test(valor);

    if (esValido) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
    return esValido;
};

// Función principal para validar toda la ficha
const validarFichaEstudiante = () => {
    const vCarnet = evaluarCampo(inputCarnet, regexValidaciones.carnet);
    const vNombre = evaluarCampo(inputNombreCompleto, regexValidaciones.nombre);
    const vDui = evaluarCampo(inputDui, regexValidaciones.dui);
    const vNit = evaluarCampo(inputNit, regexValidaciones.nit);
    const vFecha = evaluarCampo(inputFechaNac, regexValidaciones.fecha);
    const vCorreo = evaluarCampo(inputCorreo, regexValidaciones.correo);
    const vEdad = evaluarCampo(inputEdad, regexValidaciones.edad);

    if (vCarnet && vNombre && vDui && vNit && vFecha && vCorreo && vEdad) {
        divResultado.innerHTML = `
            <div class="alert alert-success mb-0">
                <h5 class="alert-heading fw-bold">¡Ficha validada correctamente!</h5>
                <hr>
                <p class="mb-1"><strong>Carnet:</strong> ${inputCarnet.value.trim().toUpperCase()}</p>
                <p class="mb-1"><strong>Nombre completo:</strong> ${inputNombreCompleto.value.trim()}</p>
                <p class="mb-1"><strong>DUI:</strong> ${inputDui.value.trim()}</p>
                <p class="mb-1"><strong>NIT:</strong> ${inputNit.value.trim()}</p>
                <p class="mb-1"><strong>Fecha de nacimiento:</strong> ${inputFechaNac.value.trim()}</p>
                <p class="mb-1"><strong>Correo electrónico:</strong> ${inputCorreo.value.trim()}</p>
                <p class="mb-0"><strong>Edad:</strong> ${inputEdad.value.trim()} años</p>
            </div>
        `;
    } else {
        divResultado.innerHTML = `
            <div class="alert alert-danger mb-0">
                Existen campos con formato incorrecto. Revise los mensajes en rojo debajo de cada campo.
            </div>
        `;
    }
};

const limpiarFicha = () => {
    const inputs = [
        inputCarnet,
        inputNombreCompleto,
        inputDui,
        inputNit,
        inputFechaNac,
        inputCorreo,
        inputEdad
    ];
    inputs.forEach((input) => {
        input.value = "";
        input.classList.remove("is-valid", "is-invalid");
    });
    divResultado.innerHTML = "Ningún estudiante validado aún.";
    inputCarnet.focus();
};

// Eventos con addEventListener
btnValidar.addEventListener("click", validarFichaEstudiante);
btnLimpiar.addEventListener("click", limpiarFicha);