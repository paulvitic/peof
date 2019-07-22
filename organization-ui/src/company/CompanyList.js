// https://hackernoon.com/how-to-turn-react-component-into-native-web-component-84834315cb24
// https://reactjs.org/docs/web-components.html

/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */
import ReactDOM from 'react-dom';
import React from 'react';
import { ReactCompanyList } from "../components/company"

class CompanyList extends HTMLElement {
    constructor() {
        console.log('Constructing’');
        super();
    }

    connectedCallback() {
        console.log('Connecting’');
        ReactDOM.render(<ReactCompanyList />, this);
    }

    disconnectedCallback(){
        console.log('Disconnectinb’');
        ReactDOM.unmountComponentAtNode(this);
    }

    static log(...args) {
        console.log('🔘 company-list', ...args);
    }

}

export default CompanyList;
