import React, { Component } from 'react'
import { feathersClient } from '../../lib/feathersClient'

// Views
import CampaignsVideosCard from '../CampaignsVideoCard'

// Components
import AddNewCampaignButton from '../AddNewCampaignButton'

class CampaignsVideos extends Component {

  constructor() {
    super()
    this.state = {
      campaigns: []
    }

    feathersClient.service('campaigns').find().then(campaignsResonse => {
      const campaigns = campaignsResonse.data;
      this.setState({ campaigns });
    });
  }

  render() {
    // Check if query ended
    if (this.state.campaigns.length > 0) {
      return (
        <div id="video-campaigns-view">
          <div className="container-fluid page-layout reduced-padding">
            <div className="card-columns">
              {
                this.state.campaigns.map((video) => {
                  return (
                    // Load each video from the query into a card
                    <CampaignsVideosCard
                      key={video._id}
                      id={video._id}
                      title={video.name}
                      description={video.description}
                      videos={video.videos}
                    />
                  )
                })
              }
            </div>
          </div>
          <AddNewCampaignButton />
        </div>
      )
    } else {
      return (
        <div id="video-campaigns-view">
          <div className="container-fluid page-layout reduced-padding">
            <div className="card-columns">
              <p className="text-center">Loading campaigns or empty...</p>
            </div>
          </div>
          <AddNewCampaignButton />
        </div>
      )
    }
  }
}

export default CampaignsVideos