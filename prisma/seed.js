const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: passwordHash,
      name: 'Test User'
    }
  });

  const project = await prisma.project.create({
    data: {
      name: 'Projeto de Exemplo',
      description: 'Projeto inicial de exemplo',
      ownerId: user.id,
      members: {
        connect: [{ id: user.id }]
      }
    }
  });

  await prisma.task.create({
    data: {
      title: 'Primeira tarefa',
      description: 'Configurar ambiente',
      priority: 'HIGH',
      projectId: project.id,
      createdById: user.id,
      assigneeId: user.id
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

