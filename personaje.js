document.addEventListener("DOMContentLoaded", () => {
        
  // informacion del usuario activo
  const datosCrudos = localStorage.getItem('usuarioLogeado') || localStorage.getItem('usuarioLogueado');
  const txtBienvenida = document.getElementById('bienvenidaUsuario');
  
  if (txtBienvenida) {
    if (datosCrudos) {
      try {
        const infoUsuario = JSON.parse(datosCrudos);
        const nombreMostrar = infoUsuario.nombre || infoUsuario.username || infoUsuario.user || "Agente";
        txtBienvenida.innerHTML = `Usuario: <span class="text-orange-600 font-bold">${nombreMostrar}</span>`;
      } catch(e) {
        txtBienvenida.innerHTML = `Usuario: <span class="text-orange-600 font-bold">${datosCrudos}</span>`;
      }
    } else {
      txtBienvenida.innerHTML = `Usuario: <span class="text-orange-600 font-bold">Viajero</span>`;
    }
  }

  // cierra sesion
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      localStorage.removeItem('sesionActiva');
      localStorage.removeItem('usuarioLogeado');
      localStorage.removeItem('usuarioLogueado');
      window.location.href = 'login.html';
    });
  }

  // obtencion del Id del personaje de la API
  const contenedor = document.getElementById("detallePersonaje");
  const parametrosUrl = window.location.search;
  const parametros = new URLSearchParams(parametrosUrl);
  const idValor = parametros.get("id");

  if (!idValor) {
    if (contenedor) {
      contenedor.innerHTML = "<h1 class='text-center text-red-500 font-bold'>Oops, no se especificó ningún personaje</h1>";
    }
    return;
  }

  /**
 * @function obtenerInformacion
 * @description funcion asincrona para ller los datos de la API 
 * @param {id}  id del personaje de la API
 * @returns {}   retorna los datos de la API
 * @author APA
*/
  async function obtenerInformacion(id) {
    try {
      let personaje = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`
      ).then((data) => data.json());

      if (personaje.error) {
        contenedor.innerHTML = "<h1 class='text-center text-red-500 font-bold'>Oops, no se encontró ningún personaje</h1>";
      } else {
        const numeroEpisodios = personaje.episode.length;

        let estadoTraducido = "Desconocido ❓";
        if (personaje.status === 'Alive') estadoTraducido = "Vivo ";
        if (personaje.status === 'Dead') estadoTraducido = "Muerto ";

        contenedor.innerHTML = `
          <div class="flex flex-col gap-4">
            <img src="${personaje.image}" alt="${personaje.name}" class="w-full rounded-xl shadow-sm border border-gray-100">
            <h1 class="text-3xl font-bold text-center text-orange-600 leading-tight mt-2">${personaje.name}</h1>
            
            <hr class="border-gray-200 my-2">

            <p class="text-lg"><strong class="font-semibold text-gray-700">Estado:</strong> ${estadoTraducido}</p>
            <p class="text-lg"><strong class="font-semibold text-gray-700">Especie:</strong> ${personaje.species}</p>
            <p class="text-lg"><strong class="font-semibold text-gray-700">Género:</strong> ${personaje.gender}</p>
            <p class="text-lg"><strong class="font-semibold text-gray-700">Origen:</strong> ${personaje.origin.name}</p>
            <p class="text-lg"><strong class="font-semibold text-gray-700">Ubicación actual:</strong> ${personaje.location.name}</p>
            <p class="text-lg"><strong class="font-semibold text-gray-700">Apariciones:</strong> En ${numeroEpisodios} episodio(s)</p>

            <button id="btn-favorito" class="w-full mt-4 py-2.5 px-4 text-white font-bold rounded-xl transition duration-200 cursor-pointer">
              Cargando favoritos...
            </button>
          </div>
        `;

        // favoritos
        const botonFav = document.getElementById("btn-favorito");
        let favoritos = JSON.parse(localStorage.getItem("personajesFavoritos")) || [];

        function actualizarBoton() {
          const esFavorito = favoritos.includes(id);
          if (esFavorito) {
            botonFav.innerText = "Quitar de Favoritos ";
            botonFav.className = "w-full mt-4 py-2.5 px-4 bg-red-400 hover:bg-red-300 text-white font-bold rounded-xl transition duration-200 cursor-pointer";
          } else {
            botonFav.innerText = "Agregar a Favoritos ";
            //botonFav.className = "w-full mt-4 py-2.5 px-4 bg-orange-700 hover:bg-orange-500 text-white font-bold rounded-xl transition duration-200 cursor-pointer";
            botonFav.className = "btn-favorito w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm font-medium py-2 px-4 rounded transition duration-200 cursor-pointer ";
          }
        }

        actualizarBoton();

        botonFav.addEventListener("click", () => {
          if (favoritos.includes(id)) {
            favoritos = favoritos.filter(favId => favId !== id);
          } else {
            favoritos.push(id);
          }
          localStorage.setItem("personajesFavoritos", JSON.stringify(favoritos));
          actualizarBoton();
        });
      }
    } catch (error) {
      contenedor.innerHTML = "<h1 class='text-center text-red-500'>Ops, hubo un error al abrir el portal</h1>";
      console.log(error.message);
    }
  }

  // Ejecuta la consulta del personaje
  obtenerInformacion(idValor);
});