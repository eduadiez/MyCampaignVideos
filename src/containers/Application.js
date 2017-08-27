import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// components
import MainMenu from './../components/MainMenu'

// views
import CampaignsVideos from './../components/views/CampaignsVideos'
import newCampaignVideos from './../components/views/newCampaignVideos'

class Application extends Component {
  render() {
    return (
      <Router basename="/MyCampaignVideos">
        <div>
          <MainMenu />
          <div>
            {/* Routes are defined here. Persistent data is set as props on components */}
            <Switch>
              <Route exact path="/" component={CampaignsVideos} />
              <Route exact path="/new" component={newCampaignVideos} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Application;
