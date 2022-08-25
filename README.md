# zé da pizza #
Aqui você traz as pizzas de volta para a pizzaria, e não o contrário.
Este jogo de corrida de estilo retrô é sobre navegar em uma cidade 3D gerada aleatoriamente
no seu Toyota Corolla 1986, enquanto ouve música floatbeat codificada à mão
e efeitos sonoros. Outro destaque é o mecanismo de renderização 3D personalizado
implementado em JavaScript.

# Analise Tecnica #

Minha abordagem para fazer o limite de 13kb foi confiar tanto em procedimentos
geração de conteúdo possível e construir tudo do zero,
sem usar nenhum framework externo. Eu também não suporto pré-ES6
navegadores. Enquanto eu otimizei o código (especialmente o renderizador) para ser tão
possível, a abordagem básica de renderização é inerentemente lenta: eu
estou usando um renderizador personalizado (com base neste algoritmo:
https://github.com/s-macke/VoxelSpace) para renderizar o mundo inteiro para o
canvas manipulando os dados de imagem da tela diretamente. Isso significa um
muitos cálculos são feitos diretamente em JavaScript. Essa abordagem leva a
um estilo de arte muito retrô e algumas liberdades artísticas interessantes (como o
piso).
