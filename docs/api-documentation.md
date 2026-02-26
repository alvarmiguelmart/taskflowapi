## TaskFlow - Documentação de API (Resumo)

### Autenticação

- **POST** `/api/v1/auth/register`
- **POST** `/api/v1/auth/login`
- **GET** `/api/v1/auth/profile`

### Usuários

- **GET** `/api/v1/users/me`
- **PATCH** `/api/v1/users/me`
- **GET** `/api/v1/users?search=term`

### Projetos

- **POST** `/api/v1/projects`
- **GET** `/api/v1/projects`
- **GET** `/api/v1/projects/:id`
- **PATCH** `/api/v1/projects/:id`
- **DELETE** `/api/v1/projects/:id`
- **POST** `/api/v1/projects/:id/members`

### Tarefas

- **POST** `/api/v1/projects/:projectId/tasks`
- **GET** `/api/v1/projects/:projectId/tasks`
- **GET** `/api/v1/tasks/:taskId`
- **PATCH** `/api/v1/tasks/:taskId`
- **DELETE** `/api/v1/tasks/:taskId`
- **POST** `/api/v1/tasks/:taskId/comments`

