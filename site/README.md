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

O workflow `.github/workflows/pages.yml` executa os testes de empacotamento e `python3 site/build_pages.py` após push na branch `master`, publicando `site/_site` no GitHub Pages. O conteúdo de `dist` é preservado em `/tcc/`; a raiz redireciona para esse caminho, preservando parâmetros e âncoras. `site/_site` é uma saída gerada e ignorada pelo Git.

Domínio de destino: `https://leticiaos.arq.br/tcc/`. O empacotamento gera URL canônica, metadados de compartilhamento, dados estruturados do trabalho, `robots.txt` e `https://leticiaos.arq.br/sitemap.xml`. O sitemap inclui a página canônica e as dez imagens da galeria, sem miniaturas duplicadas. Sua disponibilidade permite a descoberta pelos buscadores; ela não comprova indexação no Google.

A propriedade HTTPS `https://leticiaos.arq.br/` do Google Search Console usa a metatag pública de verificação fornecida pelo Google, incluída na raiz e em `/tcc/`. Esse método permite validar a propriedade sem alterar novamente o DNS. Preserve a metatag após a confirmação da propriedade. O cadastro, a verificação e a submissão do sitemap são etapas separadas; somente a confirmação na interface do Google comprova a conclusão das duas últimas.

Para conferir a estrutura publicada localmente, a partir da raiz do repositório:

```sh
python3 -m unittest discover -s site -p test_build_pages.py
python3 site/build_pages.py
python3 -m http.server 4174 --bind 127.0.0.1 --directory site/_site
```

O domínio personalizado é configurado nas opções Pages do repositório. No Registro.br, o domínio raiz deve ter os quatro registros A e os quatro AAAA oficiais do GitHub Pages; `www` usa CNAME para `joaovitorsd.github.io`. O registro TXT de validação é obtido nas configurações Pages da conta proprietária. HTTPS depende da validação DNS e da emissão do certificado pelo GitHub.

Referências: [GitHub Pages — domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) e [Google — criação de sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Os três PDFs somam aproximadamente 62 MB e não são carregados na navegação normal.
