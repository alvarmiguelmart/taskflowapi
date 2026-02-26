const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class TaskService {
  async createTask(userId, projectId, taskData) {
    const { title, description, priority, dueDate, assigneeId, tags } = taskData;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            id: userId
          }
        }
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado ou acesso negado', 404);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        createdById: userId,
        assigneeId,
        tags: tags
          ? {
              connectOrCreate: tags.map(tag => ({
                where: { name: tag },
                create: { name: tag }
              }))
            }
          : undefined
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true
      }
    });

    return task;
  }

  async getTasks(userId, projectId, filters = {}) {
    const { status, priority, assigneeId, tags } = filters;

    const where = {
      projectId,
      project: {
        members: {
          some: {
            id: userId
          }
        }
      }
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId;
    }

    if (tags) {
      where.tags = {
        some: {
          name: {
            in: tags.split(',')
          }
        }
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });

    return tasks;
  }

  async getTaskById(taskId, userId) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              id: userId
            }
          }
        }
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada ou acesso negado', 404);
    }

    return task;
  }

  async updateTask(taskId, userId, updateData) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              id: userId
            }
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrado ou acesso negado', 404);
    }

    if (updateData.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true
          }
        },
        tags: true
      }
    });

    return updatedTask;
  }

  async deleteTask(taskId, userId) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              id: userId
            }
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada ou acesso negado', 404);
    }

    await prisma.task.delete({
      where: { id: taskId }
    });
  }

  async addComment(taskId, userId, content) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              id: userId
            }
          }
        }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada ou acesso negado', 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    return comment;
  }
}

module.exports = new TaskService();

