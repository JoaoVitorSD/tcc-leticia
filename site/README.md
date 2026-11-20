# Qualificação urbanística e mobilidade ativa

Apresentação do estudo preliminar de Letícia Oliveira Santos para a Avenida Presidente Antônio Carlos e entorno, Arquitetura e Urbanismo / UFMG, 2026.

## Abrir

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abra http://127.0.0.1:4173. Não há instalação ou build. Mantenha a pasta `dist` inteira para uso local.

## Acervo atual

Atualizado com o pacote PROJETO.zip fornecido em 20/11/2026:

- Monografia TCB: 135 páginas; versão de trabalho que contém comentários de revisão.
- Pranchas de projeto: 10 páginas, incluindo planta, cortes, passarela, praças, circuito e acessos ao parque.
- Fotomontagens: 5 páginas, com situação existente, diretrizes e mapas-chave.
- Imagem de apresentação enviada separadamente, preservada como referência no diretório de imagens.

A maquete procedimental anterior foi retirada. O pacote contém PDFs e imagens, sem arquivo de geometria 3D. O explorador atual apresenta perspectivas e desenhos efetivamente fornecidos pela autora, sem sugerir rotação de um modelo inexistente.

## Experiência

- Abertura com o título completo e a perspectiva enviada, com as faixas cinzas fora do enquadramento.
- Menu e seções na ordem: Leitura do território, Diretrizes de intervenção, Fotomontagens, Projeto de estudo preliminar e Documentos.
- Leitura organizada em Contexto histórico da avenida, Contexto atual, Análise dos setores, Áreas de intervenção e Mobilidade, com trechos transcritos e referências às páginas.
- Diretrizes com os nomes, cores e ícones do diagrama da monografia.
- Explorador das áreas A1, A2 e A3 dentro da seção do projeto, com miniaturas, navegação entre vistas e ampliação.
- Cinco comparações por arraste entre situação existente e fotomontagem da proposta.
- Atlas com cartografia da monografia atualizada, zoom e arraste.
- Comparação dos cenários MOVE, MOVE + VLT e MOVE + VLP por diagramas da monografia.
- Dez pranchas exibidas em um slide, com miniaturas abaixo e ampliação.
- Acervo com os três PDFs completos, carregados apenas quando solicitados.
- Paleta aprovada e Arial com títulos em negrito; layout responsivo, foco visível, controles por teclado e respeito a movimento reduzido.

## Editar

- `dist/index.html`: conteúdo e estrutura.
- `dist/atlas.css`: identidade visual, tipografia e atlas.
- `dist/project.css`: perspectivas, comparações e acervo.
- `dist/app.js`: mapas e ampliação de imagens.
- `dist/territory-content.js`: trechos da monografia e metadados de origem.
- `dist/board-viewer.js`: navegação entre as dez pranchas.
- `dist/project-viewer.js`: áreas, vistas, comparações e cenários.
- `dist/assets/project-2026/`: imagens e miniaturas do pacote atualizado.
- `dist/docs/`: documentos originais de consulta.
- `FONTES.md`: proveniência e referências de páginas.

## Publicação

O workflow `.github/workflows/pages.yml` publica `site/dist` no GitHub Pages após push na branch `master`. O acervo tem cerca de 72 MB, dos quais aproximadamente 62 MB são os três PDFs. Esses documentos não são carregados na navegação normal.
