//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

// --- ACTIVIDAD 1 Y 2: Arreglo global con persistencia en LocalStorage y control de edición ---
let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];
let indiceEdicion = -1; // -1 indica modo "Agregar", >= 0 indica el índice que se está editando

const guardarEnLocalStorage = () => {
    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};

/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/
const limpiarForm = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";

    // Restaurar estado de edición al limpiar
    indiceEdicion = -1;
    buttonAgregarPaciente.innerHTML = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;

    inputNombre.focus();
};

/*
Funcion para validar el ingreso o actualización del paciente
*/
const addPaciente = function () {
    let nombre = inputNombre.value.trim();
    let apellido = inputApellido.value.trim();
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo =
        inputRdMasculino.checked == true
            ? "Hombre"
            : inputRdFemenino.checked == true
            ? "Mujer"
            : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
    let direccion = inputDireccion.value.trim();

    if (
        nombre != "" &&
        apellido != "" &&
        fechaNacimiento != "" &&
        sexo != "" &&
        pais != 0 &&
        direccion != ""
    ) {
        const datosPaciente = new Array(
            nombre,
            apellido,
            fechaNacimiento,
            sexo,
            labelPais,
            direccion
        );

        if (indiceEdicion === -1) {
            // Modo Agregar nuevo paciente
            arrayPaciente.push(datosPaciente);
            mensaje.innerHTML = "Se ha registrado un nuevo paciente";
        } else {
            // ACTIVIDAD 1: Modo Editar paciente existente
            arrayPaciente[indiceEdicion] = datosPaciente;
            mensaje.innerHTML = "Se han actualizado los datos del paciente";
        }

        // ACTIVIDAD 2: Guardar cambios en LocalStorage
        guardarEnLocalStorage();

        //Llamando al componente de Bootstrap
        toast.show();

        //Limpiando formulario y actualizando tabla
        limpiarForm();
        imprimirPacientes();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
    let $fila = "";
    let contador = 1;

    arrayPaciente.forEach((element) => {
        $fila += `<tr>
                    <td scope="row" class="text-center fw-bold">${contador}</td>
                    <td>${element[0]}</td>
                    <td>${element[1]}</td>
                    <td>${element[2]}</td>
                    <td>${element[3]}</td>
                    <td>${element[4]}</td>
                    <td>${element[5]}</td>
                    <td class="text-center">
                        <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" alt="Editar" title="Editar paciente">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" alt="Eliminar" title="Eliminar paciente">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </td>
                </tr>`;
        contador++;
    });
    return $fila;
}

const imprimirPacientes = () => {
    const contenedorTabla = document.getElementById("idTablaPacientes");

    if (arrayPaciente.length === 0) {
        contenedorTabla.innerHTML = "Ninguno";
        return;
    }

    let $table = `<div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                        <tr>
                            <th scope="col" class="text-center" style="width:5%">#</th>
                            <th scope="col" class="text-center" style="width:15%">Nombre</th>
                            <th scope="col" class="text-center" style="width:15%">Apellido</th>
                            <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                            <th scope="col" class="text-center" style="width:10%">Sexo</th>
                            <th scope="col" class="text-center" style="width:10%">Pais</th>
                            <th scope="col" class="text-center" style="width:25%">Dirección</th>
                            <th scope="col" class="text-center" style="width:10%">Opciones</th>
                        </tr>
                        ${imprimirFilas()}
                    </table>
                </div>`;

    contenedorTabla.innerHTML = $table;

    // ACTIVIDAD 1: Asignar eventos a cada botón Editar y Eliminar generado en la tabla
    arrayPaciente.forEach((_, index) => {
        const contador = index + 1;
        const btnEditar = document.getElementById(`idBtnEditar${contador}`);
        const btnEliminar = document.getElementById(`idBtnEliminar${contador}`);

        btnEditar.addEventListener("click", () => editarPaciente(index));
        btnEliminar.addEventListener("click", () => eliminarPaciente(index));
    });
};

// ACTIVIDAD 1: Función para cargar los datos de un paciente en el formulario y editarlo
const editarPaciente = (index) => {
    const paciente = arrayPaciente[index];

    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];

    if (paciente[3] === "Hombre") {
        inputRdMasculino.checked = true;
        inputRdFemenino.checked = false;
    } else if (paciente[3] === "Mujer") {
        inputRdFemenino.checked = true;
        inputRdMasculino.checked = false;
    }

    // Buscar el país por su texto dentro del <select>
    let paisEncontrado = false;
    for (let i = 0; i < cmbPais.options.length; i++) {
        if (cmbPais.options[i].text === paciente[4]) {
            cmbPais.selectedIndex = i;
            paisEncontrado = true;
            break;
        }
    }
    // Si el país fue agregado dinámicamente en una sesión previa, lo recreamos en el select
    if (!paisEncontrado) {
        let option = document.createElement("option");
        option.textContent = paciente[4];
        option.value = cmbPais.children.length + 1;
        cmbPais.appendChild(option);
        cmbPais.value = option.value;
    }

    inputDireccion.value = paciente[5];

    // Activamos modo edición
    indiceEdicion = index;
    buttonAgregarPaciente.innerHTML = `<i class="bi bi-pencil-square"></i> Actualizar Datos`;
    inputNombre.focus();
};

// ACTIVIDAD 1 y 2: Función para eliminar un paciente del arreglo y actualizar LocalStorage
const eliminarPaciente = (index) => {
    arrayPaciente.splice(index, 1);
    guardarEnLocalStorage();

    // Si se estaba editando el paciente eliminado, limpiamos el formulario
    if (indiceEdicion === index) {
        limpiarForm();
    } else if (indiceEdicion > index) {
        indiceEdicion--;
    }

    imprimirPacientes();
    mensaje.innerHTML = "Paciente eliminado correctamente";
    toast.show();
};

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
    let paisNew = inputNombrePais.value.trim();

    if (paisNew != "") {
        // Creando nuevo option con la API DOM
        let option = document.createElement("option");
        option.textContent = paisNew;
        contadorGlobalOption = cmbPais.children.length;
        option.value = contadorGlobalOption + 1;

        //Agregando el nuevo option en el select
        cmbPais.appendChild(option);

        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Pais agregado correctamente";
        //Llamando al componente de Bootstrap
        toast.show();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
limpiarForm();
imprimirPacientes(); // Muestra los pacientes guardados en LocalStorage al abrir la página