import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import clsx from 'clsx';
import Link from 'next/link';
import moment from 'moment';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import Select from 'react-select';
import CorrectAnswers from './CorrectAnswers';
import CorreactAnswerRatio from './CorrectAnswerRatio';
import Repetitiions from './Repetitions';
import QuizDateRangePicker from '../../SharedComponents/QuizDateRangePicker';
import {
  getStatsTranslationAPI,
  getQuizListAPI,
  getToken,
} from '../../../apis';
import { QUIZ_MODES } from '../../../constants';
import { AppContext } from '../../../context/store';
import * as ACTION_TYPE from '../../../context/types';

const STATS_TABS = {
  CORRECT_ANSWERS: 'Correct answers',
  CORRECT_ANSWERS_RATIO: 'Correct answers ratio',
  MOST_REPETITIONS: 'Most repetitions',
};

const StatsPageContent = (props) => {
  const { state } = useContext(AppContext);
  const [curTab, setCurTab] = useState(STATS_TABS.CORRECT_ANSWERS);
  const [quizlistId, setQuizlistId] = useState(props.quizlistId);
  const [quizMode, setQuizmode] = useState(props.quizMode);
  const [filterDate, setFilterDate] = useState({
    start: moment().startOf('day'),
    end: moment().endOf('day'),
  });
  const [statsList, setStatsList] = useState([]);
  const [quizlist, setQuizlist] = useState([]);
  const [loading, setLoading] = useState(true);
  let componentedMounted = true;

  const getStats = async () => {
    try {
      setLoading(true);
      const resStats = await getStatsTranslationAPI({
        user_id: state.auth.id,
        quizlist_id: quizlistId === -1 ? 'all' : parseInt(quizlistId),
        quiz_mode: parseInt(quizMode),
        translation_id: 'all',
        date_range: filterDate,
      });
      if (resStats.data.status === 'Success') {
        setStatsList(
          resStats.data.translations.map((item) => {
            return {
              ...item,
              stats: resStats.data.stats.filter(
                (itemOne) => itemOne.translation_id === item.id
              ),
            };
          })
        );
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setStatsList([]);
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      getQuizListAPI({
        id: null,
        user_id: state.auth.id,
        is_public: true,
      }).then((res) => {
        setQuizlist([
          { value: 'all', label: 'All' },
          ...res.map((item) => {
            return { value: item.id, label: item.name };
          }),
        ]);
      });
    } catch (err) {
      setQuizlist([{ value: 'all', label: 'All' }]);
    }

    return () => {
      componentedMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!getToken()) Router.push('/');
    setLoading(true);
    try {
      const resStats = getStatsTranslationAPI({
        user_id: state.auth.id,
        quizlist_id: quizlistId === -1 ? 'all' : parseInt(quizlistId),
        quiz_mode: parseInt(quizMode),
        translation_id: 'all',
        date_range: filterDate,
      })
        .then((res) => {
          if (res.data.status === 'Success') {
            setStatsList(
              res.data.translations.map((item) => {
                return {
                  ...item,
                  stats: res.data.stats.filter(
                    (itemOne) => itemOne.translation_id === item.id
                  ),
                };
              })
            );
          } else {
            setStatsList([]);
          }
          setLoading(false);
        })
        .catch((err) => {});
    } catch (err) {
      console.log(err);
    }
  }, [quizlistId, quizMode, filterDate]);

  const handleChangeDateRange = (start, end) => {
    setFilterDate({ start, end });
  };

  const getQuizlistSelectValue = () => {
    const findOne = quizlist.find((item) => item.value === quizlistId);
    if (findOne) return findOne;
    else return null;
  };

  return (
    <ComponentContainer className='mainContainer quiz-container'>
      {props.children}
      <Row>
        <Col md={12} className='pageHeader'>
          <h1 className='title'>Stats</h1>
          <div className='pageHeaderFilter'>
            <Form.Control
              className='filter-item-wrapper'
              label='Quiz Mode'
              as='select'
              value={quizMode}
              onChange={(e) => {
                const targetValue = e.target.value;
                if (quizMode === targetValue) return;
                // Router.push(`/stats/${quizlistId}/${targetValue}`);
                setQuizmode(targetValue);
              }}
            >
              <option value={'all'}>All Quiz Mode</option>
              {Object.keys(QUIZ_MODES).map((item, idx) => {
                return (
                  <option key={idx} value={QUIZ_MODES[item].value}>
                    {QUIZ_MODES[item].title}
                  </option>
                );
              })}
            </Form.Control>
            <div className='filter-item-wrapper'>
              <Select
                classNamePrefix='select'
                isSearchable={true}
                value={getQuizlistSelectValue()}
                onChange={(e) => {
                  setQuizlistId(e.value);
                }}
                options={quizlist}
                style={{}}
              />
            </div>
            <div className='filter-item-wrapper date-range-item-wrapper'>
              <QuizDateRangePicker
                wrapperClass='date-range-wrapper'
                opens='left'
                date={{
                  start: filterDate.start,
                  end: filterDate.end,
                }}
                ranges={{
                  Today: [moment().toDate(), moment().toDate()],
                  Yesterday: [
                    moment().subtract(1, 'days').toDate(),
                    moment().subtract(1, 'days').toDate(),
                  ],
                  'Last 7 Days': [
                    moment().subtract(6, 'days').toDate(),
                    moment().toDate(),
                  ],
                  'Last 30 Days': [
                    moment().subtract(29, 'days').toDate(),
                    moment().toDate(),
                  ],
                  'This Month': [
                    moment().startOf('month').toDate(),
                    moment().endOf('month').toDate(),
                  ],
                  'Last Month': [
                    moment().subtract(1, 'month').startOf('month').toDate(),
                    moment().subtract(1, 'month').endOf('month').toDate(),
                  ],
                  'This Year': [
                    moment().startOf('year').toDate(),
                    moment().toDate(),
                  ],
                  'Last Year': [
                    moment().subtract(1, 'year').startOf('year').toDate(),
                    moment().subtract(1, 'year').endOf('year').toDate(),
                  ],
                }}
                onChange={handleChangeDateRange}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Select
        className='select-tab'
        classNamePrefix='select'
        isSearchable={false}
        value={{ value: curTab, label: curTab }}
        onChange={(e) => {
          setCurTab(e.value);
        }}
        options={[
          {
            value: STATS_TABS.CORRECT_ANSWERS,
            label: STATS_TABS.CORRECT_ANSWERS,
          },
          {
            value: STATS_TABS.CORRECT_ANSWERS_RATIO,
            label: STATS_TABS.CORRECT_ANSWERS_RATIO,
          },
          {
            value: STATS_TABS.MOST_REPETITIONS,
            label: STATS_TABS.MOST_REPETITIONS,
          },
        ]}
      />
      <Tabs
        className='stats-answer'
        defaultActiveKey={STATS_TABS.CORRECT_ANSWERS}
        activeKey={curTab}
        onSelect={(k) => setCurTab(k)}
      >
        <Tab eventKey={STATS_TABS.CORRECT_ANSWERS} title='Correct Answers'>
          <CorrectAnswers statsList={statsList} loading={loading} />
        </Tab>
        <Tab
          eventKey={STATS_TABS.CORRECT_ANSWERS_RATIO}
          title='Correct Answers Ratio'
        >
          <CorreactAnswerRatio statsList={statsList} loading={loading} />
        </Tab>
        <Tab eventKey={STATS_TABS.MOST_REPETITIONS} title='Most Repetitions'>
          <Repetitiions statsList={statsList} loading={loading} />
        </Tab>
      </Tabs>
    </ComponentContainer>
  );
};

export default StatsPageContent;

const ComponentContainer = styled(Container)`
  .pageHeader {
    flex-wrap: wrap;
    @media (min-width: 992px) {
      flex-wrap: nowrap;
    }

    .pageHeaderFilter {
      flex: 1 1 100%;
      flex-wrap: wrap;            
      justify-content: flex-start;
      .filter-item-wrapper {
        flex: 1 1 100%;
        height: 40px;
        margin: 1rem 0 0 0;        
        &:first-child {
          margin-left 0;
        }
        &.date-range-item-wrapper {
          flex: 1 1 100%;
          .date-range-wrapper {
            width: 100%;
          }
        }        
      }    
      @media (min-width: 600px) {
        flex-wrap: nowrap;
        .filter-item-wrapper {
          flex: 1 1 100%;
          margin: 1rem 1rem 0 0;        
          &.date-range-item-wrapper {
            flex: 0 0 225px;
            margin-right: 0;
          }
        }
      }
      @media (min-width: 992px) {
        justify-content: flex-end;
        .filter-item-wrapper {
          justify-content: flex-end;
          flex: 0 0 225px;
        }
      }
    }
  }
  .stats-answer {
    display: flex;
    @media (max-width: 520px) {
      display: none;
    }
  }
  .select-tab {
    margin-bottom: 1rem;
    display: block;
    @media (min-width: 520px) {
      display: none;
    }
  }
`;
