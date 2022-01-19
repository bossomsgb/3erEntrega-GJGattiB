let carritoDeCompras = []
let stockProductos=[]

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonTerminar = document.getElementById('terminar')
const finCompra = document.getElementById('fin-compra')
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

const selecModelo = document.getElementById('selecModelo')

selecModelo.addEventListener('change',()=>{
    console.log(selecModelo.value)
    if(selecModelo.value == 'all'){
        mostrarProductos(stockProductos)
    }else{
        mostrarProductos(stockProductos.filter(el => el.Modelo == selecModelo.value))
        console.log(stockProductos.filter(el => el.Modelo == selecModelo.value))
    }
})

 //Ajax
 $.getJSON('data/stock.json', function(data){
    data.forEach(elemento => {
        stockProductos.push(elemento)
    })
    
    mostrarProductos(stockProductos)
    recuperar()
    
})

//Funcion que muestra los productos (valga la redundancia)

function mostrarProductos(array){
        $('#contenedor-productos').empty();
        for(const productos of array){
            let div = document.createElement('div')
            div.classList.add('producto')
            div.innerHTML += `
            <div class="card">
                <div class="card-image">
                    <img src=${productos.img}>
                    <span class="card-title">${productos.nombre}</span>
                    <a id="boton${productos.id}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add_shopping_cart</i></a>
                </div>
                <div class="card-content">
                    <p>${productos.Modelo}</p>
                    <p>$${productos.precio}</p>
                </div>
            </div>
        `
        contenedorProductos.appendChild(div)

        let botonAgregar = document.getElementById(`boton${productos.id}`)

        botonAgregar.addEventListener('click', ()=>{
            agregarAlCarrito(productos.id)

        })
    }  
}
//Iniciar compra

function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);
    if(repetido){
        console.log(repetido);
        repetido.cantidad = repetido.cantidad + 1;
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);

        carritoDeCompras.push(productoAgregar);
       
        actualizarCarrito()
        mostarCarrito(productoAgregar)
    }

     localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
}

function mostarCarrito(productoAgregar) {
    let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `<p>${productoAgregar.nombre}</p>
                        <p>${productoAgregar.tipo}<p>
                        <p>Precio: ${productoAgregar.precio}</p>
                        <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                        <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
        
   
        let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

        botonEliminar.addEventListener('click', ()=>{
            if(productoAgregar.cantidad > 1){
                productoAgregar.cantidad = productoAgregar.cantidad - 1
                document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>`
                localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
                actualizarCarrito()
            }else{
              botonEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
            localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
            actualizarCarrito()  
            }
            
        }) 
    }


function recuperar() {
    let recuperar = JSON.parse(localStorage.getItem('carrito'))
    if(recuperar){
        recuperar.forEach(el => {
            carritoDeCompras.push(el)
            mostarCarrito(el)
            actualizarCarrito()
        });
    }
}

function  actualizarCarrito (){
    console.log(carritoDeCompras.length);
    if(carritoDeCompras.length > 0){
        document.getElementById('finalizar').style.display= 'inline-block'
        document.getElementById('pagar').innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    }else{
        document.getElementById('finalizar').style.display= 'none'
    }
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    
}



//Finaliza compra!

botonTerminar.innerHTML= '<a id="finalizar" class="waves-effect waves-light btn modal-trigger" href="#modal1">Checkout</a>'


$(()=>{
    $('.modal-trigger').leanModal();
  });

finCompra.addEventListener('click',()=>{

    if($('.number').val()== '' || $('.inputname').val() == ''||$('.expire').val()== ''||$('.ccv').val()== ''){
       
        $('input').css('border', 'solid 1px red')

    }else if(($('.number').val()!= '') && ($('.inputname').val()!= '') && ($('.expire').val() != '') && ($('.ccv').val()!= '')){

        $('input').css('border', 'none')

       $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras),function(respuesta,estado) {
        console.log(respuesta)
        console.log(estado)
        if(estado){
            $('#modal1').closeModal();
            contenedorCarrito.innerHTML= `<h6>Su pedido ha sido procesado orden N°: 53955t2nioiojg234f</h6>`;
            carritoDeCompras= []
            localStorage.clear()
            actualizarCarrito()
            setTimeout(() => {
                contenedorCarrito.innerHTML=''
                actualizarCarrito()
            }, 3000);
        }
      }) 
    }

    
})
