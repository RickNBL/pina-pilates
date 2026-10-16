# Publicação na Vercel

O site está na pasta `dist`, e não em `public`. O arquivo `vercel.json` na raiz configura essa saída e o build TypeScript.

1. Envie o projeto atualizado para o repositório conectado à Vercel, incluindo `vercel.json`, `package.json`, `src`, `tsconfig.json`, `pnpm-lock.yaml` e toda a pasta `dist`.
2. Em Settings → Build and Deployment, confirme que **Root Directory** aponta para a pasta que contém `package.json` e `vercel.json`. Se o conteúdo do ZIP estiver dentro de `studio-pina-pilates/` no repositório, selecione essa pasta. Se os arquivos estiverem diretamente na raiz do repositório, mantenha a raiz.
3. A configuração corresponde a **Framework Preset: Other**, **Build Command: npm run build** e **Output Directory: dist**. O `vercel.json` define esses valores para o novo deploy.
4. Faça um novo deploy do commit com os arquivos atualizados. Reexecutar apenas um commit antigo não incorpora o novo arquivo.

Para corrigir pelo painel sem substituir o projeto, altere Output Directory de `public` para `dist`, salve e faça Redeploy. Isso pressupõe que Root Directory já aponta para o projeto completo.

Não aponte Root Directory para `dist` ao usar esta configuração: ela foi preparada para a raiz do projeto completo. Python e Rust são ferramentas locais e não precisam executar na Vercel.

Referência: https://vercel.com/docs/project-configuration/vercel-json#outputdirectory
