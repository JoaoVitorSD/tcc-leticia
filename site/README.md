# Antônio Carlos — Da passagem à permanência

Apresentação do trabalho de Letícia Oliveira Santos, Arquitetura e Urbanismo / UFMG, 2026.

## Abrir

Abra `dist/index.html` em um navegador. O site funciona localmente, inclusive os mapas, as fontes e o PDF. Mantenha a pasta `dist` inteira junto do HTML.

Para uma prévia por servidor local, execute na pasta `site`:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Depois acesse `http://127.0.0.1:4173`.

## Conteúdo

- Apresentação da tese central: integrar mobilidade e espaço público para transformar passagem em permanência.
- Explorador com cinco mapas, zoom, arraste, teclado e visualização ampliada.
- Quatro setores: Pampulha, UFMG, Cachoeirinha e Lagoinha.
- Diretrizes para caminhar, pedalar, permanecer e conectar.
- Diagrama interativo da redistribuição das faixas, identificado como esquemático.
- Método, autoria, orientação, créditos e acesso à monografia completa.

Em celulares, a capa e o mapa seguem o fluxo do conteúdo, a navegação ocupa uma linha própria e os mapas são escolhidos por um seletor nativo. Os controles de toque têm pelo menos 44 px. O mapa ampliado adapta o cabeçalho e a legenda a telas em pé ou deitadas. Layout conferido de 320 a 1024 px, além da versão desktop.

## Editar

- `dist/index.html`: conteúdo e estrutura.
- `dist/styles.css`: identidade visual e adaptação às telas.
- `dist/app.js`: mapas, textos setoriais e interações.
- `dist/assets/`: imagens e fontes locais.
- `dist/docs/`: PDF original, sem alteração.
- `FONTES.md`: rastreabilidade do conteúdo e dos mapas.

## Mapa de implantação

O Affinity `.af` contém uma prévia PNG de 1024 × 724 px. Essa imagem original foi extraída e usada em `dist/assets/implantacao.png`; o arquivo de trabalho não foi alterado. As linhas são realçadas apenas na apresentação por um filtro SVG não destrutivo. A reprodução continua sendo raster, não vetorial, e ampliar não revela detalhes adicionais.

Para a versão definitiva na web, exportar o desenho no Affinity como SVG ou PNG em alta resolução e substituir esse asset, ajustando as referências caso a extensão mude. Os demais mapas foram extraídos diretamente do PDF em 1448 × 2048 px e convertidos em WebP, preservando legendas e créditos.

## Publicação

Site estático, sem dependências, instalação, build, conta, cookies ou serviços externos. Publicar todo o conteúdo de `dist` em hospedagem estática. O PDF tem aproximadamente 70 MiB (73 MB) e pode ultrapassar limites por arquivo de alguns provedores; nesse caso, hospedá-lo separadamente e atualizar seus links. O PDF só é carregado quando solicitado.

As fontes Manrope e Barlow Condensed são distribuídas sob SIL Open Font License; licenças em `dist/assets/fonts/`.

Publicação no GitHub Pages: https://joaovitorsd.github.io/tcc-leticia/. O workflow `.github/workflows/pages.yml` publica `site/dist` automaticamente após alterações na branch `master`.
