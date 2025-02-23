// SISTEMA DE LOGIN E CADASTRO
// Simulação de um "banco de dados" local (apenas para fins de demonstração)
const usersDatabase = [];

// Função para cadastro de usuário
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validação de senha
    if (password !== confirmPassword) {
        document.getElementById('registerMessage').innerText = "As senhas não coincidem.";
        document.getElementById('registerMessage').style.color = "red";
        return;
    }

    // Verifica se o usuário já existe
    const userExists = usersDatabase.some(user => user.email === email);
    if (userExists) {
        document.getElementById('registerMessage').innerText = "Este e-mail já está cadastrado.";
        document.getElementById('registerMessage').style.color = "red";
        return;
    }

    // Se tudo estiver correto, adiciona o usuário ao "banco de dados"
    usersDatabase.push({ email, password });
    document.getElementById('registerMessage').innerText = "Cadastro realizado com sucesso!";
    document.getElementById('registerMessage').style.color = "green";
    document.getElementById('registerForm').reset();
});

// Função para login de usuário
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o envio do formulário

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Verifica se o usuário existe e a senha está correta
    const user = usersDatabase.find(user => user.email === email && user.password === password);
    if (user) {
        document.getElementById('loginMessage').innerText = "Login bem-sucedido!";
        document.getElementById('loginMessage').style.color = "green";
    } else {
        document.getElementById('loginMessage').innerText = "E-mail ou senha incorretos.";
        document.getElementById('loginMessage').style.color = "red";
    }

    // Resetando o formulário após o login
    document.getElementById('loginForm').reset();
});

// SISTEMA DE COMPRA
// Função para adicionar item à sacola
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifica se o produto já está no carrinho
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Exibir o modal do Bootstrap
    const modalMessage = document.getElementById('modal-message');
    modalMessage.innerText = `${product.name} foi adicionado à sua sacola!`;

    const modal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    modal.show();
}

// Atribui a função de adicionar à sacola a todos os botões com a classe 'add-to-cart'
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const product = {
            id: this.dataset.id,
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            quantity: 1,
            img: this.dataset.img
        };

        addToCart(product);
    });
});

// Função para carregar os itens da sacola
function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById('cart-items');
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <p class='text-center'>Sua sacola está vazia!</p>
            <div class="text-center">
    <a href="produtos.html" id='add-items-button' class='btn btn-danger'>Adicionar Itens</a>
</div>
        `;
        document.getElementById('cart-summary').style.display = 'none'; // Esconder resumo do pedido
        return;
    }

    cartItemsContainer.innerHTML = `
        <table class="table cart-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>                    
                </tr>
            </thead>
            <tbody>
            ${cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
                    <tr>
                        <td><button class="btn btn-danger remove-item" data-id="${item.id}">X</button></td>
                        <td><img src="${item.img}" alt="${item.name}" class="img-fluid" style="width: 70px; height: 70px;"> ${item.name}</td>
                        <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                        <td>
                            <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        </td>
                        <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>                        
                    </tr>
                `;
    }).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-summary').style.display = 'block'; // Mostrar resumo do pedido

    // Adiciona evento para atualizar a quantidade
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            const updatedQuantity = parseInt(this.value);
            const productId = this.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const product = cart.find(item => item.id === productId);
            if (product) {
                product.quantity = updatedQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems(); // Atualiza a exibição do carrinho
            }
        });
    });

    // Adiciona evento para remover o item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId); // Remove o produto do carrinho
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems(); // Atualiza a exibição do carrinho
        });
    });
}

// Carrega os itens da sacola ao carregar a página
window.onload = loadCartItems;

// Manipulação do formulário de contato
const form = document.getElementById('contactForm');
const modal = new bootstrap.Modal(document.getElementById('successModal'));
const fecharModal = document.getElementById('fecharModal');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Mostra o modal ao enviar o formulário
    modal.show();

    // Simula o envio do formulário
    form.reset();  // Limpa os campos do formulário após exibir o modal
});

// Quando o usuário fecha o modal, limpa o formulário
fecharModal.addEventListener('click', function () {
    modal.hide();  // Fecha o modal
    form.reset();  // Limpa o formulário novamente, caso o usuário feche o modal
});