# 🤝 Guia de Contribuição - Match ATS

Obrigado por considerar contribuir com o Match ATS! Este documento explica como contribuir.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)

## 📜 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite feedback construtivo
- Foque no que é melhor para a comunidade

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado
2. Abra uma issue com o template de bug
3. Inclua passos para reproduzir

### Sugerindo Melhorias

1. Abra uma issue com o template de feature
2. Descreva o problema que resolve
3. Proponha uma solução

### Contribuindo com Código

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 💻 Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/adm01-debug/match.git
cd match

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev

# Execute testes
npm test

# Execute E2E
npm run test:e2e
```

## 📝 Padrões de Código

### Commits (Conventional Commits)

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

### TypeScript

- Use tipos explícitos
- Evite `any`
- Documente com TSDoc

### React

- Componentes funcionais
- Use hooks customizados
- Memoize quando necessário

### Testes

- Cobertura mínima: 80%
- Teste casos de sucesso e erro
- Use data-testid para E2E

## 🔄 Processo de Pull Request

1. **Título**: Use Conventional Commits
2. **Descrição**: Explique o que e por quê
3. **Checklist**:
   - [ ] Testes passando
   - [ ] Lint sem erros
   - [ ] Documentação atualizada
   - [ ] Review solicitado

## 📞 Dúvidas?

Abra uma issue ou entre em contato com os mantenedores.

---

*Obrigado por contribuir! 🎉*
