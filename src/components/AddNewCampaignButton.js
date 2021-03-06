import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class AddNewCampaignButton extends Component {
    render() {
        return (
            <Link to="/new">
                <button type="button" className="btn btn-circle btn-success">
                    <div className="center-block">
                        <svg className="svgIcon" width="48px" height="48px" viewBox="0 0 48 48">
                            <path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z" fill="white" />
                        </svg>
                    </div>
                </button>
            </Link>
        )
    }
}

export default AddNewCampaignButton