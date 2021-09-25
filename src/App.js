import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import CreateSwapPage from './pages/CreateSwapPage/CreateSwapPage';
import LiquidityPage from './pages/LiquidityPage/LiquidityPage';

import './App.css';
import logo from './assets/logo.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
            <Link to="/">Create Swap</Link>
            <Link to="/liquidity">Liquidity</Link>
            <Link to="/trade">Trade</Link>
            <Link to="/action">Action</Link>
          </nav>
        </div>

        <Switch>
          <Route path="/">
            <CreateSwapPage />
          </Route>
          <Route path="/liquidity">
            <LiquidityPage />
          </Route>
          <Route path="/trade">
            <TradePage />
          </Route>
          <Route path="/action">
            <ActionPage />
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

function TradePage() {
  return <h2>Home</h2>;
}

function ActionPage() {
  return <h2>About</h2>;
}
