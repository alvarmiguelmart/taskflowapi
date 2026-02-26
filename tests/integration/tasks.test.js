const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Task Routes', () => {
  let token;
  let userId;
  let projectId;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
  where: { email: 'tasks-test@example.com' },
  update: {},
  create: {
    email: 'tasks-test@example.com',
    password: 'hashedpassword',
    name: 'Test User'
  }
});
    userId = user.id;

    const secret = process.env.JWT_SECRET || 'test-secret';
    token = jwt.sign({ userId }, secret);

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        ownerId: userId,
        members: { connect: [{ id: userId }] }
      }
    });
    projectId = project.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /projects/:projectId/tasks', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      const futureDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Nova Tarefa',
          priority: 'HIGH',
          dueDate: futureDueDate
        });

      expect(response.status).toBe(201);
      expect(response.body.data.task).toHaveProperty('id');
      expect(response.body.data.task.title).toBe('Nova Tarefa');
    });

    it('deve retornar erro com título muito curto', async () => {
      const response = await request(app)
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'ab'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /projects/:projectId/tasks', () => {
    it('deve listar tarefas do projeto', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });

    it('deve filtrar tarefas por status', async () => {
      const response = await request(app)
        .get(`/api/v1/projects/${projectId}/tasks?status=PENDING`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      response.body.data.tasks.forEach(task => {
        expect(task.status).toBe('PENDING');
      });
    });
  });
});

