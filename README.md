# Studio Pina Pilates

Site responsivo com três páginas: **Início**, **O Studio & Aulas** e **Contato**.

## Abrir o site

Extraia o ZIP e abra `dist/index.html` no navegador. As páginas, estilos, fotos e JavaScript estão incluídos e não exigem instalação. WhatsApp e Google Maps precisam de internet.

Para pré-visualizar por HTTP com Python 3.10 ou superior:

```sh
python tools/serve.py
```

Abra http://127.0.0.1:8080. Encerre com Ctrl+C.

## Tecnologias

- **HTML:** três páginas completas em `dist/`.
- **CSS:** identidade visual, formas orgânicas, grades responsivas e acessibilidade em `dist/assets/styles.css`.
- **TypeScript:** menu móvel, acessibilidade e animações de entrada em `src/app.ts`. O JavaScript compilado já está em `dist/assets/app.js`.
- **Python:** servidor de pré-visualização em `tools/serve.py` e empacotamento em `tools/package.py`, sem bibliotecas externas.
- **Rust:** servidor alternativo local em `rust/`, sem crates externos. Requer instalação do Rust/Cargo. Execute `cargo run --manifest-path rust/Cargo.toml` e abra http://127.0.0.1:8081. Não é necessário para abrir ou hospedar o site estático.

Python e Rust têm funções auxiliares reais; não são executados pelo navegador. Os servidores são exclusivos para pré-visualização local, não para produção.

## Alterar o TypeScript

Com Node.js e npm instalados:

```sh
npm install
npm run check
npm run build
```

Ou use pnpm, com o arquivo de versões `pnpm-lock.yaml` incluído. Não é necessário compilar novamente quando apenas HTML, CSS ou imagens são alterados.

## Publicar

Envie **o conteúdo da pasta `dist/`** para uma hospedagem estática. A página inicial é `index.html`. Mantenha os nomes das páginas e a pasta `assets`. O arquivo `.openai/hosting.json` é a configuração da prévia no Sites; não é necessário em outras hospedagens.

## Contato e dados

O número utilizado é **+55 11 97610-2680**, conforme o site original. Os botões abrem o WhatsApp com mensagens prontas sobre aula gratuita, planos, horários, aulas online e em domicílio, para revisar e enviar. Não há formulário. Não confirma reservas, não envia automaticamente e não guarda dados. Não há analytics ou cookies. Fontes e Bootstrap estão incluídos localmente, sem requisições a CDNs. Para trocar o número, atualize os links nos três HTMLs.

## Identidade e conteúdo

Fonte consultada em 16/10/2026: https://studiopinapilates.com/ . Logo, fotografias, endereço, contato, modalidades e informações do estúdio vêm dessa fonte. Conteúdo reescrito para o novo layout; não foram criados depoimentos ou preços. A composição visual é inspirada na referência fornecida pelo solicitante.

Cores originais: vinho `#800000`, rosa terroso `#AB7E7E` e rosa claro `#D7B8B8`, complementados por fundos claros. Fotos de aulas do studio ilustram as modalidades, inclusive online e domiciliar; não representam registros dessas modalidades fora do studio.

Veja `FONTES.md` para os arquivos de origem. Os materiais de marca pertencem aos respectivos titulares.

## Verificação

TypeScript compilado. Três páginas verificadas em navegador nas larguras 1440, 768, 390 e 320 px, com imagens, navegação móvel, ausência de rolagem horizontal navegação dos cards de modalidades, acordeão e mensagens prontas de WhatsApp. O servidor Python foi executado. O servidor Rust foi fornecido como código-fonte e não foi compilado neste ambiente, que não possui o compilador Rust.

## Gerar outro ZIP

```sh
python tools/package.py
```

O arquivo gerado fica ao lado da pasta do projeto. Dependências instaladas e arquivos temporários não são incluídos.

## Atualização visual

Tipografia Cormorant Garamond e Manrope, com arquivos locais e licenças OFL. Bootstrap 5.3.8 incluído em `dist/assets/vendor`, com licença MIT. Menu móvel e FAQ usam Collapse; modalidades usam cards com rolagem horizontal, setas, teclado e toque. Animações respeitam a preferência por movimento reduzido. Cards com diferentes proporções, sem numeração e sem legendas decorativas nas fotos.


## Fotos e contato

Página Studio com fotos em molduras arredondadas, cards de modalidades com foto e texto lado a lado e navegação horizontal por setas, teclado ou toque. Galeria adaptada a telas pequenas. Botão WhatsApp com ícone redesenhado, texto identificável e mensagem pronta.

