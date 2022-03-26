// Selectores
const formularioSelector = document.querySelector('#formulario')
const correoSelector = document.querySelector('#correo')
const passwordSelector = document.querySelector('#password')
const crearFeedSelector = document.querySelector('#crear-feed')
const btnSalirSelector = document.querySelector('#btn-salir')
const btnSigPaginaSelector = document.querySelector('#boton-sig-pagina')

btnSalirSelector.addEventListener("click", () => {
    localStorage.removeItem('jwt-token')
    location.reload()
})
// Evento submit
formulario.addEventListener("submit", async (event) => {
    event.preventDefault()
    const postData = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/login",
                {
                    method: 'POST', // crear el token 
                    body: JSON.stringify({ email: correoSelector.value, password: passwordSelector.value }),
                })
            const { token } = await response.json()
            localStorage.setItem('jwt-token', token)
            return token
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }

    await postData()
    const getFotos = async (pagina) => {
        try {
            const response = await fetch(`http://localhost:3000/api/photos?page=${pagina}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                })
            const { data } = await response.json()
            return data
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }
    const datos = await getFotos()
    console.log(datos)

    // Se ejecuta la función de ocultar y mostrar
    toggleFormAndFotos('form-ocultar', 'feed-mostrar')

    const mostrarDatos = (datos) => {
        console.log(datos)
        const crearPosts = ''
        for (let i = 0; i < datos.length; i++) {
            crearFeedSelector.innerHTML += `
            <div class="card mb-3">
                <img src="${datos[i].download_url}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${datos[i].author}</h5>
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                </div>  
            </div>
            `
        }
        return crearPosts
    }
    mostrarDatos(datos)
    let pagina = 1

    btnSigPaginaSelector.addEventListener("click", async () => {
        pagina++
        const cargarPagina = await getFotos(pagina)
        mostrarDatos(cargarPagina)
    })
})
const toggleFormAndFotos = (form, fotos) => { // ocultar - mostrar
    $(`#${form}`).toggle()
    $(`#${fotos}`).toggle()
}


