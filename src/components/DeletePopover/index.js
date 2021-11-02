import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useEventListener } from '../../hooks/useEventListener';

const DeletePopover = ({
  wrapplerClass = '',
  btnClass = '',
  onOk,
  btnOptions = {},
  children,
}) => {
  const selfRef = useRef();
  const [collapsed, setCollapsed] = useState(true);

  const onClickOutside = (event) => {
    if (!selfRef.current || selfRef.current.contains(event.target)) {
      return;
    }
    setCollapsed(true);
  };

  useEventListener('click', onClickOutside);
  useEventListener('focusin', onClickOutside);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const dropdownClass = ['btn-dropdown'];
  if (btnClass) dropdownClass.push(btnClass);

  return (
    <DeletePopoverContainer className={wrapplerClass} ref={selfRef}>
      <Button
        className={dropdownClass.join(' ')}
        variant='danger'
        onClick={toggle}
        {...btnOptions}
      >
        {children}
      </Button>
      <div className={`delete-popover-content ${collapsed ? '' : 'open'}`}>
        <h6 className='text-center'>Are you sure?</h6>
        <div className='btn-wrapper'>
          <Button
            className='btn-table-txt-ctrl'
            variant='danger'
            size='sm'
            onClick={onOk}
          >
            Ok
          </Button>
          <Button
            className='btn-table-txt-ctrl'
            variant='outline-secondary'
            size='sm'
            onClick={toggle}
          >
            Cancel
          </Button>
        </div>
      </div>
    </DeletePopoverContainer>
  );
};

export default DeletePopover;

const DeletePopoverContainer = styled.div`
  position: relative;
  display: inline-flex;
  .delete-popover-content {
    width: 146px;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: calc(100% + 8px);
    left: -48px;
    background-color: white;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4.8px;
    display: none;
    z-index: 1;
    opacity: 0;

    &:before {
      content: ' ';
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid rgba(0, 0, 0, 0.2);
      top: -8px;
      left: calc(50% - 8px);
      position: absolute;
    }
    &:after {
      content: ' ';
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid white;
      top: -7px;
      left: calc(50% - 8px);
      position: absolute;
    }
    &.open {
      animation: display-show-opacity 0.3s;
      opacity: 1;
      display: flex;
      z-index: 4;
    }
  }

  .btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      margin: 0 0.25rem;
      font-size: ;
    }
  }
`;
