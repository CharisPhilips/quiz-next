import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import moment from 'moment';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  Container,
  Form,
  Table,
  Button,
  Modal,
  Row,
  Col,
} from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import ExpandableRow from '../../components/Pages/Translation/ExpandableRow';
import { getTranslationAPI, deleteTranslationAPI, getToken } from '../../apis';
import { AppContext } from '../../context/store';
import * as ACTION_TYPE from '../../context/types';

const Translation = () => {
  const { state } = useContext(AppContext);
  const [translations, setTranslations] = useState([]);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  let componentedMounted = true;
  useEffect(() => {
    if (!getToken()) Router.push('/');
    getTranslationAPI('all', state.auth.id)
      .then((res) => {
        if (componentedMounted)
          setTranslations([
            ...res.map((item) => {
              if (!!item.quizlist) return item;
              else return { ...item, quizlist: { id: -1, name: '' } };
            }),
          ]);
      })
      .catch((err) => {
        if (componentedMounted) setTranslations([]);
      });

    return () => {
      componentedMounted = false;
    };
  }, []);

  const deleteTranslation = async (selectedId) => {
    deleteTranslationAPI(selectedId)
      .then((res) => {
        setTranslations([
          ...translations.filter((item) => item.id !== selectedId),
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <TranslationComponent className='mainContainer quiz-container'>
      <QuizHead>
        <title>Quiz App Translations</title>
        <meta name='description' content='Quiz App Create Translation' />
      </QuizHead>
      <Row>
        <Col md={12} className='pageHeader'>
          <h1 className='title'>Tranlsations</h1>
          <div className='pageHeaderFilter'>
            <CreateBtn
              variant='primary'
              onClick={() => {
                Router.push('/translation/create');
              }}
              disabled={!getToken()}
            >
              Create Translation
            </CreateBtn>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className='pagination-wrapper'>
            <ReactPaginate
              previousLabel='‹'
              previousClassName='page-item'
              previousLinkClassName='page-link'
              nextLabel='›'
              nextClassName='page-item'
              nextLinkClassName='page-link'
              breakLabel='...'
              breakClassName='page-item'
              breakLinkClassName='page-link'
              pageClassName='page-item'
              pageLinkClassName='page-link'
              containerClassName='pagination'
              activeClassName='active'
              pageCount={translations.length / pagination.limit}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              initialPage={0}
              forcePage={pagination.offset}
              onPageChange={(event) => {
                setPagination({
                  ...pagination,
                  offset: event.selected,
                });
              }}
            />
          </div>
        </Col>
        <Col md={12}>
          <TranslateTable striped bordered hover>
            <thead>
              <tr>
                <th className='td-expand td-md-show'></th>
                <th className='td-no'>No.</th>
                <th>Vocabulary</th>
                <th>Vocabulary Translation</th>
                <th className='td-md-hide'>Sentence</th>
                <th className='td-md-hide'>List</th>
                <th
                  className='td-md-hide'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  Created
                </th>
                <th
                  className='td-md-hide'
                  style={{ width: '150px', minWidth: '150px' }}
                >
                  Updated
                </th>
                <th className='action-td'></th>
              </tr>
            </thead>
            <tbody>
              {translations.map((item, idx) => {
                if (
                  idx < pagination.offset * pagination.limit ||
                  idx > (pagination.offset + 1) * pagination.limit - 1
                )
                  return null;

                return (
                  <ExpandableRow
                    key={idx}
                    idx={idx}
                    rowData={item}
                    deleteTranslation={() => {
                      deleteTranslation(item.id);
                    }}
                  />
                );
              })}
            </tbody>
          </TranslateTable>
        </Col>
      </Row>
    </TranslationComponent>
  );
};

export default Translation;

export const TranslationComponent = styled(Container)`
  .pagination-wrapper {
    justify-content: flex-end;
  }
`;

const CreateBtn = styled(Button)`
  margin: 20px 0;
  @media (max-width: 991px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
  }
`;

const TranslateTable = styled(Table)`
  width: 100%;
  .action-td {
    width: 171px;
    min-width: 171px;
    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  .td-md-show {
    display: none;
  }

  .td-no {
    width: 50px;
    min-width: 50px;
  }

  @media (max-width: 991px) {
    .td-expand {
      width: 50px;
      min-width: 50px;
    }
    .td-md-show {
      display: table-cell;
    }
    .td-md-hide {
      display: none;
    }
    .action-td {
      width: 92px;
      min-width: 92px;
    }
  }
`;
