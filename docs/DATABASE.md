# Database Schema

## Overview
Match ATS uses Supabase (PostgreSQL) with Row Level Security.

## Tables

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | User email |
| full_name | text | User name |
| role | text | User role |
| avatar_url | text | Profile image |

### vagas
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| titulo | text | Job title |
| descricao | text | Description |
| departamento | text | Department |
| status | text | Open/Closed |

### candidatos
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| nome | text | Name |
| email | text | Email |
| telefone | text | Phone |
| curriculo_url | text | Resume URL |

### candidaturas
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| candidato_id | uuid | FK to candidatos |
| vaga_id | uuid | FK to vagas |
| etapa | text | Pipeline stage |
| match_score | int | AI match score |

## RLS Policies
All tables have RLS enabled. Users can only access data based on their role.

## Migrations
Run migrations with: `npm run db:migrate`
