import styled from 'styled-components';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import { Button } from 'react-bootstrap';

const QuizDateRangePicker = ({
  wrapperClass = '',
  date = { start: moment().startOf('day'), end: moment().endOf('day') },
  anchor = 'left',
  ranges,
  onChange,
}) => {
  const getFilterRangeLabel = () => {
    const today = moment();
    const diff = date.end.diff(date.start, 'days');
    if (diff === 0 && today.diff(date.start, 'days') === 0) return 'Today';
    else if (diff === 0 && today.diff(date.start, 'days') === 1)
      return 'Yesterday';
    else if (diff === 6 && today.diff(date.end, 'days') === 0)
      return 'Last 7 Days';
    else if (diff === 29 && today.diff(date.end, 'days') === 0)
      return 'Last 30 Days';
    else if (
      moment().endOf().diff(today, 'days') === 0 &&
      date.start.diff(moment().startOf('month')) === 0
    )
      return 'This Month';
    else if (
      moment()
        .subtract(1, 'months')
        .startOf('month')
        .diff(date.start, 'days') === 0 &&
      moment().subtract(1, 'months').endOf('month').diff(date.end, 'days') === 0
    )
      return 'Last Month';
    else if (
      moment().endOf().diff(today, 'days') === 0 &&
      date.start.diff(moment().startOf('year')) === 0
    )
      return 'This Year';
    else if (
      moment().subtract(1, 'years').startOf('year').diff(date.start, 'days') ===
        0 &&
      moment().subtract(1, 'years').endOf('year').diff(date.end, 'days') === 0
    )
      return 'Last Year';
    else
      return `${date.start.format('MM/DD/YYYY')} - ${date.end.format(
        'MM/DD/YYYY'
      )}`;
  };

  return (
    <ComponetContainer
      initialSettings={{
        opens: anchor,
        startDate: date.start.toDate(),
        endDate: date.end.toDate(),
        ranges: ranges,
      }}
      onCallback={onChange}
    >
      <FilterLabelButton clssName={wrapperClass} variant='outline-secondary'>
        {getFilterRangeLabel()}
      </FilterLabelButton>
    </ComponetContainer>
  );
};

export default QuizDateRangePicker;

const ComponetContainer = styled(DateRangePicker)``;

const FilterLabelButton = styled(Button)`
  width: 100%;
  min-width: 204px;
  text-align: center;
`;
