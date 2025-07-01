document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartItemsContainer = document.querySelector('.cart-items');

    const orderTypePopup = document.getElementById('order-type-popup');
    const deliveryAddressDisplay = document.querySelector('.delivery-address'); // El de la cabecera
    const closeOrderTypePopupBtn = orderTypePopup.querySelector('.close-popup-btn');
    const orderOptions = orderTypePopup.querySelectorAll('.order-option');

    let cartItemCount = 0; // Para el contador del carrito

    // --- Funcionalidad del Carrito ---

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartItemCount++;
            cartCount.textContent = cartItemCount;
            // Mostrar el pop-up del carrito cuando se agrega el primer item
            if (cartItemCount === 1) {
                cartPopup.classList.add('active');
                emptyCartMessage.style.display = 'none'; // Ocultar mensaje de carrito vacío
            }

            // Simular añadir un item al carrito (aquí podrías añadir la lógica para crear elementos HTML)
            console.log(`Producto agregado. Total en carrito: ${cartItemCount}`);
            // Por ahora, solo mostramos el pop-up y actualizamos el contador.
            // Una lógica más completa añadiría el producto real al cartItemsContainer.
        });
    });

    closeCartBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
    });

    // --- Funcionalidad del Pop-up de Tipo de Pedido ---

    // Abre el pop-up al hacer clic en la dirección de entrega de la cabecera
    deliveryAddressDisplay.addEventListener('click', () => {
        orderTypePopup.classList.add('active');
    });

    // Cierra el pop-up de tipo de pedido
    closeOrderTypePopupBtn.addEventListener('click', () => {
        orderTypePopup.classList.remove('active');
    });

    // Maneja la selección de Delivery/Pickup
    orderOptions.forEach(option => {
        option.addEventListener('click', () => {
            orderOptions.forEach(opt => opt.classList.remove('active')); // Desactiva todos
            option.classList.add('active'); // Activa el seleccionado
            console.log(`Tipo de pedido seleccionado: ${option.dataset.type}`);
            // Aquí podrías añadir lógica para cambiar la información de entrega en la cabecera
            // o en el carrito, según la selección.
        });
    });

    // --- Funcionalidad del Menú de Hamburguesa (para móviles) ---
    // Si bien no lo implementamos completamente con un menú lateral,
    // puedes expandirlo para mostrar / ocultar el menú de navegación principal.
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open'); // Necesitarías CSS para .main-nav.open
        // Esto es un placeholder. Para un menú lateral real necesitarías más CSS y JS.
        console.log('Menú de hamburguesa clickeado');
    });

    // Cierra el pop-up del carrito y el de tipo de pedido si se hace clic fuera (opcional)
    // document.addEventListener('click', (event) => {
    //     if (!cartPopup.contains(event.target) && !addToCartButtons[0].contains(event.target) && cartPopup.classList.contains('active')) {
    //         cartPopup.classList.remove('active');
    //     }
    //     if (!orderTypePopup.contains(event.target) && !deliveryAddressDisplay.contains(event.target) && orderTypePopup.classList.contains('active')) {
    //         orderTypePopup.classList.remove('active');
    //     }
    // });
});
