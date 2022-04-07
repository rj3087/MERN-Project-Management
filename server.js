import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import accountModel from '../server/models/accountModel.js';

dotenv.config();

import accountRoutes from './routes/accountRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import conversationRoutes from './routes/coversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import utilitiesRoutes from './routes/utilitiesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', accountRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/', utilitiesRoutes);

const __dirname = path.resolve('..');

app.use('/public/uploads', express.static(__dirname + '/public/uploads/'));

const chatServer = http.createServer(app);

const io = new Server(chatServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

let usersOnline = [];

const addUser = (userId, socketId) => {
  !usersOnline.some((user) => user.userId === userId) &&
    usersOnline.push({ userId, socketId });
};

const removeUser = (socketId) => {
  usersOnline = usersOnline.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return usersOnline.find((user) => user.userId === userId);
};

mongoose
  .connect(
    process.env.CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        socket.emit('getUsers', usersOnline);
      });

      socket.on(
        'sendMessage',
        async ({ senderId, receiverId, message, messageMedia, seen }) => {
          try {
            const user = getUser(receiverId);
            const accountId = await accountModel.findById(senderId);
            if (user) {
              socket.to(user.socketId).emit('getMessage', {
                accountId,
                message,
                messageMedia,
                seen,
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      socket.on(
        'sendAssignedNotification',
        ({
          senderInfo,
          receiverId,
          category,
          name,
          type,
          content,
          link,
          createdAt,
          seen,
        }) => {
          if (receiverId) {
            const receiver = getUser(receiverId);

            if (receiver) {
              socket.to(receiver.socketId).emit('getAssignedNotification', {
                senderInfo,
                type,
                category,
                name,
                content,
                link,
                createdAt,
                seen,
              });
            }
          }
        }
      );

      socket.on(
        'sendInvitedNotification',
        ({
          senderInfo,
          receiverId,
          category,
          name,
          type,
          content,
          link,
          createdAt,
          seen,
        }) => {
          if (receiverId) {
            const receiver = getUser(receiverId);

            if (receiver) {
              socket.to(receiver.socketId).emit('getInvitedNotification', {
                senderInfo,
                type,
                category,
                name,
                content,
                link,
                createdAt,
                seen,
              });
            }
          }
        }
      );

      socket.on(
        'sendMentionNotification',
        ({
          senderInfo,
          receiverId,
          category,
          name,
          type,
          content,
          link,
          createdAt,
          seen,
        }) => {
          if (receiverId) {
            const receiver = getUser(receiverId);

            if (receiver) {
              socket.to(receiver.socketId).emit('getMentionNotification', {
                senderInfo,
                type,
                category,
                name,
                content,
                link,
                createdAt,
                seen,
              });
            }
          }
        }
      );

      socket.on('disconnect', () => {
        console.log('User Disconnected');
        removeUser(socket.id);
        io.emit('getUsers', usersOnline);
      });
    })
  )
  .then(() => {
    chatServer.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
