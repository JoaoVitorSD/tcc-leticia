# Fontes e rastreabilidade

Atualização: 15 de novembro de 2026.

Fonte principal: Letícia Oliveira Santos. **Do Eixo Viário ao Espaço de Permanência: Projeto de Qualificação Urbanística na Av. Antônio Carlos em Belo Horizonte/MG**. Escola de Arquitetura da UFMG, 2026. Orientação: Hamilton Moreira Ferreira.

## Versão da monografia

O arquivo `dist/docs/leticia-oliveira-tcc.pdf` é a versão de trabalho fornecida em 15/11/2026, com 119 páginas físicas e 10.833.559 bytes. Substitui a versão anterior de 98 páginas. Os links `#page=` usam a página física, não a numeração impressa. O título editorial da apresentação não altera o título da monografia.

| Conteúdo | Página física | Página impressa |
| --- | --- | --- |
| Objetivo geral | 4, 12–13 | Resumo, 13–14 |
| Mapa 5: quatro setores | 64 | 65 |
| Pampulha | 65–69 | 66–70 |
| UFMG | 70–72 | 71–73 |
| Cachoeirinha | 73–76 | 74–77 |
| Lagoinha | 77–81 | 78–82 |
| Mapa 10: áreas com potencial de intervenção | 84 | 85 |
| Mapa 11: rede cicloviária | 90 | 91 |
| Mapa 12: expansão MOVE | 91 | 92 |
| Área de estudo do Setor UFMG | 95–96 | 96–97 |
| VLT, VLP e comparação dos cenários | 96–102 | 97–103 |
| Diretrizes de intervenção | 103–104 | 104–105 |
| Posto de Saúde São Francisco | 105 | 106 |
| Rua Alentejo | 106 | 107 |
| Rua Aimee Semple McPherson | 107 | 108 |
| Acesso ao Parque Ecológico do Brejinho | 108 | 109 |

O objetivo geral é a qualificação urbanística do eixo da avenida e seu entorno. O Setor UFMG é o recorte de aplicação projetual. As seis diretrizes foram sintetizadas a partir do capítulo 6.4; não substituem o diagnóstico geral. As 60 respostas são uma amostra exploratória, sem inferir representatividade estatística.

## Imagens e prancha

- Os quatro mapas foram extraídos das imagens incorporadas no PDF atualizado, preservando legendas, fontes e créditos, e convertidos em WebP.
- `saude.webp`, `alentejo.webp`, `aimee.webp` e `brejinho.webp` foram extraídos dos painéis gráficos incorporados nas páginas físicas 105–108 e otimizados para largura de 2400 px, incluindo situação atual e intervenção proposta. Não são fotografias de obras executadas.
- `docs/prancha-passarela.pdf` é a prancha A3 de uma página fornecida em 15/11/2026. Planta e corte são recortes de uma renderização em 180 dpi, usados como `passarela-planta.webp` e `passarela-corte.webp`. O original disponível para consulta mantém o texto provisório que já continha.
- `implantacao.png` preserva a prévia de 1024 × 724 px incorporada ao arquivo Affinity anteriormente fornecido. Sua cronologia em relação aos demais desenhos não é presumida.
- Desenhos, cartografia e propostas: Letícia Oliveira Santos. Cartografia com base em BH Maps, 2026, conforme créditos do documento.

## Maquete 3D interativa

`urban-model.js` contém uma representação volumétrica procedimental e interpretativa das diretrizes, sem escala. O modelo 3D autoral não foi encontrado nas pastas locais consultadas. A maquete não é uma importação desse modelo e não reproduz geometria cadastral, dimensões, declividades, cotas ou estrutura da passarela.

As opções MOVE, MOVE + VLT e MOVE + VLP representam os cenários discutidos no capítulo 6.2. O MOVE permanece central e a complementação aparece nas laterais. Não há simulação de demanda ou viabilidade, comparação numérica de capacidades, nem indicação de escolha final de tecnologia. Volumes do entorno e a travessia são ilustrativos.

## Implementação

Sínteses editoriais em português. Fontes Manrope e Barlow Condensed locais, com licenças SIL OFL em `dist/assets/fonts/`. Site estático, sem bibliotecas remotas nem rastreamento. PDFs são carregados apenas quando solicitados. O desenho 3D renderiza sob interação e redimensionamento, sem ciclo contínuo de animação.
