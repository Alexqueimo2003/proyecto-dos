document.getElementById('registroForm').addEventListener('submit', function(event) {
  // Detiene el envío del formulario para que Js valide primero
  event.preventDefault();


  const errorNombre = document.getElementById('errorNombre');
  const errorApellido = document.getElementById('errorApellido');
  const errorPassword = document.getElementById('errorPassword');

  errorNombre.classList.add('hidden');
  errorApellido.classList.add('hidden');
  errorPassword.classList.add('hidden');

  // se obtiene el valor de las entradas de datos del usuario
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  //se pasa todo a minuscula
  const email = document.getElementById('email').value.trim().toLowerCase(); 
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;

 
  let formularioValido = true;

  // expresionesregulares Solo letras (A-Z, a-z), ñ, Ñ, acentos y espacios( nombre y apellido)
  const regexNombreApellido = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]{8,}$/;

  // Validar Nombre
  if (!regexNombreApellido.test(nombre)) {
    errorNombre.textContent = 'El nombre solo debe contener letras';
    errorNombre.classList.remove('hidden'); 
    formularioValido = false;
  }

  // Validar Apellido
  if (!regexNombreApellido.test(apellido)) {
    errorApellido.textContent = 'El apellido solo debe contener letras';
    errorApellido.classList.remove('hidden'); 
    formularioValido = false;
  }

  // Validar Fortaleza de la Contraseña
  if (!regexPassword.test(password)) {
    errorPassword.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
    errorPassword.classList.remove('hidden');
    formularioValido = false;
  } 

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    errorPassword.textContent = 'Las contraseñas no coinciden. Por favor, verifícalas.';
    errorPassword.classList.remove('hidden'); 
    formularioValido = false;
  }

 
  if (!formularioValido) {
    return;
  }

  //Guardar los registros//

  // Obtener la lista actual de usuarios de LocalStorage //
  let usuariosLista = JSON.parse(localStorage.getItem('usuariosLista')) || [];

  //Verifica si el correo ya existe en la lista
  const correoExiste = usuariosLista.some(user => user.email === email);
  if (correoExiste) {
    errorPassword.textContent = 'Este correo electrónico ya se encuentra registrado.';
    errorPassword.classList.remove('hidden');
    return; 
  }

  // Crear el nuevo usuario
  const nuevoUsuario = {
    nombre: nombre,
    apellido: apellido,
    email: email,
    password: password
  };

  //  guardar en LocalStorage en formato de texto
  usuariosLista.push(nuevoUsuario);
  localStorage.setItem('usuariosLista', JSON.stringify(usuariosLista));

  // redireccionar
  alert('¡Registro exitoso! Redirigiendo al inicio de sesión...');
  window.location.href = 'login.html'; 
});



