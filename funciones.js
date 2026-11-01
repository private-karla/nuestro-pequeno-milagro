
/* INVITACIÓN KARLA Y ALE */

// BOTÓN PARA DESCUBRIR NUESTRA HISTORIA

const botonHistoria =
    document.getElementById("botonSorpresa");

const seccionHistoria =
    document.getElementById("nuestra-historia");

if (botonHistoria && seccionHistoria) {

    botonHistoria.addEventListener("click", () => {

        const reducido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        seccionHistoria.scrollIntoView({
            behavior: reducido ? "auto" : "smooth"
        });

    });

}


// NUEVO SOBRE INTERACTIVO

const pantalla =
    document.getElementById("pantalla-bienvenida");

const sobre =
    document.getElementById("sobrenuevo-abrir");

const portada =
    document.querySelector(".portada");


if (pantalla && sobre && portada) {

    sobre.addEventListener("click", () => {

        if (sobre.disabled) return;

        sobre.disabled = true;

        sobre.setAttribute("aria-expanded", "true");

        function mostrarPortada() {

           
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });


            pantalla.classList.add("oculta");

            portada.classList.add("mostrando");

            const titulo = portada.querySelector("h1");

            if (titulo) {
                titulo.setAttribute("tabindex", "-1");

                titulo.focus({
                    preventScroll: true
                });
            }
        }

        const reducido = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducido) {
            sobre.classList.add(
                "abriendo",
                "mostrando-carta"
            );

            setTimeout(mostrarPortada, 300);
            return;
        }

        // Primero se abre la solapa
        sobre.classList.add("abriendo");

        // Después sale la tarjeta
        setTimeout(() => {
            sobre.classList.add("mostrando-carta");
        }, 780);

        // Finalmente aparece la portada
        setTimeout(mostrarPortada, 3000);

    });

}


// EVITAR QUE DOS CANCIONES SUENEN JUNTAS

const audios = document.querySelectorAll("audio");

audios.forEach(actual => {

    actual.addEventListener("play", () => {

        audios.forEach(otro => {

            if (otro !== actual) {
                otro.pause();
            }

        });

    });

});


// =======================================
// MÚSICA AMBIENTAL DE LA INVITACIÓN
// =======================================

(() => {

    const musicaFondo =
        document.getElementById("musica-fondo");

    const botonMusica =
        document.getElementById("boton-musica");

    const sobreInvitacion =
        document.getElementById("sobrenuevo-abrir");

    if (!musicaFondo || !botonMusica) return;

    // Volumen inicial al 35%
    musicaFondo.volume = 0.35;

    // Actualizar el botón
    function actualizarBoton() {

        const reproduciendo = !musicaFondo.paused;

        botonMusica.textContent = reproduciendo
            ? "♫ Pausar música"
            : "♫ Activar música";

        botonMusica.setAttribute(
            "aria-pressed",
            String(reproduciendo)
        );

        botonMusica.setAttribute(
            "aria-label",
            reproduciendo
                ? "Pausar música de fondo"
                : "Activar música de fondo"
        );
    }

    // Intentar reproducir
    function reproducirMusica() {

        const intento = musicaFondo.play();

        if (intento && typeof intento.catch === "function") {
            intento.catch(() => {
                actualizarBoton();
            });
        }
    }

    // Iniciar al tocar el sobre
    if (sobreInvitacion) {

        sobreInvitacion.addEventListener(
            "click",
            () => {

                botonMusica.classList.add("visible");

                reproducirMusica();

            },
            {
                once: true,
                capture: true
            }
        );

    } else {
        botonMusica.classList.add("visible");
    }

    // Control manual del botón
    botonMusica.addEventListener("click", () => {

        if (musicaFondo.paused) {

            reproducirMusica();

        } else {

            musicaFondo.pause();

        }

    });

    // Mantener actualizado el estado
    musicaFondo.addEventListener(
        "play",
        actualizarBoton
    );

    musicaFondo.addEventListener(
        "pause",
        actualizarBoton
    );

    actualizarBoton();

})();


// ======================================
// CUENTA REGRESIVA - NUESTRA REVELACIÓN
// ======================================

(() => {

    const seccion = document.getElementById(
        "nuestra-revelacion"
    );

    if (!seccion) return;

    const fechaTexto =
        seccion.dataset.fecha?.trim();

    const diaElemento =
        document.getElementById("revelacion-dia");

    const horaElemento =
        document.getElementById("revelacion-hora");

    const estado =
        document.getElementById("revelacion-estado");

    const reloj = {
        dias: document.getElementById("revelacion-dias"),
        horas: document.getElementById("revelacion-horas"),
        minutos: document.getElementById("revelacion-minutos"),
        segundos: document.getElementById("revelacion-segundos")
    };

    // Si aún no tenemos fecha, conservar
    // el mensaje "Por confirmar".
    if (!fechaTexto) return;

    const fechaEvento = new Date(fechaTexto);

    if (Number.isNaN(fechaEvento.getTime())) {
        console.warn("Fecha de revelación inválida");
        return;
    }

    // Mostrar fecha y hora de Ciudad de México
    const formatoFecha = new Intl.DateTimeFormat(
        "es-MX",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Mexico_City"
        }
    );

    const formatoHora = new Intl.DateTimeFormat(
        "es-MX",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "America/Mexico_City"
        }
    );

    if (diaElemento) {
    diaElemento.textContent =
        formatoFecha.format(fechaEvento);
}

if (horaElemento) {
    horaElemento.textContent =
        formatoHora.format(fechaEvento);
}

    function actualizarCuenta() {

        const diferencia =
            fechaEvento.getTime() - Date.now();

        if (diferencia <= 0) {

            reloj.dias.textContent = "00";
            reloj.horas.textContent = "00";
            reloj.minutos.textContent = "00";
            reloj.segundos.textContent = "00";

            estado.textContent =
                "¡Llegó nuestro gran día! ♡";

            return false;
        }

        const totalSegundos =
            Math.floor(diferencia / 1000);

        const dias =
            Math.floor(totalSegundos / 86400);

        const horas =
            Math.floor((totalSegundos % 86400) / 3600);

        const minutos =
            Math.floor((totalSegundos % 3600) / 60);

        const segundos = totalSegundos % 60;

        reloj.dias.textContent = String(dias);

        reloj.horas.textContent =
            String(horas).padStart(2, "0");

        reloj.minutos.textContent =
            String(minutos).padStart(2, "0");

        reloj.segundos.textContent =
            String(segundos).padStart(2, "0");

        return true;
    }

    estado.textContent =
        "La emoción crece cada segundo ♡";

    if (actualizarCuenta()) {

        const intervalo = setInterval(() => {

            if (!actualizarCuenta()) {
                clearInterval(intervalo);
            }

        }, 1000);
    }

})();


// ======================================
// CONFIRMACIÓN POR WHATSAPP
// ======================================

(() => {

    // CAMBIA ESTE VALOR POR TU NÚMERO
    // México: 52 + 10 dígitos del celular
    // Ejemplo de formato: 525512345678

    const telefonoWhatsApp = "525524334716";

    const formulario =
        document.getElementById("formulario-rsvp");

    if (!formulario) return;

    const nombre =
        document.getElementById("rsvp-nombre");

    const respuesta =
        document.getElementById("rsvp-respuesta");

    const campoPersonas =
        document.getElementById("rsvp-campo-personas");

    const personas =
        document.getElementById("rsvp-personas");

    const aviso =
        document.getElementById("rsvp-aviso");

    // Mostrar cantidad de personas solo
    // cuando la respuesta es SÍ.

    respuesta.addEventListener("change", () => {

        const asistira = respuesta.value === "si";

        campoPersonas.hidden = !asistira;
        personas.disabled = !asistira;
        personas.required = asistira;

        aviso.textContent = "";

    });

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        const nombreInvitado = nombre.value.trim();

        const asistira = respuesta.value === "si";

        const cantidad = Number(personas.value);

        if (!nombreInvitado) {
            aviso.textContent =
                "Por favor, escribe tu nombre.";
            return;
        }

        if (asistira && (!Number.isInteger(cantidad) || cantidad < 1)) {
            aviso.textContent =
                "Indica cuántas personas asistirán.";
            return;
        }

        // Comprobar que el número esté configurado

        if (!/^\d{11,15}$/.test(telefonoWhatsApp)) {

            aviso.textContent =
                "Falta configurar el número de WhatsApp.";

            return;
        }

        let mensaje = "";

        if (asistira) {

            mensaje =
                `¡Hola, Karla y Ale! 🩷🩵\n\n` +
                `Soy ${nombreInvitado}.\n\n` +
                `¡Confirmo mi asistencia a su revelación! 🎀\n\n` +
                `📅 29 de noviembre de 2026\n` +
                `🕒 3:00 p. m.\n` +
                `👥 Asistiremos ${cantidad} ` +
                `${cantidad === 1 ? "persona" : "personas"} ` +
                `en total.\n\n` +
                `¡Gracias por invitarnos a este ` +
                `momento tan especial! ♡`;

        } else {

            mensaje =
                `¡Hola, Karla y Ale! 🩷🩵\n\n` +
                `Soy ${nombreInvitado}.\n\n` +
                `Muchas gracias por invitarme ` +
                `a su revelación del 29 de noviembre.\n\n` +
                `Lamentablemente no podré asistir, ` +
                `pero les deseo un día maravilloso ` +
                `y lleno de alegría. ♡`;
        }

        // Crear enlace con mensaje preparado

        const enlace =
            `https://wa.me/${telefonoWhatsApp}` +
            `?text=${encodeURIComponent(mensaje)}`;

        // Abrir WhatsApp
        window.location.href = enlace;

    });

})();

