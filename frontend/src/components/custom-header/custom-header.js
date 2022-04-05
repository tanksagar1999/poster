import React,{ Component } from 'react';
import PropTypes, { nominalTypeHack } from 'prop-types';
import { Layout,Col,Row} from 'antd';
const { Header} = Layout;
import { CustomHeaderStyle } from './style';


const CustomHeader = props => {
  const { title, buttons} = props;
  return (
    <>

    
      <Row style={{   zIndex: '999999',
                      background: '#fff',
                       padding: '14px',
                      marginBottom: '15px',
                      position:'relative'}}>
          <Col  span={12} ><h1>{title}</h1></Col>
        <Col span={12}>{buttons}</Col>
       </Row>
        </>
       
    );
};

CustomHeader.propTypes = {
   title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
   buttons: PropTypes.array,
 };



export {CustomHeader};