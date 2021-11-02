import React, { useState, useEffect, useContext } from 'react';
import { Router } from 'next/router';
import styled from 'styled-components';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import CorrectAnswers from './CorrectAnswers';
import Repetitions from './Repetitions';
import QuizDateRangePicker from '../../SharedComponents/QuizDateRangePicker';
import { getToken, getRankingAPI } from '../../../apis';
import { AppContext } from '../../../context/store';

const RANKING_TABS = {
  CORRECT_ANSWERS: 'Correct Answers',
  MOST_REPETITIONS: 'Most repetitions',
};

const RankingPageContent = ({ children }) => {
  const { state } = useContext(AppContext);
  const [curTab, setCurTab] = useState(RANKING_TABS.CORRECT_ANSWERS);
  const [rankingList, setRankingList] = useState([]);
  const [quizlist, setQuizlist] = useState([]);
  const [loading, setLoading] = useState(true);

  let componentedMounted = true;
  useEffect(() => {
    if (!getToken()) Router.push('/');
    return () => {
      componentedMounted = false;
    };
  }, []);

  const [filterDate, setFilterDate] = useState({
    start: moment().startOf('day'),
    end: moment().endOf('day'),
  });

  const handleChangeDateRange = (start, end) => {
    setFilterDate({ start, end });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resRanking = await getRankingAPI({
          date_range: filterDate,
        });

        if (resRanking.status === 200) {
          const stats = resRanking.data.stats;
          const tempRanking = [];
          resRanking.data.users.map((item) => {
            tempRanking.push({
              ...item,
              answers: stats.filter((itemOne) => itemOne.user_id === item.id),
            });
          });
          setRankingList([...tempRanking]);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
        setRankingList([]);
      }
    };
    loadData();
  }, [filterDate]);

  return (
    <ComponentContainer className='mainContainer quiz-container'>
      {children}
      <Row>
        <Col xs={12} className='pageHeader'>
          <h1 className='title'>Ranking</h1>
          <div className='pageHeaderFilter'>
            <div className='filter-item-wrapper'>
              <QuizDateRangePicker
                wrapperClass='btn-daterange-label'
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
      <Tabs
        defaultActiveKey={RANKING_TABS.CORRECT_ANSWERS}
        activeKey={curTab}
        onSelect={(k) => setCurTab(k)}
      >
        <Tab eventKey={RANKING_TABS.CORRECT_ANSWERS} title='Correct Answers'>
          <CorrectAnswers rankingList={rankingList} loading={loading} />
        </Tab>
        <Tab eventKey={RANKING_TABS.MOST_REPETITIONS} title='Most Repetitions'>
          <Repetitions rankingList={rankingList} loading={loading} />
        </Tab>
      </Tabs>
    </ComponentContainer>
  );
};

export default RankingPageContent;

const ComponentContainer = styled(Container)`
  .pageHeader {
    flex-wrap: wrap;
    @media (min-width: 500px) {
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
        @media (min-width: 500px) {
          flex: 0 0 225px;
        }
        .btn-daterange-label {
          width: 100%;
        }
      }
      @media (min-width: 500px) {
        flex-wrap: nowrap;
        justify-content: flex-end;
      }
    }
  }
`;
