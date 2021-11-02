import React, { useState, useEffect, useRef, useContext } from 'react';
import * as XLSX from 'xlsx';
import Router from 'next/router';
import moment from 'moment';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Accordion,
  Card,
  Form,
  Table,
  Button,
  Modal,
  Spinner,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import ListAccordion from '../../components/Pages/Lists/ListAccordion';
import ListEditModal from '../../components/Pages/Lists/ListEditModal';
import FullSpinner from '../../components/SharedComponents/FullSpinner';
import {
  filterQuizlistAPI,
  createQuizListAPI,
  createTranslationAPI,
  getTranslationAPI,
  getToken,
} from '../../apis';
import { AppContext } from '../../context/store';
import * as ACTION_TYPE from '../../context/types';

const LIST_TABS = {
  ALL: {
    id: 0,
    label: 'All',
  },
  MYLISTS: {
    id: 1,
    label: 'My Lists',
  },
  PUBLICLISTS: {
    id: 2,
    label: 'Public Lists',
  },
};

const PAGINATION_LIMIT = 10;

const lists = () => {
  const { state } = useContext(AppContext);
  const { auth } = state;

  const inputRefJson = useRef(null);
  const inputRefCSV = useRef(null);
  const inputRefExcel = useRef(null);

  const [curTab, setCurTab] = useState(LIST_TABS.ALL.id);
  const [quizlist, setQuizlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [activeListId, setActiveListId] = useState(-1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: PAGINATION_LIMIT,
  });

  const getQuizList = ({
    user_id = auth.id,
    list_type = LIST_TABS.ALL.id,
    paginationParam = null,
  }) => {
    filterQuizlistAPI({
      user_id: user_id,
      list_type: list_type,
      pagination: paginationParam,
    })
      .then((res) => {
        setLoading(false);
        setQuizlist([...res]);
      })
      .catch((err) => {
        setLoading(false);
        setQuizlist([]);
      });
  };

  useEffect(() => {
    getQuizList({ user_id: auth.id, list_type: LIST_TABS.ALL.id });
  }, [auth.id]);

  const updateList = (newList) => {
    const findOne = quizlist.find((item) => item.id === newList.id);
    if (findOne) {
      setQuizlist([
        ...quizlist.map((item) => {
          if (item.id === newList.id) return newList;
          else return item;
        }),
      ]);
    } else {
      setQuizlist([newList, ...quizlist]);
    }
  };

  const deleteQuizList = (itemId) => {
    setQuizlist([...quizlist.filter((item) => item.id !== itemId)]);
  };

  const filterQuizList = () => {
    if (curTab === LIST_TABS.ALL.id) return quizlist;
    else if (curTab === LIST_TABS.MYLISTS.id)
      return quizlist.filter((item) => item.user.id === auth.id);
    else if (curTab === LIST_TABS.PUBLICLISTS.id)
      return quizlist.filter((item) => item.user.id !== auth.id);
    return quizlist;
  };

  const handleChangeJsonFile = (e) => {
    setDownloadLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = async (eventFile) => {
      try {
        const jsonData = JSON.parse(eventFile.target.result);
        const resQuizlist = await createQuizListAPI({
          name: jsonData.name,
          is_public: jsonData.is_public,
          role: 1,
          language_1: jsonData.language_1.id,
          language_2: jsonData.language_2.id,
        });

        const axiosArr = [];
        jsonData.translations.forEach((item) => {
          axiosArr.push(
            createTranslationAPI({
              vocabulary_1: item.vocabulary_1,
              vocabulary_2: item.vocabulary_2,
              sentence_1: item.sentence_1,
              sentence_2: item.sentence_2,
              user_id: auth.id,
              quizlist_id: resQuizlist.id,
            })
          );
        });

        const createTranslates = () => {
          return new Promise((resolve, reject) => {
            Promise.all(axiosArr)
              .then((responses) => {
                resolve(true);
              })
              .catch((err) => {
                reject(false);
              });
          });
        };

        await createTranslates();
        setQuizlist([
          ...quizlist,
          {
            ...resQuizlist,
            user: {
              ...state.auth,
            },
            translation_count: axiosArr.length,
          },
        ]);
        setDownloadLoading(false);
      } catch (err) {
        setDownloadLoading(false);
        Swal.fire({
          title: 'Uploading CSV File Failed',
          text: 'Please check CSV file is suitable to our project.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
      event.target.files = [];
    };
  };

  const handleChangeCSVFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async function (eventFile) {
      try {
        const delim = ',';
        const str = eventFile.target.result;
        const headers = str.slice(0, str.indexOf('\n')).split(delim);
        const rows = str.slice(str.indexOf('\n') + 1).split('\n');

        const newArray = rows.map((row, nIndex) => {
          return row.split(delim);
        });

        const resQuizlist = await createQuizListAPI({
          name: newArray[2][0].replace(/"/g, ''),
          language_1: newArray[2][1].replace(/"/g, ''),
          language_2: newArray[2][3].replace(/"/g, ''),
          is_public: true,
          role: 1,
        });

        const axiosArr = [];
        newArray.map((item, nIndex) => {
          if (nIndex > 4)
            axiosArr.push(
              createTranslationAPI({
                vocabulary_1: item[0].replace(/"/g, ''),
                vocabulary_2: item[1].replace(/"/g, ''),
                sentence_1: item[2].replace(/"/g, ''),
                sentence_2: item[3].replace(/"/g, ''),
                user_id: auth.id,
                quizlist_id: resQuizlist.id,
              })
            );
        });

        const createTranslates = () => {
          return new Promise((resolve, reject) => {
            Promise.all(axiosArr)
              .then((responses) => {
                resolve(true);
              })
              .catch((err) => {
                reject(false);
              });
          });
        };

        if (resQuizlist) {
          await createTranslates();
          setQuizlist([
            ...quizlist,
            {
              ...resQuizlist,
              user: {
                ...state.auth,
              },
              translation_count: axiosArr.length,
            },
          ]);
        } else {
          Swal.fire({
            title: 'Uploading Json File Failed',
            text: 'Please check json file is suitable to our project.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
        setDownloadLoading(false);
      } catch (err) {
        setDownloadLoading(false);
        Swal.fire({
          title: 'Uploading Json File Failed',
          text: 'Please check json file is suitable to our project.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };
    // event.target.files = [];
  };

  const handleChangeExcelFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      setDownloadLoading(true);
      try {
        // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        /* Update state */

        const rows = data.slice(data.indexOf('\n') + 1).split('\n');
        const newArray = rows.map((row, nIndex) => {
          return row.split(',');
        });
        const resQuizlist = await createQuizListAPI({
          name: newArray[2][0],
          language_1: newArray[2][1],
          language_2: newArray[2][3],
          is_public: true,
          role: 1,
        });

        const axiosArr = [];
        newArray.map((item, nIndex) => {
          if (nIndex > 4 && item.length === 5)
            axiosArr.push(
              createTranslationAPI({
                vocabulary_1: item[0],
                vocabulary_2: item[1],
                sentence_1: item[2],
                sentence_2: item[3],
                user_id: auth.id,
                quizlist_id: resQuizlist.id,
              })
            );
        });

        const createTranslates = () => {
          return new Promise((resolve, reject) => {
            Promise.all(axiosArr)
              .then((responses) => {
                resolve(true);
              })
              .catch((err) => {
                reject(false);
              });
          });
        };

        if (resQuizlist) {
          await createTranslates();
          setQuizlist([
            ...quizlist,
            {
              ...resQuizlist,
              user: {
                ...state.auth,
              },
              translation_count: axiosArr.length,
            },
          ]);
        } else {
          Swal.fire({
            title: 'Uploading Excel File Failed',
            text: 'Please check Excel file is suitable to our project.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
        setDownloadLoading(false);
      } catch (err) {
        setDownloadLoading(false);
        Swal.fire({
          title: 'Uploading Excel File Failed',
          text: 'Please check Excel file is suitable to our project.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };
    reader.readAsBinaryString(file);
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

  return (
    <QuizListContainer className='mainContainer'>
      <QuizHead>
        <title>Quiz App Lists</title>
        <meta name='description' content='Quiz App Lists'></meta>
      </QuizHead>
      <Row>
        <TablePageHeader xs={12} className='pageHeader'>
          <h1 className='title'>Lists</h1>
          <div className='btn-wrapper'>
            {auth.id === -1 ? (
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
                    filterQuizList().length / pagination.limit
                  )}
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
            ) : (
              <>
                <DropdownButton
                  id='dropdown-basic-button'
                  title='Import'
                  variant='outline-primary'
                  disabled={auth.id === -1}
                >
                  <Dropdown.Item
                    onClick={() => {
                      if (inputRefJson && inputRefJson.current)
                        inputRefJson.current.click();
                    }}
                  >
                    Import Json
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      if (inputRefExcel && inputRefExcel.current)
                        inputRefExcel.current.click();
                    }}
                  >
                    Import Excel
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      if (inputRefCSV && inputRefCSV.current)
                        inputRefCSV.current.click();
                    }}
                  >
                    Import CSV
                  </Dropdown.Item>
                </DropdownButton>
                <Button
                  variant='primary'
                  onClick={() => {
                    setShowCreateModal(true);
                  }}
                  disabled={auth.id === -1}
                >
                  Create Your Own List
                </Button>
                <input
                  ref={inputRefJson}
                  type='file'
                  hidden
                  accept='application/JSON'
                  onChange={handleChangeJsonFile}
                  onClick={(event) => (event.target.value = null)}
                />
                <input
                  ref={inputRefCSV}
                  type='file'
                  hidden
                  accept='.csv'
                  onChange={handleChangeCSVFile}
                  onClick={(event) => (event.target.value = null)}
                />
                <input
                  ref={inputRefExcel}
                  type='file'
                  hidden
                  accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  onChange={handleChangeExcelFile}
                  onClick={(event) => (event.target.value = null)}
                />
              </>
            )}
          </div>
        </TablePageHeader>
        {auth.id !== -1 && (
          <Col xs={12}>
            <Tabs
              defaultActiveKey={LIST_TABS.ALL.id}
              activeKey={curTab}
              onSelect={(k) => {
                if (k === LIST_TABS.MYLISTS.id && !getToken()) showLoginSwal();
                else {
                  setCurTab(parseInt(k));
                  setPagination({
                    offset: 0,
                    limit: PAGINATION_LIMIT,
                  });
                }
              }}
              style={{ marginBottom: '1rem' }}
            >
              <Tab
                eventKey={LIST_TABS.ALL.id}
                title={LIST_TABS.ALL.label}
              ></Tab>
              <Tab
                eventKey={LIST_TABS.MYLISTS.id}
                title={LIST_TABS.MYLISTS.label}
              ></Tab>
              <Tab
                eventKey={LIST_TABS.PUBLICLISTS.id}
                title={LIST_TABS.PUBLICLISTS.label}
              ></Tab>
            </Tabs>
          </Col>
        )}
        {auth.id !== -1 && (
          <Col xs={12}>
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
                  filterQuizList().length / pagination.limit
                )}
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
        )}

        <Col xs={12}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Spinner
                className='spinner'
                animation='border'
                variant='primary'
              />
            </div>
          ) : (
            <>
              {filterQuizList().length === 0 ? (
                <h4>There is no matched list.</h4>
              ) : (
                <Accordion
                  style={{ width: '100%' }}
                  activeKey={activeListId}
                  onSelect={setActiveListId}
                >
                  {filterQuizList().map((item, idx) => {
                    if (
                      idx < pagination.offset * pagination.limit ||
                      idx > (pagination.offset + 1) * pagination.limit - 1
                    )
                      return null;
                    return (
                      <ListAccordion
                        key={item.id}
                        listData={item}
                        activeListId={activeListId}
                        updateList={updateList}
                        deleteQuizList={deleteQuizList}
                      />
                    );
                  })}
                </Accordion>
              )}
            </>
          )}
        </Col>
      </Row>
      {showCreateModal && (
        <ListEditModal
          showModal={showCreateModal}
          closeModal={() => {
            setShowCreateModal(false);
          }}
          listData={{
            id: -1,
          }}
          updateList={updateList}
        />
      )}
      {downloadLoading && <FullSpinner />}
    </QuizListContainer>
  );
};

export default lists;

const QuizListContainer = styled(Container)`
  .pagination-wrapper {
    justify-content: flex-end;
  }
`;

const TablePageHeader = styled(Col)`
  .btn-wrapper {
    display: flex;
    align-items: center;
    height: 38px;
    margin-left: auto;
    .btn {
      margin-left: 1rem;
    }
    @media (max-width: 599px) {
      .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        border-radius: 0.2rem;
      }
    }
  }
`;
