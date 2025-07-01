document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const shippingCost = document.getElementById('shipping-cost');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    const orderTypePopup = document.getElementById('order-type-popup');
    const deliveryAddressDisplayHeader = document.querySelector('.delivery-address'); // El de la cabecera
    const closeOrderTypePopupBtn = orderTypePopup.querySelector('.close-popup-btn');
    const orderOptions = orderTypePopup.querySelectorAll('.order-option');
    const cartChangeAddressBtn = document.querySelector('.cart-change-address-btn'); // Botón cambiar dir en carrito

    const headerAddressSpan = document.getElementById('header-current-address'); // Dirección en header
    const cartAddressSpan = document.getElementById('cart-current-address'); // Dirección en carrito popup
    const popupStreetAddressSpan = document.getElementById('popup-street-address'); // Dirección calle en popup
    const popupCityAddressSpan = document.getElementById('popup-city-address'); // Dirección ciudad en popup

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // --- Estado del Carrito (Array para almacenar productos) ---
    let cart = [];
    const SHIPPING_FEE = 15.00; // Costo de envío fijo para el demo

    // --- Dirección actual (simulada) ---
    let currentDeliveryAddress = {
        street: 'Calle Ficticia #123',
        city: 'Naucalpan de Juárez, México'
    };

    // --- Funciones del Carrito ---

    // Función para actualizar el DOM del carrito
    function updateCartUI() {
        cartItemsContainer.innerHTML = ''; // Limpiar items existentes
        let subtotal = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true; // Deshabilitar botón de pago si carrito está vacío
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.dataset.productId = item.id; // Guarda el ID para fácil referencia

                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="item-controls">
                        <button class="decrease-quantity-btn" aria-label="Disminuir cantidad">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-quantity-btn" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button class="remove-item-btn" aria-label="Eliminar producto">
                        <span class="material-icons">delete</span>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        // Actualizar el resumen de totales
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        shippingCost.textContent = `$${(cart.length > 0 ? SHIPPING_FEE : 0).toFixed(2)}`; // Envío solo si hay productos
        cartTotal.textContent = `$${(subtotal + (cart.length > 0 ? SHIPPING_FEE : 0)).toFixed(2)}`;

        // Actualizar el contador global del carrito
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Añadir producto al carrito
    function addProductToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        cartPopup.classList.add('active'); // Asegura que el carrito se muestre
    }

    // Gestionar la cantidad de un producto
    function updateItemQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Eliminar si la cantidad es 0 o menos
            }
            updateCartUI();
        }
    }

    // Eliminar un producto completo del carrito
    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    // --- Listeners para añadir productos ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product-card');
            const productId = productElement.querySelector('.add-to-cart-btn').dataset.productId;
            const productName = productElement.querySelector('.add-to-cart-btn').dataset.name;
            const productPrice = parseFloat(productElement.querySelector('.add-to-cart-btn').dataset.price);
            const productImage = productElement.querySelector('.add-to-cart-btn').dataset.image;

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            addProductToCart(product);
        });
    });

    // --- Delegación de eventos para los botones de cantidad y eliminar en el carrito ---
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        // Encuentra el elemento padre .cart-item
        const cartItemElement = target.closest('.cart-item');

        if (!cartItemElement) return; // Si el clic no fue dentro de un cart-item, salir

        const productId = cartItemElement.dataset.productId;

        if (target.classList.contains('increase-quantity-btn')) {
            updateItemQuantity(productId, 1);
        } else if (target.classList.contains('decrease-quantity-btn')) {
            updateItemQuantity(productId, -1);
        } else if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
            // Permite hacer clic en el span del icono o en el botón
            removeItemFromCart(productId);
        }
    });

    // --- Abrir/Cerrar Carrito ---
    document.querySelector('.cart-btn').addEventListener('click', () => {
        cartPopup.classList.toggle('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
    });

    // --- Funcionalidad del Pop-up de Tipo de Pedido y Dirección ---

    // Función para actualizar la dirección mostrada en todos los lugares
    function updateAddressDisplay() {
        headerAddressSpan.textContent = `${currentDeliveryAddress.street}, ${currentDeliveryAddress.city}`;
        cartAddressSpan.textContent = `${currentDeliveryAddress.street}`;
        popupStreetAddressSpan.textContent = currentDeliveryAddress.street;
        popupCityAddressSpan.textContent = currentDeliveryAddress.city;
    }

    // Abre el pop-up al hacer clic en la dirección de entrega de la cabecera
    deliveryAddressDisplayHeader.addEventListener('click', () => {
        orderTypePopup.classList.add('active');
    });

    // Abre el pop-up al hacer clic en el botón de cambiar dirección del carrito
    cartChangeAddressBtn.addEventListener('click', () => {
        orderTypePopup.classList.add('active');
        cartPopup.classList.remove('active'); // Opcional: cierra el carrito al abrir el selector de dirección
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
            // Aquí podrías guardar el tipo de pedido en una variable global si lo necesitas:
            // let selectedOrderType = option.dataset.type;
        });
    });

    // Simular "Cambiar" dirección dentro del pop-up de tipo de pedido
    orderTypePopup.querySelector('.delivery-details .change-address-btn').addEventListener('click', () => {
        // En una app real, aquí se abriría un mapa o un formulario para introducir nueva dirección
        alert('Simulación: Aquí se abriría la opción para cambiar la dirección o seleccionar una guardada.');

        // Para este demo, podemos cambiarla a una dirección diferente de forma ficticia
        // Puedes poner aquí direcciones predefinidas o un prompt para simular input
        const newStreet = prompt("Ingresa la nueva calle:", "Av. Siempre Viva #742");
        const newCity = prompt("Ingresa la nueva ciudad:", "Springfield, USA");

        if (newStreet && newCity) {
            currentDeliveryAddress = {
                street: newStreet,
                city: newCity
            };
            updateAddressDisplay(); // Actualiza todas las visualizaciones de dirección
            alert('Dirección actualizada a: ' + newStreet + ', ' + newCity);
        } else {
            alert('Cambio de dirección cancelado o datos incompletos.');
        }

        // orderTypePopup.classList.remove('active'); // Opcional: cierra el popup automáticamente
    });

    // --- Funcionalidad del Menú de Hamburguesa (para móviles) ---
    // (Este es un placeholder, para un menú lateral real necesitarías más CSS y JS para el toggle)
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open'); // Necesitarías CSS para .main-nav.open para una animación real
        // Para este demo, también podemos simular un menú simple mostrando un alert
        // alert('Menú lateral se abriría aquí (funcionalidad no completa en este demo).');
    });

    // --- Funcionalidad del Botón de Checkout ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`¡Simulación de Pago!\n` +
                  `Total a pagar: ${cartTotal.textContent}\n` +
                  `Productos:\n${cart.map(item => `- ${item.name} (${item.quantity} x $${item.price.toFixed(2)})`).join('\n')}\n` +
                  `Dirección de entrega: ${currentDeliveryAddress.street}, ${currentDeliveryAddress.city}`);
            // Aquí en una aplicación real, se redirigiría a una pasarela de pago o confirmación
            cart = []; // Vaciar el carrito después de "pagar"
            updateCartUI();
            cartPopup.classList.remove('active');
        } else {
            alert('Tu carrito está vacío. Agrega productos para proceder al pago.');
        }
    });


    // --- Inicialización al cargar la página ---
    updateCartUI(); // Asegura que el contador y el estado del carrito sean correctos al inicio
    updateAddressDisplay(); // Asegura que la dirección se muestre correctamente al inicio
});
