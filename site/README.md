# Qualificação urbanística da Avenida Antônio Carlos

Apresentação do TCC de Letícia Oliveira Santos, Arquitetura e Urbanismo / UFMG, 2026. Atualizada com a monografia de 119 páginas e a prancha de travessia fornecidas em novembro de 2026.

## Abrir

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abra http://127.0.0.1:4173. Também é possível abrir `dist/index.html` diretamente, mantendo toda a pasta `dist` junta. Não há instalação ou build para servir o site.

## Conteúdo

- Diagnóstico da avenida e quatro setores de análise.
- Explorador com cinco mapas, zoom, arraste, teclado e diálogo ampliado.
- Maquete 3D esquemática com rotação, zoom, planta, perspectiva e seção.
- Cenários MOVE, MOVE + VLT e MOVE + VLP, conforme o capítulo 6.2.
- Seis diretrizes de intervenção e aprofundamento projetual no Setor UFMG.
- Planta e corte da passarela no Viaduto José Alencar.
- Quatro pranchas de aplicação com imagem ampliável.
- Método, autoria, orientação e acesso à monografia atualizada.

A maquete é uma interpretação volumétrica sem escala; o modelo original da autora não foi localizado. A interface e `FONTES.md` explicitam essa distinção.

## Editar

- `dist/index.html`: conteúdo e estrutura.
- `dist/atlas.css`: identidade visual, mapas, galerias e responsividade.
- `dist/app.js`: mapas, seleção de setores e ampliação de imagens.
- `dist/urban-model.js`: geometria e interação da maquete.
- `dist/assets/`: imagens e fontes locais.
- `dist/docs/`: monografia atualizada e prancha A3 original.
- `FONTES.md`: versões, páginas e limites das representações.

Em celular, o mapa usa seletor nativo, o 3D permite rotação horizontal preservando a rolagem vertical, e as colunas passam para o fluxo de leitura. Há foco visível, navegação por teclado, diálogos nativos e respeito à preferência por movimento reduzido.

## Publicação

O workflow `.github/workflows/pages.yml` publica `site/dist` no GitHub Pages quando esses arquivos são enviados à branch `master`. A atualização local não publica automaticamente. O conjunto tem cerca de 17 MB; a monografia tem 10,8 MB e carrega sob demanda.
