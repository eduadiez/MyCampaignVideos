import React, { Component } from 'react'
import { Link } from 'react-router-dom';

// views
import CampaignsVideosCard from '../CampaignsVideoCard'

const youtubeAPI = 'https://www.googleapis.com/youtube/v3/playlistItems?' +
  'part=snippet&' +
  'playlistId=<PLAYLIST ID>&' +
  'fields=items(snippet(description%2CresourceId%2Cthumbnails%2Fmedium%2Ctitle))&' +
  'key=<API KEY>'

class CampaignsVideos extends Component {

  constructor(props) {
    super(props)
    this.state = { videoList: [] }
    this.loadData = this.loadData.bind(this)

  }

  loadData() {
    fetch(youtubeAPI)
      .then((response) => {
        return response.json()
      })
      .then((_videolist) => {
        this.setState({ videoList: _videolist.items })
      })
  }

  componentDidMount() {
    this.loadData()
    // Reload every 3 minutes in milliseconds
    setInterval(this.loadData(), 180000);
  }

  render() {

    // Check if query ended
    if (this.state.videoList.length > 0) {
      return (
        <div id="video-campaigns-view">
          <div className="container-fluid page-layout reduced-padding">
            <div className="card-columns">
              {
                this.state.videoList.map((video) => {
                  return (
                    // Load each video from the query into a card
                    <CampaignsVideosCard
                      key={video.snippet.resourceId.videoId}
                      title={video.snippet.title}
                      thumbnail={video.snippet.thumbnails.medium.url}
                      description={video.snippet.description}
                      videoId={video.snippet.resourceId.videoId}
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
        </div>
      )
    }
  }
}

export default CampaignsVideos