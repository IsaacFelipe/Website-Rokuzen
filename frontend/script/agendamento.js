// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA MOSTRAR PROFISSIONAIS APÓS SELECIONAR DATA ---
    const seletorData = document.getElementById('data-agendamento');
    const secaoProfissionais = document.getElementById('secao-profissionais');

    seletorData.addEventListener('change', function() {
        if (seletorData.value) {
            secaoProfissionais.classList.remove('oculto');
        } else {
            secaoProfissionais.classList.add('oculto');
        }
    });

    // --- LÓGICA PARA SELEÇÃO INTERATIVA DOS ITENS ---

    /**
     * Função reutilizável para lidar com a seleção em um grupo de elementos.
     * @param {string} seletor - O seletor CSS para os elementos clicáveis (ex: '.item-servico').
     */
    function gerenciarSelecao(seletor) {
        const elementos = document.querySelectorAll(seletor);

        elementos.forEach(elemento => {
            // Ignora a adição de eventos em botões que contêm a classe 'desabilitado'
            if (elemento.classList.contains('desabilitado')) {
                return;
            }

            elemento.addEventListener('click', function(evento) {
                // Previne o comportamento padrão do link (<a>) para os serviços
                evento.preventDefault();
                
                // 1. Remove a classe 'ativo' de todos os elementos no grupo
                elementos.forEach(el => el.classList.remove('ativo'));

                // 2. Adiciona a classe 'ativo' apenas ao elemento que foi clicado
                this.classList.add('ativo');
            });
        });
    }

    // Aplica a função de seleção para cada grupo de itens clicáveis
    gerenciarSelecao('.card-unidade');
    gerenciarSelecao('.item-servico');
    gerenciarSelecao('.btn-horario');
    gerenciarSelecao('.card-profissional');
});