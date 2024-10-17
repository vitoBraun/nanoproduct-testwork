import { Model } from 'mongoose';
import { TaskDocument } from './task.schema';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { UserGroupService } from '../user-group/user-group.service';
import { TaskHistoryService } from './task-history.service';
import { SocketGateway } from '../socket/socket.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskModel: Model<TaskDocument>;
  let userService: UserService;
  let userGroupService: UserGroupService;

  // Mock task object
  const mockTask = {
    _id: 'taskId',
    title: 'Test Task',
    assignedToUser: 'userId',
    assignedToGroup: 'groupId',
    status: 'created',
    dueDate: new Date('2024-10-17T00:00:00.000Z'),
  };

  const mockUser = { _id: 'userId', name: 'Test User' };
  const mockUserGroup = { _id: 'groupId', name: 'Test Group' };

  const mockTaskModel = {
    create: jest.fn().mockResolvedValue(mockTask),
    findById: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn().mockResolvedValue([mockTask]),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockTask),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockTask),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockTask),
  };

  const mockUserService = {
    getUserById: jest.fn().mockResolvedValue(mockUser),
  };

  const mockUserGroupService = {
    getUserGroupById: jest.fn().mockResolvedValue(mockUserGroup),
  };

  const mockTaskHistoryService = {
    logHistory: jest.fn().mockResolvedValue(true),
  };

  const mockSocketGateway = {
    emitToClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getModelToken('Task'), useValue: mockTaskModel },
        { provide: UserService, useValue: mockUserService },
        { provide: UserGroupService, useValue: mockUserGroupService },
        { provide: TaskHistoryService, useValue: mockTaskHistoryService },
        { provide: SocketGateway, useValue: mockSocketGateway },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskModel = module.get<Model<TaskDocument>>(getModelToken('Task'));
    userService = module.get<UserService>(UserService);
    userGroupService = module.get<UserGroupService>(UserGroupService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('addTask', () => {
    it('should create a new task and log history', async () => {
      const taskData = { title: 'Новая задача', description: 'Описание' };

      const result = await taskService.addTask(taskData);

      expect(taskModel.create).toHaveBeenCalledWith(taskData);

      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks assigned to a user', async () => {
      const query = { dueDate: new Date(), status: 'pending' };
      const result = await taskService.getTasksByUserId({
        assignedToUserId: 'userId',
        query,
      });

      expect(userService.getUserById).toHaveBeenCalledWith('userId');
      expect(taskModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(null);

      await expect(
        taskService.getTasksByUserId({
          assignedToUserId: 'invalidId',
          query: {},
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTasksByGroupId', () => {
    it('should return tasks assigned to a group', async () => {
      const query = { dueDate: new Date(), status: 'pending' };
      const result = await taskService.getTasksByGroupId({
        assignedToGroupId: 'groupId',
        query,
      });

      expect(userGroupService.getUserGroupById).toHaveBeenCalledWith('groupId');
      expect(taskModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });

    it('should throw NotFoundException if group does not exist', async () => {
      jest
        .spyOn(userGroupService, 'getUserGroupById')
        .mockResolvedValueOnce(null);

      await expect(
        taskService.getTasksByGroupId({
          assignedToGroupId: 'invalidId',
          query: {},
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskById', () => {
    it('should update a task and log history', async () => {
      const updateData = { status: 'completed' };

      const result = await taskService.updateTaskById({
        id: 'taskId',
        task: updateData,
        responsibleUser: mockUser,
      });

      expect(taskModel.findById).toHaveBeenCalledWith('taskId');
      expect(taskModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'taskId' },
        updateData,
        { new: true, useFindAndModify: false },
      );

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        taskService.updateTaskById({
          id: 'invalidId',
          task: {},
          responsibleUser: mockUser,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
