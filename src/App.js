import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import CreateSwapPage from './pages/CreateSwapPage/CreateSwapPage';
import LiquidityPage from './pages/LiquidityPage/LiquidityPage';

import './App.css';
import logo from './assets/logo.svg';

export default function App() {
  return (
    <Router>
      <div className="App">
        <div className="Header">
          <div className="Header-logoContainer">
            <img src={logo} alt="logo" />
          </div>
          <div className="Header-separator" />
          <nav className="Header-navigation">
            <Link className="Header-link" to="/">
              Create Swap11
            </Link>
            <Link className="Header-link" to="/liquidity">
              Liquidity
            </Link>
            <Link className="Header-link" to="/trade">
              Trade
            </Link>
            <Link className="Header-link" to="/action">
              Action
            </Link>
          </nav>
        </div>

        <Switch>
          <Route path="/liquidity">
            <LiquidityPage />
          </Route>
          <Route path="/trade">
            <TradePage />
          </Route>
          <Route path="/action">
            <ActionPage />
          </Route>
          <Route path="/">
            <CreateSwapPage />
          </Route>
        </Switch>

        <div className="Footer">
          <div className="Footer-logoContainer">
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </Router>
  );
}

const TradePage = () => <h2>Trade</h2>;

const ActionPage = () => <h2>Action</h2>;
