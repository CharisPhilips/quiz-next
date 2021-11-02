import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import useWindowSize from '../../../hooks/useWindowSize';

const CorrectAnswers = ({ statsList, loading }) => {
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
              name: 'Correct Answers',
              selector: (row, index) => row.correct_answers,
              sortable: true,
              center: true,
              style: { whiteSpace: 'wrap' },
              cell: (row) => (
                <div className='text-success'>{row.correct_answers}</div>
              ),
            },
          ]}
          data={statsList.map((item) => {
            return {
              ...item,
              correct_answers: item.stats.filter(
                (itemOne) => itemOne.answer_vocabulary === 1
              ).length,
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

export default React.memo(CorrectAnswers);

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
