import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoBackButton from '../GoBackButton'
import { Form, Input } from 'formsy-react-components'
import { socket,feathersClient } from '../../lib/feathersClient'


class NewCampaign extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            title: '',
            description: '',
            blob: null,
            showPlayer: false,
            inputValue: '',
            list: [],
            disabled: false,
            id : null
        };

        this.uploadVideo = this.uploadVideo.bind(this)
        this.addVideoLink = this.addVideoLink.bind(this)
        this.recordUploadVideo = this.recordUploadVideo.bind(this)
        this.publish = this.publish.bind(this)

      /*  feathersClient.service('campaigns').remove().then(() => {
            this.setState({ campaigns: [] })
      });*/
      
    }

    componentDidMount() {
        if (!this.props.isNew) {
            var currentId= this.props.match.params.id
            socket.emit('campaigns::get', currentId , (error, resp) => {
                if (resp) {

                    console.log("I get it!:" )
                    console.log(resp)

                    this.setState({
                        title: resp.name,
                        description: resp.description,
                        list: resp.videos,
                        id: resp._id,
                        disabled: true
                    });
                } else {
                    console.log(error)
                }
            })
        }
    }

    publish(model) {

        if(!this.state.id && this.props.isNew){
            // here we just call one method on client service instead of assigning it to "campaigns" const
            // these values are all retreived from test files
            feathersClient.service('campaigns').create({
                name: model.title,
                description: model.description,
                videos: this.state.list
          })
          this.props.history.goBack();
        }else if (this.state.id && !this.props.isNew){
            const campaigns = feathersClient.service('campaigns');
            campaigns.update(this.state.id,
                {
                    name: model.title,
                    description: model.description,
                    videos: this.state.list
              }
            ).then( campaignsResonse => {
              const campaigns = campaignsResonse.data;
              this.setState({campaigns});
              console.log(this.state.campaigns)
            }).then(campaignsResonse => {
                console.log(campaignsResonse)
                this.props.history.goBack();
            });
        }
       


        
    }

    addVideoLink() {

        if (this.state.inputValue.trim() !== "") {
            var videoId = this.state.inputValue.replace("https://www.youtube.com/watch?v=", "").split("&")[0]
            videoId = videoId.replace("https://youtu.be/", "").split("&")[0]
            console.log(videoId)
            this.setState({
                list: this.state.list.concat([videoId]),
                inputValue: ''
            })
        }


    }

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
    }

    recordUploadVideo() {
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
                title: this.state.title,
                description: this.state.title
            },

            onUploadComplete: function (data) {
                console.log("onUploadComplete:" + data.id)
                self.setState({
                    list: self.state.list.concat([data.id]),
                })
            }
        }
        ).open();
    }

    recordVideo() {
        var self = this;
        window.clipchamp({
            title: 'Create new campaign video',
            logo: 'https://www.materialui.co/materialIcons/editor/publish_48px.svg',
            color: '#3a6467',
            output: 'blob',
            enable: [
                'no-thank-you',                 // close widget after upload and skip final 'Thank you' screen
                'no-user-retry',                // directly upload video after finishing recording
                'mobile-webcam-format-fallback' // use inline recorder in Chrome on Android
            ],
            onVideoCreated: function (outputVideoBlob) {
                self.setState({ showPlayer: true });
                self.setState({ blob: outputVideoBlob });
                self.setState({ src: window.URL.createObjectURL(outputVideoBlob) });
            }
        }
        ).open();
    }

    uploadVideo(model) {
        var self = this;

        if (!this.state.blob)
            return;

        window.clipchamp({
            logo: 'https://www.materialui.co/materialIcons/editor/publish_48px.svg',
            title: 'Uploading, please wait...',
            color: '#3a6467',
            inputs: ['direct'],
            direct: { files: [this.state.blob] },
            output: 'youtube',
            enable: [
                'no-user-retry',    // directly upload video after finishing recording
                'no-thank-you',     // close widget after upload and skip final 'Thank you' screen
            ],
            youtube: {
                title: model.title,
                description: model.title
            },

            onUploadComplete: function (video) {
                self.props.history.goBack();
            }
        }
        ).open();
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
        const { isNew, history } = this.props
     
        if(isNew)
            console.log("new")

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
                                    disabled = {(this.state.disabled)? "disabled" : ""}
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
                                    disabled = {(this.state.disabled)? "disabled" : ""}
                                    placeholder="Describe your campaing video..."
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
                                    name="youtubeLink"
                                    id="youtube-link"
                                    ref="youtubeLink"
                                    type="text"
                                    value={this.state.inputValue}
                                    placeholder="Youtube link..."
                                    className="form-control"
                                    onChange={evt => this.updateInputValue(evt)}
                                />
                            </div>

                            <div className="form-group">
                                <div className="btn-group" role="group" >
                                    <button type="button" className="btn btn-secondary" onClick={this.recordUploadVideo.bind(this)}>

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
                                    this.state.list.map(function (listValue) {
                                        return <li className="list-group-item" key={listValue}> <div className="embed-container row"> <iframe type="text/html" width="120" height="90"
                                            src={"http://www.youtube.com/embed/" + listValue} title={listValue} frameBorder="0">
                                        </iframe>
                                        </div></li>;

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