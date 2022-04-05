import React, { useState, useRef } from "react";
import { Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import PrintDetails from "./print";
import { removeItem } from "../../../utility/localStorageControl";
import ReactDOMServer from "react-dom/server";
import { getItem } from "../../../utility/localStorageControl";

const Model = (props) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onBeforeGetContent: handleOnBeforeGetContent,
  });

  const handleOk = () => {
    props.onOk();

    window.frames[
      "print_frame"
    ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <PrintDetails
        categoryDetails={props.data}
        ReceiptNumber={props.ReceiptNumber}
        text="Cancel By"
        label="CANCELLED ITEMS"
      />
    );
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();

    if (
      getItem("print_server_copy") !== null &&
      getItem("print_server_copy") == true
    ) {
      window.frames[
        "print_frame"
      ].document.body.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <PrintDetails
          categoryDetails={props.data}
          ReceiptNumber={props.ReceiptNumber}
          text="Cancel By"
          label="CANCELLED ITEMS"
          title="SERVER COPY"
        />
      );
      window.frames["print_frame"].window.focus();
      window.frames["print_frame"].window.print();
    }
    // handlePrint()
  };

  return (
    <>
      <Modal
        title="Clear Receipt"
        visible={props.visible}
        onOk={handleOk}
        onCancel={() => props.onCancel()}
        {...props}
      >
        {props.children}
      </Modal>

      <PrintDetails
        ref={componentRef}
        categoryDetails={props.data}
        ReceiptNumber={props.ReceiptNumber}
        text="Cancel By"
        label="CANCELLED ITEMS"
      />
    </>
  );
};

export default Model;
