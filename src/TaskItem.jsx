import { useState, useEffect, useRef } from 'react';
import './taskitem.css';
import moment from 'moment';
import momenttz from 'moment-timezone';

const initialTasks = [
  { id: 1, name: 'Task 1', start: '2024-07-24', end: '2024-07-25' },
  {
    id: 2,
    name: 'Task 2',
    start: '2024-07-30',
    end: '2024-08-01',
  },
  { id: 3, name: 'Task 3', start: '2024-07-24', end: '2024-08-02' },
];

const ZOOM_LEVELS = {
  HOUR: {
    id:"Hour",
    timeUnit: 80,
    Conv: (60 * 60 * 1000)*6,
    widthUnit: 61 * 24 * 60 * 60 * 1000,
  },
  DAY: {
    id:"Day",
    timeUnit: 80,
    Conv: 24 * 60 * 60 * 1000,
    widthUnit: 183 * 24 * 60 * 60 * 1000,
  },
  WEEK: {
    id:"Week",
    timeUnit: 420,
    Conv: 24 * 7 * 60 * 60 * 1000,
    widthUnit: 500 * 24 * 60 * 60 * 1000,
  },
  MONTH: {
    id:"Month",
    timeUnit: 110,
    Conv: 24 * 30 * 60 * 60 * 1000,
    widthUnit: 548 * 24 * 60 * 60 * 1000,
  },
  QUARTER: {
    id:"Quarter",
    timeUnit: 87,
    Conv: 3 * 24 * 30 * 60 * 60 * 1000,
    widthUnit: 2555 * 24 * 60 * 60 * 1000,
  },
  YEAR: {
    id:"Year",
    timeUnit: 108,
    Conv: 366 * 24 * 30 * 60 * 60 * 1000,
    widthUnit: 7300 * 24 * 60 * 60 * 1000,
  },
};

const hrConv = 60 * 60 * 1000;
const dayConv = 24 * 60 * 60 * 1000;
const timeUnit = 100;
export default function TaskItem({data , index , startDate, zoomValue}) {
  console.log(data,"TaskData")
  const [task, setTask] = useState(data);
  const [zoom, setZoom] = useState(ZOOM_LEVELS[zoomValue].id || 'Day');

  // console.log(ZOOM_LEVELS[zoomValue],"ZMM");
  // const [startDate, setSt] = useState('2024-06-20');
  const [endDate, setEt] = useState('2024-06-09');
  const currentTaskRef = useRef();
  const currentDate = new Date();
  // const startDate = new Date("2024-05-28");
  // const endDate = new Date("2024-06-09");
  // console.log(startDate.toString(), endDate.toString(), 'GL');

  useEffect(
    function initDat() {
      setZoom(ZOOM_LEVELS[zoomValue].id);
    },[zoomValue])

  function convertTimeToDist(time) {
    console.log(time, 'GLL');
    return (time * ZOOM_LEVELS[zoomValue].timeUnit) / ZOOM_LEVELS[zoomValue].Conv;
  }
  function convertDistToTime(dist) {
    return (dist * ZOOM_LEVELS[zoomValue].Conv) / ZOOM_LEVELS[zoomValue].timeUnit;
  }

  const handleChange = (event) => {
    setZoom(event.target.value);
  };

  console.log('DBG', zoom);

  // function computeStartEnd() {
  //   const currentDate = new Date();
  //   setSt(new Date(currentDate.getTime() - ZOOM_LEVELS[zoom].widthUnit));
  //   setEt(new Date(currentDate.getTime() + ZOOM_LEVELS[zoom].widthUnit));
  // }

  // useEffect(
  //   function initDat() {
  //     computeStartEnd();
  //   },
  //   [zoom]
  // );

  function handleMouseDown(e, task, direction) {
     const [timestampStart] = task._start_date.split(' ');
     const [timestampEnd] = task.DueDate.split(' ');
     const width = convertTimeToDist(
       moment(timestampEnd).utc().valueOf() -
         moment(timestampStart).utc().valueOf()
     );   
    e.preventDefault();
    e.stopPropagation();
    const startWidth = e.target.parentElement.offsetWidth;
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
    const startX = e.clientX;
    const startLeft = convertTimeToDist(taskStartDate - startDate);
    currentTaskRef.current = task;
    const onMouseMove = (moveEvent) => {
      console.log(moveEvent.offsetX, 'MV');
      if (direction === 'right') {
        // const newWidth = startWidth + (moveEvent.clientX - startX);
        const diff = moveEvent.clientX - startX;
        const endTime =
          moment(timestampEnd).utc().valueOf() + convertDistToTime(diff);
        task.DueDate = new Date(endTime).toISOString();
      } else if (direction === 'left') {
        // const newWidth = startWidth + (startX - moveEvent.clientX);
        const diff = moveEvent.clientX - startX;
        const startTime =
          moment(timestampStart).utc().valueOf() + convertDistToTime(diff);
        task._start_date = new Date(startTime).toISOString();
      }
      currentTaskRef.current = task;
      setTask({...task});
    };

    const onMouseUp = () => {
      // const startDate = new Date(currentTaskRef.current._start_date);
      // const endDate = new Date(currentTaskRef.current.DueDate);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      console.log(
        {
          start: currentTaskRef.current._start_date,
          end: currentTaskRef.current.DueDate,
        },
        'Datte'
      );
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  console.log(task,"taskData");

  const handleDragStart = (e, task) => {
    e.preventDefault();
    e.stopPropagation();
    const [timestampStart] = task._start_date.split(' ');
    const [timestampEnd] = task.DueDate.split(' ');
    const startX = e.clientX;
    const startLeft = e.target.offsetLeft;
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
    currentTaskRef.current = task;
    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      const startTime =
        moment(timestampStart).utc().valueOf() + convertDistToTime(diff);
      task._start_date = new Date(startTime).toISOString();
      const endTime =
        moment(timestampEnd).utc().valueOf() + convertDistToTime(diff);
      task.DueDate = new Date(endTime).toISOString();
      currentTaskRef.current = task;
      setTask({...task});
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      console.log(
        {
          start: currentTaskRef.current._start_date,
          end: currentTaskRef.current.DueDate,
        },
        'Datte'
      );
    };

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', onMouseUp);
  };

  function renderTasks() {
    console.log("calling");
      const [timestampStart] = task._start_date.split(' ');
      const [timestampEnd] = task.DueDate.split(' ');
      console.log(timestampStart,timestampEnd,"SE")
       const timeDiff =
      convertTimeToDist(moment(timestampStart).utc().valueOf() - moment(startDate).utc().valueOf());
      
      const width = convertTimeToDist(
        moment(timestampEnd).utc().valueOf() -
          moment(timestampStart).utc().valueOf()
      );   
      console.log(convertTimeToDist(timeDiff),timeDiff,"DIFFF");
console.log(timeDiff,width,"Good")
      return (
        <div
          className='task'
          key={task._id}
          style={{
            transform: `translateX(${timeDiff}px)`,
            width: `${width}px`,
          }}
          onMouseDown={(e) => handleDragStart(e, task)}
        >
          {task.Name}
          <div
            className='gantt-task-resize-left'
            onMouseDown={(e) => handleMouseDown(e, task, 'left')}
          />
          <div
            className='gantt-task-resize-right'
            onMouseDown={(e) => handleMouseDown(e, task, 'right')}
          />
        </div>
      );
  }

  return (
    <>
      {/* <div
        className='current-marker'
        id='current-time'
        style={{ left: `${convertTimeToDist(currentDate - new Date(startDate))}px` , zIndex:12 , height:'100vh' }}
      /> */}
      {renderTasks()}
    </>
  );
}
