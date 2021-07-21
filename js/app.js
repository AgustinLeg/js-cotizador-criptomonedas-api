const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda:'',
    criptomoneda:'',
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor)
});


document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();
})

function consultarCriptomonedas(){
    const api_key = 'dbdb2456e7502d4dddd9893ef8d2c7d79c6f6f964fbc9de82f058e23600b5f99'
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&apy_key=${api_key}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto =>{
        const {FullName,Name} = cripto.CoinInfo
        const option = document.createElement('option');
        option.value=Name;
        option.textContent=FullName;
        criptomonedasSelect.appendChild(option)
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}


function submitFormulario(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' | criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios')
        return;
    }
    consultarAPI()
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error')
    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        divMensaje.textContent=msg;
        formulario.appendChild(divMensaje)
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }

}


function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda;
    const api_key = 'dbdb2456e7502d4dddd9893ef8d2c7d79c6f6f964fbc9de82f058e23600b5f99'
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}&api_key=${api_key}`;
    mostrarSpinner();
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    const {PRICE, HIGHDAY,LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML=`El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML=`<p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>`
    const precioBajo = document.createElement('p')
    precioBajo.innerHTML=`<p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>`
    const ultimasHoras = document.createElement('p')
    ultimasHoras.innerHTML=`<p>Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR} %</span></p>`
    const ultimaActualizacion = document.createElement('p')
    ultimaActualizacion.innerHTML=`<p>Ultima actualizacion: <span>${LASTUPDATE}</span></p>`
    
    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML=`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `
    resultado.appendChild(spinner)
}