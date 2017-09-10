import React, { Component } from 'react'
import YouTube from 'react-youtube'
import { Link } from 'react-router-dom';

class CampaignsVideoCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeVideo: props.videos[0],
            videos: props.videos,
            videosVimeo: props.videosVimeo,
            id: props.id
        }
    }

    render() {

        const opts = {
            playerVars: { // https://developers.google.com/youtube/player_parameters
                modestbranding: 1,
                rel: 0,
                playsinline: 0,
                controls: 2
            }
        }

        return (
            <div className="card">
                <div id={"carouselIndicators_" + this.state.id} className="carousel slide" data-ride="carousel" data-interval="false">
                    <ol className="carousel-indicators">
                        {
                            this.state.videos.map(function (video, idx) {
                                return (
                                    <li
                                        key={idx}
                                        data-target={"#carouselIndicators_" + this.state.id}
                                        data-slide-to={idx}
                                        className={idx === (this.state.videos.length - 1) ? "active" : null} >
                                    </li>
                                )
                            }, this)
                        }
                    </ol>
                    <div className="carousel-inner">
                        {
                            this.state.videos.map(function (video, idx) {
                                return (
                                    <div key={idx} className={idx === (this.state.videos.length - 1) ? "carousel-item active" : "carousel-item"}>
                                        {
                                            video.videoType === "youtube" ?
                                                <YouTube
                                                    className='youtubePlayer'
                                                    videoId={video.videoId}             // defaults -> null
                                                    opts={opts}                 // defaults -> {}
                                                    onReady={this._onReady}
                                                />
                                            :
                                            <iframe className='youtubePlayer' type="text/html" src={"https://player.vimeo.com/video/" + video.videoId} title={video.videoId} frameBorder="0" allowFullScreen></iframe>
                                        }
                                    </div>
                                )
                            }, this)

                        }

                    </div>
                    <a className="carousel-control-prev" href={"#carouselIndicators_" + this.state.id} onClick={this.handleClick} role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={"#carouselIndicators_" + this.state.id} onClick={this.handleClick} role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                <div className="card-body">
                    <h4 className="card-title">{this.props.title}</h4>
                    <div className="card-text" dangerouslySetInnerHTML={{ __html: this.props.description }}></div>
                    <div>
                        <Link to={`/new/${this.props.id}`}>
                            <button type="button" className="btn btn-success">
                                Add video
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    handleClick(e) {
        e.preventDefault();
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
    }
}

export default CampaignsVideoCard

