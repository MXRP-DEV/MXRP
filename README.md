# Flujo rápido de desarrollo

Este repositorio incluye scripts y validaciones para mantener calidad de código.

## Comandos principales

- `pnpm check`: ejecuta lint + revisión de formato.
- `pnpm fix`: aplica auto-fixes de lint + formato.

## Hooks de git

Se usa `husky` junto con `lint-staged` para validar archivos staged antes de cada commit.

El hook `pre-commit` ejecuta:

```bash
pnpm exec lint-staged
```

## Ejemplos

```bash
pnpm check
pnpm fix
```
