import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Table } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import useWindowSize from '../../../hooks/useWindowSize';

const Repetitions = ({ statsList, loading }) => {
  const size = useWindowSize();

  const getTotalQuiz = () => {
    let totalCount = 0;
    statsList.forEach((item) => {
      totalCount += item.stats.length;
    });
    return totalCount;
  };

  return (
    <ComponentContainer>
      <Col className='count-wrapper' xs={12}>
        <h5>Total Repetitions: {getTotalQuiz()}</h5>
        <h5>Total Vocabulary: {statsList.length}</h5>
      </Col>
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
              name: 'Repetitions',
              selector: (row, index) => row.stats.length,
              sortable: true,
              center: true,
            },
          ]}
          data={statsList}
          expandableRows={size.width > 600 ? false : true}
          expandableRowsComponent={(data) => (
            <ExpandableComponent data={data} />
          )}
          pagination
        />
      </Col>
    </ComponentContainer>
  );
};

export default React.memo(Repetitions);

const ComponentContainer = styled(Row)`
  .count-wrapper {
    display: flex;
    flex-direction: column;
    h5 {
      margin: 1rem 0 0 1rem;
      &:last-child {
        margin-left: 1rem;
      }
    }
    @media (min-width: 600px) {
      flex-direction: row;
      h5 {
        &:last-child {
          margin-left: 2rem;
        }
      }
    }
  }
`;

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
