import React, { useContext } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { AppContext } from '../../../context/store';
import { VOCABULARY_TRANSLATE_ANSWER } from '../../../constants';

const CorrectAnswers = ({ rankingList, loading }) => {
  const { state } = useContext(AppContext);

  return (
    <Row>
      <Col xs={12}>
        <DataTable
          progressPending={loading}
          columns={[
            {
              name: '#',
              cell: (row, index) => index + 1,
              width: '64px',
              maxWidth: '64px',
            },
            {
              name: 'Users',
              selector: (row, index) => row.nickname,
              sortable: true,
              left: true,
              cell: (row) => (
                <h6
                  className={
                    state.auth.id === row.id ? 'text-success' : 'text-dark'
                  }
                  style={{ margin: 0 }}
                >
                  {state.auth.id === row.id ? 'You' : row.nickname}
                </h6>
              ),
            },
            {
              name: 'Correct Answers',
              selector: (row, index) =>
                row.answers.filter(
                  (item) =>
                    item.answer_vocabulary ===
                    VOCABULARY_TRANSLATE_ANSWER.CORRECT
                ),
              sortable: true,
              center: true,
              maxWidth: '180px',
              cell: (row) => (
                <div
                  className={
                    state.auth.id === row.id ? 'text-success' : 'text-dark'
                  }
                  style={{ fontSize: '16px' }}
                >
                  {row.correct_answers}
                </div>
              ),
            },
          ]}
          data={rankingList.map((item) => {
            return {
              ...item,
              correct_answers: item.answers.filter(
                (itemOne) => itemOne.answer_vocabulary === 1
              ).length,
            };
          })}
          pagination
        />
      </Col>
    </Row>
  );
};

export default CorrectAnswers;
