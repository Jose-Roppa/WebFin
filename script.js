// Ofuscação básica da URL para evitar rastreadores simples
const part1 = "https://script.google.com/macros/s/";
const part2 = "AKfycbwzx_geUAEu6WzyIwDr0-L6rZhf44OB_AhFS4vHkTlbfPkweYfqih31GTyxSdfdzaaVbQ";
const part3 = "/exec";
const SCRIPT_URL = part1 + part2 + part3;

// Variável global que guardará a senha apenas na memória do navegador enquanto a aba estiver aberta
let userToken = "";

// Função de Acesso
function checkAccess() {
    const passInput = document.getElementById('access-password').value;
    const errorMsg = document.getElementById('login-error');

    if (passInput.length > 0) {
        // Guardamos o que foi digitado para usar como Token nas requisições
        userToken = passInput;
        
        // Esconde login e mostra o conteúdo
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        
        // Opcional: Salva apenas que está autenticado, mas NÃO a senha no storage
        sessionStorage.setItem('isAuth', 'true');
    } else {
        errorMsg.innerText = "Por favor, digite uma senha.";
        errorMsg.classList.remove('hidden');
    }
}

// Lógica de envio do formulário
document.getElementById('finance-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btn-submit');
    const originalBtnText = btn.innerText;
    
    // Feedback visual de carregamento
    btn.disabled = true;
    btn.innerText = "Enviando para a Planilha...";
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const payload = {
        token: userToken, // Enviamos a senha que você digitou no início
        data: document.getElementById('data').value,
        descricao: document.getElementById('desc').value,
        valor: document.getElementById('valor').value,
        categoria: document.getElementById('categoria').value,
        formaPagamento: document.getElementById('forma').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('obs').value
    };

    try {
        // Enviando os dados via POST para o Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Necessário para evitar erros de CORS com Google Apps Script
            body: JSON.stringify(payload)
        });

        // Como o modo é 'no-cors', não conseguimos ler o texto da resposta,
        // mas se não cair no 'catch', o envio foi disparado.
        alert("Comando enviado! Verifique sua planilha em alguns segundos.");
        document.getElementById('finance-form').reset();
        
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão ou senha inválida.");
    } finally {
        btn.disabled = false;
        btn.innerText = originalBtnText;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

// Função para deslogar
function logout() {
    userToken = "";
    sessionStorage.clear();
    location.reload();
}

// Verifica se já estava logado ao recarregar a página
window.onload = () => {
    if (sessionStorage.getItem('isAuth') === 'true') {
        // Se recarregar, precisará pedir a senha de novo por segurança (userToken limpa)
        // ou você pode forçar o logout:
        logout();
    }
};