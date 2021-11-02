import React, { useContext } from 'react';
import styled from 'styled-components';
import { Row, Col, Table } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { AppContext } from '../../../context/store';

const Repetitions = ({ rankingList, loading }) => {
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
              name: 'Repetitions',
              selector: (row, index) => row.answers.length,
              sortable: true,
              center: true,
              maxWidth: '140px',
              cell: (row) => (
                <span
                  className={
                    state.auth.id === row.id ? 'text-success' : 'text-dark'
                  }
                  style={{ fontSize: '16px' }}
                >
                  {row.answers.length}
                </span>
              ),
            },
          ]}
          data={rankingList}
          pagination
        />
      </Col>
    </Row>
  );
};

export default React.memo(Repetitions);
