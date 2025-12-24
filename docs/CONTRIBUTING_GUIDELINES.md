# Guia de Contribuição

## Como Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Padrões de Código

### TypeScript
- Strict mode habilitado
- Sem `any` implícito
- Interfaces para props de componentes

### React
- Componentes funcionais com hooks
- Memo para otimização quando necessário
- Custom hooks para lógica reutilizável

### Testes
- Mínimo 80% de cobertura
- Testes unitários para utils/hooks
- Testes de integração para componentes

## Checklist do PR

- [ ] Testes passando
- [ ] Lint sem erros
- [ ] Types corretos
- [ ] Documentação atualizada
- [ ] CHANGELOG atualizado
