import React from 'react'
import PropTypes from 'prop-types';
import { StyledButton } from "./style";

const ReactCompanyList = (props) => {
    return (
        <StyledButton {...props} onClick={props.onClick}>{props.children}</StyledButton>
    );
};

ReactCompanyList.propTypes = {
    primary:PropTypes.bool,
    confirm:PropTypes.bool,
    alert:PropTypes.bool,
    disabled:PropTypes.bool.isRequired,
    onClick:PropTypes.func.isRequired
};


ReactCompanyList.defaultProps = {
    disabled:false,
    onClick:()=>{}
};

export default ReactCompanyList;
