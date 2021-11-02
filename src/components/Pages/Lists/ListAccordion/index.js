import React, { useState, useEffect, useContext, useRef } from 'react';
import { CSVLink } from 'react-csv';
import Router from 'next/router';
import moment from 'moment';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  Accordion,
  Card,
  Form,
  Table,
  Button,
  Modal,
  Spinner,
  Dropdown,
  OverlayTrigger,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPlus,
  faTrashAlt,
  faPencilAlt,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import ListEditModal from '../ListEditModal';
import AddTransToListModal from '../../../SharedComponents/AddTransToListModal';
import FullSpinner from '../../../SharedComponents/FullSpinner';
import DeletePopover from '../../../DeletePopover';
import {
  getListTranslationAPI,
  deleteQuizListAPI,
  getToken,
  deleteTranslationAPI,
} from '../../../../apis';
import { AppContext } from '../../../../context/store';
import * as ACTION_TYPE from '../../../../context/types';

const PAGE_LIMIT = 10;

const ListAccordion = ({
  listData,
  activeListId,
  updateList,
  deleteQuizList,
}) => {
  const refCSVLink = useRef();
  const { state } = useContext(AppContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState([]);
  const [pagination, setPagination] = useState(0);

  let componentedMounted = true;

  useEffect(() => {
    if (activeListId === listData.id) {
      setPagination(0);
      getListTranslationAPI(listData.id, state.auth.id)
        .then((res) => {
          if (componentedMounted) {
            setTranslations([...res.data]);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (componentedMounted) {
            setTranslations([]);
            setLoading(false);
          }
        });
    }
    return () => {
      componentedMounted = false;
    };
  }, [activeListId]);

  const deleteQuizListFunc = () => {
    deleteQuizListAPI(listData.id)
      .then((res) => {
        deleteQuizList(listData.id);
      })
      .catch((err) => {
        console.log('Delete Quiz List');
        console.log(err);
      });
  };

  const downloadJSON = async () => {
    setDownloadLoading(true);
    try {
      const res = await getListTranslationAPI(listData.id, state.auth.id);
      const fileName = `${listData.user.nickname} - ${moment().format(
        'YYYY-MM-DD HH-mm-ss'
      )}.json`;
      const json = JSON.stringify({ ...listData, translations: res.data });
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
    setDownloadLoading(false);
  };

  const downloadExcel = async () => {
    setDownloadLoading(true);
    const res = await getListTranslationAPI(listData.id, state.auth.id);

    let translationBody = '';
    res.data.forEach((item) => {
      translationBody += `<tr><td>${item.vocabulary_1}</td><td>${
        item.vocabulary_2
      }</td><td>${item.sentence_1 || ''}</td><td colspan="2">${
        item.sentence_2 || ''
      }</td></tr>`;
    });

    const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
    const worksheet = 'Sheet1';
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charSet=UTF-8">
    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body>
    <body link="#0563C1" vlink="#954F72">
      <table>
        <thead>
          <tr>
            <th colspan="5" style="font-size: 18pt; height: 25pt; text-align: center;  vertical-align: middle; border: 0.5pt solid black;">
              Username: ${state.auth.nickname}
            </th>            
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="5" style="font-size: 16pt; height: 23pt; text-align: center;  vertical-align: middle; border: 0.5pt solid black;">List</td></tr>
          <tr>
            <td style="font-size: 14pt">Name</td>
            <td style="font-size: 14pt">Language ID 1</td>
            <td style="font-size: 14pt">Language Name 1</td>
            <td style="font-size: 14pt">Language ID 2</td>
            <td style="font-size: 14pt">Language Name 2</td>            
          </tr>
          <tr>
            <td>${listData.name}</td>
            <td>${listData.language_1.id}</td>
            <td>${listData.language_1.language_name}</td>
            <td>${listData.language_2.id}</td>
            <td>${listData.language_2.language_name}</td>
          </tr>
          <tr><td colspan="5" style="font-size: 16pt; height: 23pt; text-align: center;  vertical-align: middle; border: 0.5pt solid black;">Translations</td></tr>
          <tr>
            <td style="font-size: 15pt">Vocabulary 1</td>
            <td style="font-size: 15pt">Vocabulary 2</td>
            <td style="font-size: 15pt">Sentence 1</td>
            <td colspan="2" style="font-size: 15pt">Sentence 2</td>
          </tr>
          ${translationBody}
        </tbody>
      </table>
    </body></html>
    `;

    const link = document.createElement('a');
    link.href = uri + base64(template);
    link.target = '_blank';
    link.download = `${state.auth.nickname}-${moment().format(
      'YYYY-MM-DD HH-mm-ss'
    )}.xls`;
    link.click();
    setDownloadLoading(false);
  };

  const [csvData, setCSVData] = useState([]);

  const downloadCSV = async () => {
    setLoading(true);
    const res = await getListTranslationAPI(listData.id, state.auth.id);
    const datas = [];
    datas.push([`Username: ${state.auth.nickname}`]);
    datas.push([`List`]);
    datas.push([
      'Name',
      'Language Id 1',
      'Language 1',
      'Language Id 2',
      'Language 2',
    ]);
    datas.push([
      listData.name,
      listData.language_1.id,
      listData.language_1.language_name,
      listData.language_2.id,
      listData.language_2.language_name,
    ]);
    datas.push(['Translations']);
    datas.push(['Vocabulary 1', 'Vocabulary 2', 'Sentence 1', 'Sentence 2']);

    res.data.map((item) => {
      datas.push([
        item.vocabulary_1,
        item.vocabulary_2,
        item.sentence_1,
        item.sentence_2,
      ]);
    });

    setCSVData([...datas]);
    setTimeout(() => {
      refCSVLink.current.link.click();
      setLoading(false);
    }, 1000);
  };

  const showLoginSwal = () => {
    Swal.fire({
      title: 'Please log in',
      text: '',
      icon: 'warning',
      confirmButtonText: 'Ok',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) Router.push('/login');
    });
  };

  const deleteTranslation = (translationId) => {
    deleteTranslationAPI(translationId)
      .then((res) => {
        setTranslations([
          ...translations.filter((item) => item.id !== translationId),
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ComponentWrapper>
        <ListItemHeader>
          <ListItemContent>
            <Accordion.Toggle
              className='accordion-toggle'
              as='div'
              variant='link'
              eventKey={listData.id}
            >
              <h6>
                {listData.name}{' '}
                <span
                  style={{
                    fontSize: '12px',
                    color: 'grey',
                  }}
                >{`(${listData.language_1.language_name} to ${listData.language_2.language_name})`}</span>
              </h6>
            </Accordion.Toggle>
            <div className='list-summary'>
              {listData.user && (
                <span
                  className='username'
                  style={{
                    color:
                      state.auth.id === listData.user.id ? 'green' : 'grey',
                    fontWeight:
                      state.auth.id === listData.user.id ? 600 : 'normal',
                  }}
                >
                  {state.auth.id === listData.user.id ? (
                    <>
                      Created by <b>You</b>
                    </>
                  ) : (
                    <>
                      Created by <b>{listData.user.nickname}</b>
                    </>
                  )}
                </span>
              )}
              <span className='translation-count'>
                Translations: {listData.translation_count}
              </span>
            </div>
          </ListItemContent>

          <ListItemCtrlWrapper>
            <Dropdown className='btnDropdown'>
              <Dropdown.Toggle variant='outline-primary'>
                <FontAwesomeIcon icon={faDownload} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    if (getToken()) downloadJSON();
                    else showLoginSwal();
                  }}
                >
                  Download Json
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    if (getToken()) downloadExcel();
                  }}
                >
                  Download Excel
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    if (getToken()) downloadCSV();
                  }}
                >
                  Download CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='btnDropdown'>
              <Dropdown.Toggle variant='outline-primary'>
                <FontAwesomeIcon icon={faPlay} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    Router.push(`/quiz/standard/${listData.id}`);
                  }}
                >
                  Standard Mode
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    Router.push(`/quiz/small-keyboard/${listData.id}`);
                  }}
                >
                  Small Keyboard Mode
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    Router.push(`/quiz/one-of-four/${listData.id}`);
                  }}
                >
                  1 of 4
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div
              className={`btn-add-translation ${
                state.auth.id !== listData.user_id ? 'btn-disable' : ''
              }`}
              onClick={() => {
                Router.push(`/translation/create/quizlist/${listData.id}`);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div
              className={`btn-edit ${
                state.auth.id !== listData.user_id ? 'btn-disable' : ''
              }`}
              onClick={() => {
                setShowEditModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </div>
            <DeletePopover
              btnClass='btn-list-delete'
              btnOptions={{
                disabled:
                  listData.role === 0 || state.auth.id !== listData.user_id,
              }}
              onOk={() => {
                if (listData.role === 0) return;
                deleteQuizListFunc();
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </DeletePopover>
          </ListItemCtrlWrapper>
        </ListItemHeader>

        <Accordion.Collapse eventKey={listData.id}>
          <Content>
            {loading ? (
              <Spinner
                className='spinner'
                animation='border'
                variant='primary'
              />
            ) : (
              <>
                {!translations || translations.length === 0 ? (
                  <h6>This list has not translation.</h6>
                ) : (
                  <>
                    {translations && (
                      <>
                        <Table>
                          <thead>
                            <tr>
                              <th>No.</th>
                              <th>Vocabulary 1</th>
                              <th style={{ textAlign: 'center' }}>
                                Vocabulary Translation
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {translations.map((itemOne, idx) => {
                              if (
                                idx < pagination * PAGE_LIMIT ||
                                idx >= (pagination + 1) * PAGE_LIMIT
                              )
                                return null;
                              return (
                                <tr key={itemOne.id}>
                                  <td>{idx + 1}</td>
                                  <td>{itemOne.vocabulary_1}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    {itemOne.vocabulary_2}
                                  </td>
                                  <td>
                                    <div className='d-flex align-items-center justify-content-end'>
                                      <Button
                                        className='btn-table-txt-ctrl'
                                        variant='outline-primary'
                                        size='sm'
                                        onClick={() => {
                                          Router.push(
                                            `/translation/edit/${itemOne.id}`
                                          );
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <DeletePopover
                                        btnClass='btn-table-txt-ctrl'
                                        btnOptions={{ size: 'sm' }}
                                        onOk={() => {
                                          deleteTranslation(itemOne.id);
                                        }}
                                      >
                                        Delete
                                      </DeletePopover>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
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
                            pageCount={Math.ceil(
                              translations.length / PAGE_LIMIT
                            )}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            initialPage={0}
                            forcePage={pagination}
                            onPageChange={(event) => {
                              setPagination(event.selected);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Content>
        </Accordion.Collapse>
      </ComponentWrapper>
      <CSVLink
        style={{ textDecoration: 'none' }}
        data={csvData}
        fileName={`${state.auth.nickname}-${moment().format(
          'YYYY-MM-DD HH-mm-ss'
        )}.csv`}
        target='_blank'
        ref={refCSVLink}
      />

      {showEditModal && (
        <ListEditModal
          showModal={showEditModal}
          closeModal={() => setShowEditModal(false)}
          listData={listData}
          updateList={updateList}
        />
      )}
      {downloadLoading && <FullSpinner />}
    </>
  );
};

export default React.memo(ListAccordion);

const ComponentWrapper = styled(Card)``;

const ListItemHeader = styled(Card.Header)`
  display: flex;

  .accordion-toggle {
    display: flex;
    flex: 1 1 100%;
    cursor: pointer;
    color: #0d6efd;
    > h6 {
      display: flex;
      flex-direction: column;
      span {
        margin: 5px 0 0 0;
      }
      @media (min-width: 992px) {
        flex-direction: row;
        span {
          margin: 0 0 0 1rem;
        }
      }
    }
  }

  .list-summary {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    span {
      color: grey;
      font-weight: normal;
      &.username {
      }
      &.translation-count {
        margin: 0;
      }
    }

    @media (min-width: 600px) {
      flex-direction: row;
      span {
        &.translation-count {
          margin: 0 0 0 2rem;
        }
      }
    }
  }
`;

const ListItemCtrlWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0;
  margin-left: 20px;
  flex: 0 0 80px;
  justify-content: center;

  @media (min-width: 600px) {
    width: auto;
    flex-wrap: nowrap;
  }

  .btnDropdown {
    flex: 0 0 15px;
    width: 15px;
    height: 15px;
    margin: 1rem 0 0 1rem;
    .dropdown-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      outline: none;
      box-shadow: none;
      background-color: transparent !important;
      .fa-download {
        width: 15px;
        height: 15px;
        color: #0d6efd !important;
      }
      .fa-play {
        width: 15px;
        height: 15px;
        color: #0dcaf0 !important;
      }
      &:after {
        display: none;
      }
    }
    .dropdown-menu.show {
      margin-top: 5px !important;
    }
  }

  .btn-add-translation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 15px;
    margin: 1rem 0 0 1rem;
    width: 15px;
    height: 15px;
    cursor: pointer;
    color: #198754;
    svg {
      width: 15px;
      height: 15px;
    }
  }

  .btn-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 15px;
    margin: 1rem 0 0 1rem;
    width: 15px;
    height: 15px;
    cursor: pointer;
    color: #ffc107;
    svg {
      width: 15px;
      height: 15px;
    }
  }

  .btn-list-delete {
    flex: 0 0 15px;
    margin: 1rem 0 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15px;
    height: 15px;
    cursor: pointer;
    padding: 0;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: none !important;

    svg {
      width: 15px;
      height: 15px;
      color: #dc3545;
    }

    &:disabled {
      svg {
        cursor: auto !important;
        color: grey !important;
        pointer-events: none !important;
      }
    }
  }

  .btn-disable {
    cursor: auto !important;
    color: grey !important;
    pointer-events: none !important;
  }
`;

const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

const ListTitle = styled(Accordion.Toggle)`
  flex: 1 1 100%;
  margin-right: 10px;
`;

const Content = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  .spinner {
    margin-left: auto;
    margin-right: auto;
  }
`;
