import React, { Component } from 'react';

class ReportViewer extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount() {
        window.jQuery('#reportViewer1')
            .telerik_ReportViewer({
                serviceUrl: '5.189.170.55:81/api/reports/SRS',
                reportSource: {
                    report: 'SRSTest.trdp'
                },
                scale: 1.0,
                viewMode: 'INTERACTIVE',
                printMode: 'SPECIFIC',
                sendEmail: { enabled: true }
            });
    }


    render(){
        return(
            <div id="reportViewer1"></div>
        )
    }
}

export default ReportViewer;