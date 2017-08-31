import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { feathersClient } from '../../lib/feathersClient'

// views
import CampaignsVideosCard from '../CampaignsVideoCard'

const youtubeAPI = 'https://www.googleapis.com/youtube/v3/playlistItems?' +
  'part=snippet' +
  '&playlistId=' + process.env.REACT_APP_YOUTUBE_PLAYLIST_ID +
  '&fields=items(snippet(description%2CresourceId%2Cthumbnails%2Fmedium%2Ctitle))' +
  '&key=' + process.env.REACT_APP_YOUTUBE_API_KEY

class CampaignsVideos extends Component {

  constructor() {
    super()
    this.state = { 
      videoList: [],
      campaigns: []
    }
    const campaigns = feathersClient.service('campaigns');
    campaigns.find().then( campaignsResonse => {
      const campaigns = campaignsResonse.data;
      this.setState({campaigns});
      console.log(this.state.campaigns)
    });

    this.loadData = this.loadData.bind(this)

  }

  loadData() {
    console.log(youtubeAPI)
    fetch(youtubeAPI)
      .then((response) => {
        return response.json()
      })
      .then((_videolist) => {
        this.setState({ videoList: _videolist.items })
      })
  }

  componentDidMount() {
    //this.loadData()
    // Reload every 3 minutes in milliseconds
    //setInterval(this.loadData(), 180000);
  }

  render() {

    // Check if query ended
    if (this.state.campaigns.length > 0) {
      console.log(this.state.campaigns)
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
                      //thumbnail={video.snippet.thumbnails.medium.url}
                      description={video.description}
                      videos={video.videos}
                    />
                  )
                })
              }
            </div>
          </div>

          <Link to="/new">
            <button type="button" className="btn btn-circle btn-success">
              <div className="center-block">
                <svg className="svgIcon" width="48px" height="48px" viewBox="0 0 48 48">
                  <path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z" fill="white" />
                </svg>
              </div>
            </button>
          </Link>
        </div>
      )
    } else {
      return (
        <div id="video-campaigns-view">
          <div className="container-fluid page-layout reduced-padding">
            <div className="card-columns">
              <p className="text-center">Loading campaign videos...</p>
            </div>
          </div>
          <Link to="/new">
            <button type="button" className="btn btn-circle btn-success">
              <div className="center-block">
                <svg className="svgIcon" width="48px" height="48px" viewBox="0 0 48 48">
                  <path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z" fill="white" />
                </svg>
              </div>
            </button>
          </Link>
        </div>
      )
    }
  }
}

export default CampaignsVideos