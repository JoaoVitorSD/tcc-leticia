# Qualificação urbanística da Avenida Antônio Carlos

Apresentação do trabalho de conclusão de **Letícia Oliveira Santos**, Arquitetura e Urbanismo / UFMG, 2026.

[Apresentação no GitHub Pages](https://joaovitorsd.github.io/tcc-leticia/)

A versão local incorpora a monografia de 119 páginas, os mapas atualizados, o aprofundamento projetual no Setor UFMG e a prancha da passarela. Inclui uma maquete 3D interpretativa com cenários MOVE, VLT e VLP; ela é esquemática, sem escala, e não substitui o modelo original da autora.

## Desenvolvimento local

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory site/dist
```

Abra http://127.0.0.1:4173. Não há dependências de instalação ou build. Também é possível abrir `site/dist/index.html` diretamente.

## Documentação

- [Estrutura e edição](site/README.md)
- [Fontes e rastreabilidade](site/FONTES.md)
- Autora: Letícia Oliveira Santos.
- Orientador: Hamilton Moreira Ferreira.
- Instituição: Escola de Arquitetura da UFMG.

O texto do site é uma síntese editorial da pesquisa. Os desenhos, mapas e a monografia mantêm os créditos da autora e das fontes indicadas. Fontes tipográficas locais sob SIL OFL.

## Publicação

O GitHub Actions publica `site/dist` quando os arquivos são enviados à branch `master`. Alterações locais só entram no site público após envio ao remoto e conclusão do workflow.
