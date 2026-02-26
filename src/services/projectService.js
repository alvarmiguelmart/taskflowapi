const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

class ProjectService {
  async createProject(userId, projectData) {
    const { name, description } = projectData;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          connect: [{ id: userId }]
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return project;
  }

  async getProjects(userId, filters = {}) {
    const { status, search } = filters;

    const where = {
      members: {
        some: {
          id: userId
        }
      }
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return projects;
  }

  async getProjectById(projectId, userId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            id: userId
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        tasks: {
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
              take: 5,
              orderBy: {
                createdAt: 'desc'
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
            }
          },
          orderBy: [
            { priority: 'desc' },
            { dueDate: 'asc' }
          ]
        }
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    return project;
  }

  async updateProject(projectId, userId, updateData) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado ou você não tem permissão', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return updatedProject;
  }

  async deleteProject(projectId, userId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado ou você não tem permissão', 404);
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'DELETED', deletedAt: new Date() }
    });
  }

  async addMember(projectId, ownerId, memberEmail) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado ou você não é o proprietário', 404);
    }

    const user = await prisma.user.findUnique({
      where: { email: memberEmail }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          connect: [{ id: user.id }]
        }
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedProject;
  }
}

module.exports = new ProjectService();

