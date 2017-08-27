import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoBackButton from '../GoBackButton'
import { Form, Input } from 'formsy-react-components'

class newCampaign extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            title: '',
            description: '',
            src: null,
            blob: null,
            showPlayer: false
        };

        this.uploadVideo = this.uploadVideo.bind(this)
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

        const history = this.props.history;

        let { title, description } = this.state

        return (
            <div className="container-fluid page-layout">
                <div className="row justify-content-md-center">
                    <div className="col-md-auto">

                        <GoBackButton history={history} />

                        <h1>Create new campaign video</h1>

                        <Form onSubmit={this.uploadVideo} mapping={this.mapInputs} onChange={this.change} layout='vertical'>
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
                                    placeholder="Describe your campaing video..."
                                    validations="minLength:10"
                                    validationErrors={{
                                        minLength: 'Please provide at least 10 characters.'
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <button type="button " className="btn btn-secondary" onClick={this.recordVideo.bind(this)}>
                                    <div className="svg-icon svg-baseline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                    Add video
                                </button>
                            </div>

                            {this.state.showPlayer ? <video id="video-player" src={this.state.src} controls></video> : null}

                            <div>
                                <button className="btn btn-secondary" type="submit">
                                    <div className="svg-icon svg-baseline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                            <path d="M3 2v2h12V2H3zm0 9h3v5h6v-5h3L9 5l-6 6z" />
                                        </svg>
                                    </div>
                                    Publish
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default newCampaign

newCampaign.propTypes = {
    history: PropTypes.object.isRequired,
};