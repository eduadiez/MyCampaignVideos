import React, { Component } from 'react'

class CampaignsVideoCard extends Component {
    render() {
        const youtubeURLBase = "https://www.youtube.com/watch?v="
        return (
            <div className="card">
                <img className="card-img-top" src={this.props.thumbnail} alt="" />
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
}

export default CampaignsVideoCard