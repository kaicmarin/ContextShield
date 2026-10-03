# ContextShield — versão comentada

Esta pasta é uma cópia do projeto original com comentários explicativos adicionados aos arquivos de código.

## Regra aplicada
- A lógica original não foi corrigida, refatorada, otimizada ou reorganizada.
- Não foram alterados nomes, valores, condições, imports, caminhos ou comportamentos.
- Os comentários foram adicionados apenas para explicar o que cada parte representa.
- Arquivos JSON (`package.json`, `package-lock.json`, `tsconfig*.json`) permanecem sem comentários porque JSON não aceita comentários válidos; inserir `//` neles faria o arquivo deixar de ser JSON válido.
- `node_modules` e `dist` foram preservados no ZIP, mas não foram reescritos com comentários para evitar modificar dependências/artefatos gerados.

## Estrutura
O caminho original de cada arquivo foi mantido. Assim, por exemplo:

`contextshield/src/services/risk.ts`

continua exatamente nesse caminho dentro da versão comentada.

## Observação
Os comentários nos imports explicam também de onde o módulo é carregado: dependência externa ou caminho relativo dentro do próprio projeto.
