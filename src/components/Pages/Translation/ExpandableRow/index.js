import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faMinusCircle,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import DeletePopover from '../../../DeletePopover';
import { AppContext } from '../../../../context/store';
import useWindowSize from '../../../../hooks/useWindowSize';

const ExpandableRow = ({ idx, rowData, deleteTranslation }) => {
  const { state } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  const size = useWindowSize();
  useEffect(() => {
    if (size.width >= 992) setExpanded(false);
  }, [size.width]);
  return (
    <>
      <ParentRow key={`parent-row-${rowData.id}`}>
        <td className='td-md-show'>
          {expanded ? (
            <Button
              className='btn-action'
              variant='danger'
              size='sm'
              onClick={() => {
                setExpanded(false);
              }}
            >
              <FontAwesomeIcon icon={faMinusCircle} />
            </Button>
          ) : (
            <Button
              className='btn-action'
              variant='primary'
              size='sm'
              onClick={() => {
                setExpanded(true);
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </Button>
          )}
        </td>
        <td className='td-no'>{idx + 1}</td>
        <td>{rowData.vocabulary_1}</td>
        <td>{rowData.vocabulary_2}</td>
        <td className='td-md-hide'>{rowData.sentence_1}</td>
        <td className='td-md-hide'>{rowData.quizlist.name}</td>
        <td className='td-md-hide'>
          {moment(rowData.created_at).format('YYYY-MM-DD, HH:mm')}
        </td>
        <td className='td-md-hide'>
          {moment(rowData.updated_at).format('YYYY-MM-DD, HH:mm')}
        </td>
        <td className='action-td'>
          <div className='d-flex align-items-center justify-content-between'>
            <Button
              className='btn-action'
              variant='success'
              size='sm'
              onClick={() => {
                Router.push(`/translation/edit/${rowData.id}`);
              }}
              disabled={state.auth.id !== rowData.user_id}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
              <span className='btn-text'>Edit</span>
            </Button>
            <DeletePopover
              btnOptions={{
                size: 'sm',
                disabled: state.auth.id !== rowData.user_id,
              }}
              onOk={deleteTranslation}
              wrapplerClass='btn-action'
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              <span className='btn-text'>Delete</span>
            </DeletePopover>
          </div>
        </td>
      </ParentRow>
      <ChildRow key={`child-row-${rowData.id}`}>
        <td colSpan={5}>
          {expanded && (
            <div className='expand-wrapper'>
              <div>Sentence:</div>
              <div>
                <b>{rowData.sentence_1}</b>
              </div>
              <div>List:</div>
              <div>
                <b>{rowData.quizlist.name}</b>
              </div>
              <div>Created:</div>
              <div>
                <b>{moment(rowData.created_at).format('YYYY-MM-DD, HH:mm')}</b>
              </div>
              <div>Updated:</div>
              <div>
                <b>{moment(rowData.updated_at).format('YYYY-MM-DD, HH:mm')}</b>
              </div>
            </div>
          )}
        </td>
      </ChildRow>
    </>
  );
};

export default ExpandableRow;

const ParentRow = styled.tr`
  .btn-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    .fa-plus-circle {
      width: 15px;
      height: 15px;
      color: white;
    }
    .fa-minus-circle {
      width: 15px;
      height: 15px;
      color: white;
    }
    .fa-pencil-alt {
      width: 15px;
      height: 15px;
      margin-right: 0.5rem;
    }
    .fa-trash-alt {
      width: 15px;
      height: 15px;
      margin-right: 0.5rem;
    }
    .btn-dropdown {
      display: flex;
      align-items: center;
    }
  }
  @media (max-width: 991px) {
    .btn-action {
      .btn-text {
        display: none;
      }
      .fa-pencil-alt,
      .fa-trash-alt {
        margin-right: 0;
      }
    }
  }
`;

const ChildRow = styled.tr`
  display: none;
  @media (max-width: 991px) {
    display: table-row;
  }

  td {
    padding: 0;
  }

  .expand-wrapper {
    padding: 1rem;
    display: grid;
    grid-template-columns: [first] 100px 1fr;
  }
`;
