import React, { Component } from 'react'
import YouTube from 'react-youtube'

class CampaignsVideoCard extends Component {
    render() {
        const youtubeURLBase = "https://www.youtube.com/watch?v="
        const opts = {
            playerVars: { // https://developers.google.com/youtube/player_parameters
                modestbranding: 1,
                rel: 0,
                playsinline: 1
            }
        }
        return (
            <div className="card">
                {//<img className="card-img-top" src={this.props.thumbnail} alt="" />
                }
                <YouTube
                className='youtubePlayer'
                    videoId={this.props.videoId}       // defaults -> null
                    opts={opts}                        // defaults -> {}
                    onReady={this._onReady}
                />
                <div className="card-body">
                    <h4 className="card-title">{this.props.title}</h4>
                    <div className="card-text" dangerouslySetInnerHTML={{ __html: this.props.description }}></div>
                    <div>
                        <a className="btn btn-success" href={youtubeURLBase + this.props.videoId}>
                            Watch
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
    }
}

export default CampaignsVideoCard