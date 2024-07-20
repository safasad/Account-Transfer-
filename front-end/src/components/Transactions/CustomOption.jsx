import React from 'react';
import { components } from 'react-select';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const CustomOption = (props) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${data.value}`}>Balance: {data.balance}</Tooltip>}
      >
        <div>
          {data.label}
        </div>
      </OverlayTrigger>
    </components.Option>
  );
};


export default CustomOption;
