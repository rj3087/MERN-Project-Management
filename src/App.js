import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ActionActivationPage from './pages/AccountActivationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountSettingPage from './pages/AccountSetting';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import MessagePage from './pages/MessagePage';
import UtilitiesPage from './pages/UtilitiesPage';
import TaskByName from './components/task/TaskByName';

import { logoutAccount } from './redux/actions/accountActions';

const App = () => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [usersOnline, setUsersOnline] = useState();
  const [jwtToken, setJwtToken] = useState(
    JSON.parse(localStorage.getItem('tokenId')) || ''
  );

  const dispatch = useDispatch();

  const [socket, setSocket] = useState();
  const history = createBrowserHistory();

  useEffect(() => {
    if (!socket) {
      setSocket(io('ws://localhost:5000'));
    } else {
      if (socket) {
        if (!usersOnline) {
          socket?.emit('addUser', accountInfo._id);
          socket.on('getUsers', (users) => {
            setUsersOnline(users);
          });
        }
      }
    }

    if (jwtToken) {
      var decodedToken = jwt.decode(jwtToken, { complete: true });
      var dateNow = new Date();
      if (decodedToken.payload.exp * 1000 < dateNow.getTime()) {
        dispatch(logoutAccount());
      }
    }
  }, [accountInfo._id, dispatch, jwtToken, socket, usersOnline]);

  return (
    <div className='main-wrapper'>
      <BrowserRouter>
        <Switch>
          <Route path='/register' component={RegisterPage} />
          <Route path='/login' component={LoginPage} />
          <Route
            path='/account-activation/:activationToken'
            component={ActionActivationPage}
          />
          <Route path='/forgot-password' component={ForgotPasswordPage} />
          <Route
            path='/reset-password/:resetToken'
            component={ResetPasswordPage}
          />
          <Route path='/account-setting' component={AccountSettingPage} />
          <Route
            path='/projects'
            render={() => <ProjectsPage socket={socket} history={history} />}
          />
          <Route
            path='/project/board/:projectIdUrl'
            render={() => <TasksPage />}
          />
          <Route
            path='/tasks'
            render={() => <TasksPage socket={socket} exact />}
          />
          <Route
            path='/task/browse/:taskLink'
            render={() => (
              <TaskByName socket={socket} history={history} exact />
            )}
          />
          <Route
            path='/message'
            render={() => <MessagePage socket={socket} />}
          />
          <Route
            path='/settings'
            render={() => <UtilitiesPage socket={socket} />}
          />
          <Route
            path='/'
            render={() => (
              <ProjectsPage socket={socket} history={history} exact />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
