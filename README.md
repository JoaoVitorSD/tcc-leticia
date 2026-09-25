# Antônio Carlos — Da passagem à permanência

Apresentação do trabalho de conclusão de **Letícia Oliveira Santos**, Arquitetura e Urbanismo / UFMG, 2026.

**[Acessar a apresentação](https://joaovitorsd.github.io/tcc-leticia/)**

O site apresenta o diagnóstico e as diretrizes de qualificação urbanística da Avenida Antônio Carlos, em Belo Horizonte, com cinco mapas interativos, leitura dos quatro setores e uma comparação esquemática da redistribuição das faixas.

## Desenvolvimento local

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory site/dist
```

Abra `http://127.0.0.1:4173`. Também é possível abrir `site/dist/index.html` diretamente, mantendo os arquivos da pasta juntos.

## Publicação

O GitHub Actions publica o conteúdo de `site/dist` no GitHub Pages quando esses arquivos são atualizados na branch `master`. Também é possível executar manualmente o workflow **Publicar apresentação no GitHub Pages**.

O site é estático, sem dependências de instalação e sem serviços externos para exibir mapas ou fontes. O PDF completo é carregado apenas quando solicitado.

## Documentação e autoria

- [Estrutura, edição e limitações do mapa](site/README.md)
- [Fontes e rastreabilidade do conteúdo](site/FONTES.md)
- Autora: Letícia Oliveira Santos.
- Orientador: Hamilton Moreira Ferreira.
- Instituição: Escola de Arquitetura da UFMG.

O texto do site é uma síntese editorial da pesquisa. Os desenhos, mapas e a monografia mantêm os créditos de sua autora e das fontes indicadas no trabalho. As licenças das fontes tipográficas estão em `site/dist/assets/fonts`.
