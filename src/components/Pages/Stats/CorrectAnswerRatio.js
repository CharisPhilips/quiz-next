import React from 'react';
import styled from 'styled-components';
import { Row, Col, Table } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import clsx from 'clsx';
import { getQuizModeTitle } from '../../../utils/smallKeyboard';
import useWindowSize from '../../../hooks/useWindowSize';

const CorreactAnswerRatio = ({ statsList, loading }) => {
  const size = useWindowSize();

  return (
    <Row>
      <Col className='stats-react-data-table' xs={12}>
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
              name: 'Vocabulary ID',
              selector: (row, index) => row.id,
              sortable: true,
              center: true,
              hide: 'sm',
            },
            {
              name: 'Vocabulary',
              selector: (row, index) => row.vocabulary_1,
              sortable: true,
              center: true,
            },
            {
              name: 'Translation',
              selector: (row, index) => row.vocabulary_2,
              sortable: true,
              center: true,
              hide: 'sm',
            },
            {
              name: 'Correct Answers Ratio',
              selector: (row, index) => row.answer_ratio,
              sortable: true,
              center: true,
              cell: (row) => (
                <div
                  className={clsx({
                    'text-success': row.answer_ratio > 0,
                    'text-danger': row.answer_ratio === 0,
                    'text-warning': row.answer_ratio === 'Not tried yet',
                  })}
                >
                  {`${row.answer_ratio} ${
                    row.answer_ratio !== 'Not tried yet' ? '%' : ''
                  }`}
                </div>
              ),
            },
          ]}
          data={statsList.map((item) => {
            let answerRatio = 0;
            const correctAnswers = item.stats.filter(
              (itemOne) => itemOne.answer_vocabulary === 1
            ).length;
            const wrongAnswers = item.stats.filter(
              (itemOne) => itemOne.answer_vocabulary === 0
            ).length;

            if (correctAnswers === 0 && wrongAnswers === 0)
              answerRatio = 'Not tried yet';
            else if (correctAnswers === 0) answerRatio = 0;
            else if (wrongAnswers === 0) answerRatio = 100;
            else
              answerRatio = parseFloat(
                (correctAnswers / (correctAnswers + wrongAnswers)) * 100
              ).toFixed(2);
            return {
              ...item,
              answer_ratio: answerRatio,
            };
          })}
          expandableRows={size.width > 600 ? false : true}
          expandableRowsComponent={(data) => (
            <ExpandableComponent data={data} />
          )}
          pagination
        />
      </Col>
    </Row>
  );
};

export default React.memo(CorreactAnswerRatio);

const ExpandableComponent = ({ data }) => {
  return (
    <ExpandableComponentContainer>
      <div className='label-id'>Vocabulary ID: </div>
      <div>
        <b>{data.data.id}</b>
      </div>
      <div className='label-id'>Translation: </div>
      <div>
        <b>{data.data.vocabulary_2}</b>
      </div>
    </ExpandableComponentContainer>
  );
};

const ExpandableComponentContainer = styled.div`
  display: grid;
  grid-template-columns: [first] 120px 1fr;
  padding: 1rem;
`;
