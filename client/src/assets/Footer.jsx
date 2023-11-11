import React from "react";
import "./Footer.css"

export default function Footer() {
    return (
        <section id="footer-section">
            <div className="row">
                <p>Questions? Call 000-XXX-XXX-XXXX</p>
            </div>
            <div className="footer-link-div">
                <div><a href="https://help.netflix.com/en/node/412">FAQ</a></div>
                <div><a href="https://help.netflix.com/">Help Centre</a></div>
                <div><a href="https://help.netflix.com/legal/termsofuse">Terms of Use</a></div>
                <div><a href="https://help.netflix.com/legal/privacy">Privacy</a></div>
                <div><a href="https://help.netflix.com/legal/corpinfo">Corporate Information</a></div>
                {/* <button className="btn btn-primary">hello</button> */}
            </div>
        </section>
    )
}