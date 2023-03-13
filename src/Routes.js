import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Loader from './component/Loader/Loader';
import NavMotion from './layout/NavMotion';
import MainLayout from './layout/MainLayout';
import GuestGuard from './component/Auth/GuestGuard';
import AuthGuard from './component/Auth/AuthGuard';
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout/index';
import OrderModal from './views/WORKORDER/Order/index.js';
import AlertDialogSlide from './views/WORKORDER/Material';
import ShortageModal from './views/Material/Purchase/Shortage/index';
import MaterialModal from './views/Material/Received/Material';
const AuthLogin = lazy(() => import('./views/Login'));
const AuthForgot = lazy(() => import('./views/ForgotPass'));
const AuthConfirm = lazy(() => import('./views/ConfirmCode'));
const App = lazy(() => import('./views/Dashboard/App/index.js'));
const DashboardDefault = lazy(() => import('./views/Dashboard/Default'));
const Logout = lazy(() => import('./views/Users/logout'));

const Routes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Redirect exact from="/" to="/dashboard/app" />
          <Route path={['/application/login']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <Route path="/application/login" component={AuthLogin} />
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/login']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <GuestGuard>
                    <Route path="/login" component={AuthLogin} />
                    <Route path="/dashboard/app" component={App} />
                    <Route path="/dashboard/default" component={DashboardDefault} />
                  </GuestGuard>
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/forgot']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <GuestGuard>
                    <Route path="/forgot" component={AuthForgot} />
                  </GuestGuard>
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/confirm']}>
            <MinimalLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <GuestGuard>
                    <Route path="/confirm" component={AuthConfirm} />
                  </GuestGuard>
                </NavMotion>
              </Switch>
            </MinimalLayout>
          </Route>
          <Route path={['/dashboard/app', '/dashboard/workorder/:id', '/dashboard/material', '/received/material']}>
            <AppLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <AuthGuard>
                    <Route path="/dashboard/app" component={App} />
                    <Route path="/dashboard/default" component={DashboardDefault} />
                    <Route path="/dashboard/workorder/:id" component={OrderModal} />
                    <Route path="/dashboard/workorder/material" component={AlertDialogSlide} />
                    <Route path="/dashboard/material" component={ShortageModal} />
                    <Route path="/received/material" component={MaterialModal} />
                  </AuthGuard>
                </NavMotion>
              </Switch>
            </AppLayout>
          </Route>
          <Route path={['/dashboard/default', '/users/logout']}>
            <MainLayout>
              <Switch location={location} key={location.pathname}>
                <NavMotion>
                  <AuthGuard>
                    <Route path="/dashboard/app" component={App} />
                    <Route path="/dashboard/default" component={DashboardDefault} />
                    <Route path="/users/logout" component={Logout} />
                  </AuthGuard>
                </NavMotion>
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};

export default Routes;
