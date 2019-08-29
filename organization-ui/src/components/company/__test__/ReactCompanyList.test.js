import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ReactCompanyList  from '../ReactCompanyList';

describe('App', () => {
  it('renders without crashing given the required props', () => {
    const props = {
      primary:true,
      confirm:true,
      alert:true,
      disabled:false,
      onClick:()=>{}
    };
    const wrapper = shallow(<ReactCompanyList {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});