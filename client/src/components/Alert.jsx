import React from "react";
import Alert from 'react-bootstrap/Alert';

function LinksExample({ message, type }) {
    return (
        <div className="alert-mess">
            <Alert key={type} variant={type}>
                {message}
                <div id="light">
                    <div id="lineh1"></div>
                </div>
            </Alert>
        </div>
    );
}

export default LinksExample;
