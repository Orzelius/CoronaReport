/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import * as React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Stats from './Stats';
import Navbar from './Nav';
import CountryDetails from './CountryDetails';


// eslint-disable-next-line arrow-body-style
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        {/* the Switch makes sure only the first element gets loaded */}
        <Switch>
          {/* <Route exact path="/" component={Dasboard}/> */}
          <div className="mt-24 mx-2">
            <Route exact path="/" component={Stats} />
            <Route path="/:id" component={CountryDetails} />
          </div>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
