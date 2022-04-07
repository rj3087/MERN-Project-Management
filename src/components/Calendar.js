import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import { CalendarIcon } from '@heroicons/react/outline';

const Calendar = ({ dateVal }) => {
  const [startDate, setStartDate] = useState(dateVal);
  const [toggleCalendar, setToggleCalendar] = useState(false);

  const HandleShowCalendar = () => {
    setToggleCalendar(!toggleCalendar);
    console.log(startDate);
  };

  return (
    <>
      <motion.div className='w-22 ml-auto relative'>
        <div
          className='px-4 py-5 flex flex-row border rounded-md cursor-pointer'
          onClick={HandleShowCalendar}
        >
          {moment(startDate).format('L')}
          <CalendarIcon
            className={`w-4 h-4 ${
              toggleCalendar ? 'text-primary opacity-100' : 'opacity-50'
            } ml-auto cursor-pointer z-20 hover:text-primary hover:opacity-100`}
            aria-hidden='true'
            onClick={HandleShowCalendar}
          />
        </div>
        <div className='mt-2 ml-4 absolute z-50'>
          {toggleCalendar && (
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              inline
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Calendar;
