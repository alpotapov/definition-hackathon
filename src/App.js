import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { client } from 'defi-sdk';

import CreateSwapPage from './pages/CreateSwapPage/CreateSwapPage';
import LiquidityPage from './pages/LiquidityPage/LiquidityPage';
import TradePage from './pages/TradePage/TradePage';

import './App.css';
import logo from './assets/logo.svg';

export const endpoint = 'wss://api.zerion.io';
export const API_TOKEN = 'Demo.ukEVQp6L5vfgxcz4sBke7XvS873GMYHy';

client.configure({
  url: endpoint,
  apiToken: API_TOKEN,
});
Object.assign(window, { client });

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
              Create Swap
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
            <div className="Content">
              <TradePage />
            </div>
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

const ActionPage = () => <h2>Action</h2>;
