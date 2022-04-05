import React from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { NestedDropdwon } from "./auth-info-style";
import { Popover } from "../../popup/popup";
import Heading from "../../heading/heading";

const Support = () => {
  const content = (
    <NestedDropdwon>
      <div className="support-dropdwon">
        <ul>
          <Heading as="h5">Check out our user guide</Heading>
          <li>
            <Link to="#">Getting Started</Link>
          </li>
          <li>
            <Link to="#">Selling</Link>
          </li>
          <li>
            <Link to="#">Manage Products</Link>
          </li>
          <li>
            <Link to="#">More topics</Link>
          </li>
        </ul>

        <ul>
          <Heading as="h5">Need help or support?</Heading>
          <li>
            <Link to="#">Launch live support</Link>
          </li>
          <li>
            <Link to="#">Email to team@poster.com</Link>
          </li>
        </ul>
      </div>
    </NestedDropdwon>
  );

  return (
    <div className="support">
      <Popover placement="bottomLeft" content={content} action="click">
        <Link to="#" className="head-example">
          <FeatherIcon icon="help-circle" size={20} />
        </Link>
      </Popover>
    </div>
  );
};

export default Support;
