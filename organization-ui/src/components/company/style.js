import styled from 'styled-components';
import PropTypes from 'prop-types';

export const StyledButton = styled.button`
  background-color: ${props => props.primary ? '#e0e1e2' : 
    'white' };
  color: ${props => props.alert ? 'rgba(255, 105, 94, .9)' : 
    props.confirm ? '#00a448' : 
      '#606060'}; 
  border: 2px solid ${props => props.primary ? '#e0e1e2' : 
    props.confirm ? '#00a448' : 
      props.alert ? 'rgba(255, 105, 94, .6)' : 
        'none'}; 
  border-radius: 4px;
  
  padding: 8px 19px 8px 19px;
  margin: 0 0.2em;
  position: relative;
  display: inline-block;

  text-align: center;
  text-decoration: none;
  text-transform: none;
  text-shadow: none;
  
  font-family: inherit;
  font-weight: 600;
  font-size: 14px;
  
  transition: opacity .6s ease, background-color .6s ease, border .6s ease, color .8s ease;
  
  cursor: pointer; 
  outline:none;
  
    :hover {
      background-color: ${props => props.primary ? '#cacbcd' :
    props.confirm ? 'rgba(0, 164, 72, .4)' :
      props.alert ? 'rgba(255, 105, 94, .4)' :
        'none'}; 
      color: ${props => props.primary ? '#33322D' :
    props.confirm ? 'rgba(0, 164, 72, 1)' :
      props.alert ? 'rgba(255, 105, 94, 1)' :
        'none'};
      border: 2px solid ${props => props.primary ? '#cacbcd' :
    props.confirm ? 'rgba(0, 164, 72, .1)' :
      props.alert ? 'rgba(255, 105, 94, .1)' :
        'none'};
    }
`;

StyledButton.propTypes = {
  primary:PropTypes.bool,
  confirm:PropTypes.bool,
  alert:PropTypes.bool,
};


