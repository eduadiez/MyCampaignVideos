import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoBackButton from '../GoBackButton'
import { Form, Input } from 'formsy-react-components'
import { socket, feathersClient } from '../../lib/feathersClient'


class NewCampaign extends Component {

    constructor() {
        super();
        this.state = {
            id: '',
            name: '',
            title: '',
            description: '',
            blob: null,
            showPlayer: false,
            inputVideoLink: '',         
            campaignVideoList: [],
            inputDisabled: false,
        };

        this.addVideoLink = this.addVideoLink.bind(this)
        this.recordAndUploadVideo = this.recordAndUploadVideo.bind(this)
        this.publish = this.publish.bind(this)
    }

    componentDidMount() {
        if (!this.props.isNew) {
            var campaignId = this.props.match.params.id
            socket.emit('campaigns::get', campaignId, (error, resp) => {
                if (resp) {
                    this.setState({
                        id: resp._id,
                        title: resp.name,
                        description: resp.description,
                        campaignVideoList: resp.videos,
                        inputDisabled: true                  // Used to avoid modifications on title and description
                    });
                } else {
                    console.log(error)
                }
            })
        }
    }

    publish(model) {
        // Create a new campaign if it is new
        if (!this.state.id && this.props.isNew) {

            feathersClient.service('campaigns').create({
                name: model.title,
                description: model.description,
                videos: this.state.campaignVideoList
            }).then(campaignCreateResonse => {
                this.props.history.goBack();
            })

            // Update the campaign if is not new
        } else if (this.state.id && !this.props.isNew) {
            feathersClient.service('campaigns').update(
                // Id
                this.state.id,
                // Object
                {
                    name: model.title,
                    description: model.description,
                    videos: this.state.campaignVideoList
                }
            ).then().then(campaignsUpdateResonse => {
                this.props.history.goBack();
            });
        }
    }

    addVideoLink() {
        if (this.state.inputVideoLink.trim() !== "") {
            // TODO 
            // Validation and extraction with regexp
            var videoId;
            var videoType;
            if(this.state.inputVideoLink.includes("youtu")){
                videoId = this.state.inputVideoLink.replace("https://www.youtube.com/watch?v=", "").split("&")[0]
                videoId = videoId.replace("https://youtu.be/", "").split("&")[0]
                videoType = "youtube"
            }else{
                videoId = this.state.inputVideoLink.replace("https://vimeo.com/", "").split("&")[0]
                videoType = "vimeo"
            }
           

            this.setState({
                campaignVideoList: this.state.campaignVideoList.concat([{videoId,videoType}]),
                inputVideoLink: ''
            })
        }
    }

    recordAndUploadVideo() {
        var self = this;
        window.clipchamp({
            title: 'Add new campaign video',
            logo: 'https://www.materialui.co/materialIcons/editor/publish_48px.svg',
            color: '#3a6467',
            output: 'youtube',
            enable: [
                'no-thank-you',                 // close widget after upload and skip final 'Thank you' screen
                'no-user-retry',                // directly upload video after finishing recording
                'mobile-webcam-format-fallback' // use inline recorder in Chrome on Android
            ],
            youtube: {
                title: self.state.title,
                description: self.state.title
            },

            onUploadComplete: function (data) {
                self.setState({
                    campaignVideoList: self.state.campaignVideoList.concat([data.id]),
                })
            }
        }
        ).open();
    }

    updateInputValue(event) {
        this.setState({
            inputVideoLink: event.target.value
        });
    }

    updateTitleValue(value) {
        this.setState({
            title: value
        });
    }

    mapInputs(inputs) {
        return {
            'title': inputs.title,
            'description': inputs.description,
        }
    }

    render() {
        const history = this.props.history
        let { title, description } = this.state

        return (
            <div className="container-fluid page-layout">
                <div className="row justify-content-md-center">
                    <div className="col-md-auto">

                        <GoBackButton history={history} />

                        <h1>Create new campaign video</h1>

                        <Form onSubmit={this.publish} mapping={this.mapInputs} onChange={this.change} layout='vertical'>
                            <div className="form-group">
                                <Input
                                    name="title"
                                    label="Title"
                                    id="title-input"
                                    ref="title"
                                    type="text"
                                    value={title}
                                    placeholder="E.g. Climate change."
                                    validations="minLength:10"
                                    disabled={(this.state.inputDisabled) ? "disabled" : ""}
                                    validationErrors={{
                                        minLength: 'Please provide at least 10 characters.'
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <Input
                                    name="description"
                                    label="Description"
                                    id="description-input"
                                    ref="description"
                                    type="text"
                                    value={description}
                                    disabled={(this.state.inputDisabled) ? "disabled" : ""}
                                    placeholder="Describe your campaing ..."
                                    validations="minLength:10"
                                    validationErrors={{
                                        minLength: 'Please provide at least 10 characters.'
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-group input-group">
                                <span className="input-group-btn">
                                    <button className="btn btn-secondary" type="button" onClick={this.addVideoLink.bind(this)}>
                                        <div className="svg-icon svg-baseline">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                <path d="M3 2v2h12V2H3zm0 9h3v5h6v-5h3L9 5l-6 6z" />
                                            </svg>
                                        </div>
                                        Add video link
                                    </button>
                                </span>
                                <input
                                    name="videoLink"
                                    id="video-link"
                                    ref="videoLink"
                                    type="text"
                                    value={this.state.inputVideoLink}
                                    placeholder="Youtube or Vimeo link..."
                                    className="form-control"
                                    onChange={event => this.updateInputValue(event)}
                                />
                            </div>


                            <div className="form-group">
                                <div className="btn-group" role="group" >
                                    <button type="button" className="btn btn-secondary" onClick={this.recordAndUploadVideo.bind(this)}>
                                        <div className="svg-icon svg-baseline">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                            </svg>
                                        </div>
                                        Add new video
                                    </button>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="btn-group" role="group" >
                                    <button className="btn btn-success" type="submit">
                                        <div className="svg-icon svg-baseline">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                <path d="M3 2v2h12V2H3zm0 9h3v5h6v-5h3L9 5l-6 6z" />
                                            </svg>
                                        </div>
                                        Publish
                                </button>
                                </div>
                            </div>

                            <ul className="list-group">
                                {
                                    this.state.campaignVideoList.map(function (listValue) {
                                        return (
                                            <li className="list-group-item" key={listValue.videoId}> 
                                                <div className="embed-container row">
                                                    {
                                                        listValue.videoType === "youtube" ?
                                                            <iframe type="text/html" width="120" height="90" src={"https://www.youtube.com/embed/" + listValue.videoId} title={listValue.videoId} frameBorder="0"> </iframe>
                                                        :
                                                            <iframe type="text/html" src={"https://player.vimeo.com/video/" + listValue.videoId} title={listValue.videoId} width="120" height="90" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
                                                    
                                                    }
                                                </div>
                                            </li>
                                        )  
                                    })
                                }
                            </ul>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewCampaign

NewCampaign.propTypes = {
    history: PropTypes.object.isRequired,
    isNew: PropTypes.bool.isRequired,
}