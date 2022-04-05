import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Input, Modal } from 'antd';
import '../sell.css';
import Variantform from './Variantform';
const { Search } = Input;
import FeatherIcon from 'feather-icons-react';
import { getCategoryWiseAllProductList } from '../../../redux/products/actionCreator';

const MenuItemList = (props) => {
  const observer = useRef();
  let [allProductData, setAllProductData] = useState(props.productData);

  let searchArr = allProductData.filter((value) =>
    value.product_name.toLowerCase().includes(props.search.toLowerCase())
  );

  const [modalVisible, setModelVisible] = useState(false);

  return (
    <>
      <Row>
        {searchArr.length > 0
          ? searchArr.map((value, index) => {
              return (
                <Col
                  xs={12}
                  xl={6}
                  className="sell-table-col"
                  key={index}
                  onClick={() => setModelVisible(true)}
                >
                  <div className="sell-main">
                    <div className="sell-table-title">{value.product_name}</div>
                  </div>
                </Col>
              );
            })
          : ''}
      </Row>
      <Modal
        title="Select Option"
        visible={modalVisible}
        onOk={() => setModelVisible(false)}
        onCancel={() => setModelVisible(false)}
        width={600}
      >
        <Variantform />
      </Modal>
    </>
  );
};

export { MenuItemList };
