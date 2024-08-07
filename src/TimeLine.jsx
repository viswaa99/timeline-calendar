import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './App.css';
const ZOOM_LEVELS = {
  HOUR: {
    width: 50,
    unit: 'Hours',
    step: 6,
    format: (date) => `${date.getHours()}:00`,
  },
  DAY: {
    width: 100,
    unit: 'Days',
    step: 1,
    format: (date) =>
      `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`,
  },
  WEEK: {
    width: 200,
    unit: 'Days',
    step: 1,
    format: (date) =>
      `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`,
  },
  MONTH: {
    width: 300,
    unit: 'Months',
    step: 1,
    format: (date) => date.toLocaleString('default', { month: 'long' }),
  },
  QUARTER: {
    width: 400,
    unit: 'Months',
    step: 3,
    format: (date) => `Q${Math.floor(date.getMonth() / 3) + 1}`,
  },
  YEAR: {
    width: 500,
    unit: 'FullYear',
    step: 1,
    format: (date) => date.getFullYear().toString(),
  },
};

export default function Timeline() {
  const [zoomLevel, setZoomLevel] = useState('DAY');
  const [dateVal, setDateVal] = useState({});
const [dateBlocks , setDateBlocks] = useState([]);
  const handleChangeZoom = (level) => {
    setZoomLevel(level);
  };

  console.log(dateBlocks,"debug")

  useEffect(
    function setDates() {
      handleSetDates(zoomLevel);
    },
    [zoomLevel]
  );

  useEffect(
    function onGenerateDates() {
    if(!dateVal.startDate || !dateVal.endDate) return
      setDateBlocks(
        generateDates(
          zoomLevel,
          new Date(
            dateVal.startDate.format('MM/DD/YYYY') || '08/01/2022'
          ).toISOString(),
          new Date(
            dateVal.endDate.format('MM/DD/YYYY') || '09/16/2024'
          ).toISOString()
        )
      );
    },
    [dateVal.startDate,
    dateVal.endDate,zoomLevel]
  );

  console.log(
    dateVal.startDate?.format('MM/DD/YYYY'),
    dateVal.endDate?.format('MM/DD/YYYY'),
    'Dates$'
  );
  function handleSetDates(mode) {
    let startDate = '';
    let endDate = '';
    switch (mode) {
      case 'HOUR':
        startDate = moment().subtract(1, 'month');
        endDate = moment().add(1, 'month');
        setDateVal({ startDate, endDate });
        break;
      case 'DAY':
        case 'WEEK':
        startDate = moment().subtract(6, 'month');
        endDate = moment().add(6, 'month');
        setDateVal({ startDate, endDate });
        break;
      case 'MONTH':
      case 'QUARTER':
        startDate = moment().subtract(3, 'year');
        endDate = moment().add(3, 'year');
        setDateVal({ startDate, endDate });
        break;
      case 'YEAR':
        startDate = moment().subtract(15, 'year');
        endDate = moment().add(15, 'year');
        setDateVal({ startDate, endDate });
        break;
      default:
        break;
    }
  }

 

  console.log(dateBlocks);
  function generateDates(mode, startDate, endDate) {
    const dateBlocks = [];

    for (let i = startDate; i <= endDate; ) {
      const formattedDate = ZOOM_LEVELS[mode].format(new Date(i));
      const groupLabel = getGroupLabel(i, mode);
      if (
        !dateBlocks.length ||
        dateBlocks[dateBlocks.length - 1].group !== groupLabel
      ) {
        dateBlocks.push({
          group: groupLabel,
          dates: [formattedDate],
        });
      } else {
        dateBlocks[dateBlocks.length - 1].dates.push(formattedDate);
      }
      console.log(
        addTime(i, ZOOM_LEVELS[mode].unit, ZOOM_LEVELS[mode].step).format()
      );
      i = new Date(
        addTime(i, ZOOM_LEVELS[mode].unit, ZOOM_LEVELS[mode].step).format()
      ).toISOString();
    }

    return dateBlocks;
  }

  function addTime(date, mode, step) {
    const newDate = new Date(date);
    switch (mode) {
      case 'Hours':
        return moment(newDate).add(step, 'hours');
      case 'Days':
      case 'Week':
        return moment(newDate).add(step, 'days');
      case 'Months':
        return moment(newDate).add(step, 'months');
      case 'FullYear':
        return moment(newDate).add(step, 'years');
      default:
        throw new Error('Invalid time unit for adding time');
    }
  }

  function getGroupLabel(date, mode) {
    switch (mode) {
      case 'HOUR':
        return moment(date).format('D MMM');
      case 'DAY':
        return moment(date).format('MMM YYYY');
      case 'WEEK':
        return moment(date).startOf('week').format('MMM DD YYYY');
      case 'MONTH':
      case 'QUARTER':
        return moment(date).format('YYYY');
      case 'YEAR':
        return '';
      default:
        return '';
    }
  }

  console.log(dateBlocks);

  return (
    <div>
      <div className='zoom-controls'>
        {Object.keys(ZOOM_LEVELS).map((level) => (
          <button key={level} onClick={() => handleChangeZoom(level)}>
            {level}
          </button>
        ))}
      </div>
      <div className='container'>
        <div className='header-container'>
          {dateBlocks.map((block, index) => (
            <div key={index} className='date-group'>
              <div className='group-header'>{block.group}</div>
              <div className='dates'>
                {block.dates.map((date, idx) => (
                  <div
                    key={idx}
                    style={{ width: ZOOM_LEVELS[zoomLevel].width }}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
