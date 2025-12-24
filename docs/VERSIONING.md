# Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/).

## Formato

`MAJOR.MINOR.PATCH`

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

## Processo de Release

1. Atualizar CHANGELOG.md
2. Bump version no package.json
3. Criar tag Git
4. Deploy automatizado via CI/CD

## Branches

- `main` - Produção estável
- `develop` - Integração de features
- `feature/*` - Novas funcionalidades
- `hotfix/*` - Correções urgentes

## Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção
