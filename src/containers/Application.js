import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// components
import MainMenu from './../components/MainMenu'

// views
import CampaignsVideos from './../components/views/CampaignsVideos'
import NewCampaignVideos from './../components/views/NewCampaignVideos'

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
              <Route exact path="/new" component={(props) => (<NewCampaignVideos appState={'value'} isNew={true} {...props}/>)} />
              <Route exact path="/new/:id" component={(props) => (<NewCampaignVideos appState={'value'} isNew={false} {...props}/>)} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Application;
