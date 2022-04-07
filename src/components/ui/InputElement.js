import React, { useState, forwardRef } from 'react';
import {
  EyeIcon,
  EyeOffIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

const InputElement = forwardRef(
  (
    { id, name, type, placeholder, value, onChange, className, errorPassword },
    ref
  ) => {
    const [visible, setVisible] = useState(false);

    const handleShowPassword = () => {
      setVisible(!visible);
    };

    return (
      <>
        {type === 'text' ? (
          <input
            autoComplete='nope'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
          />
        ) : type === 'password' ? (
          <div>
            <input
              autoComplete='nope'
              id={id}
              name={name}
              type={visible ? 'text' : 'password'}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={className}
              ref={ref}
            />
            {!errorPassword && !visible && (
              <EyeIcon
                className='w-5 h-5 mt-0.88rem mr-3 absolute top-0 right-0 opacity-30'
                aria-hidden='true'
                onClick={handleShowPassword}
              />
            )}
            {visible && (
              <EyeOffIcon
                className='w-5 h-5 mt-0.88rem mr-3 absolute top-0 right-0 opacity-30'
                aria-hidden='true'
                onClick={handleShowPassword}
              />
            )}

            {errorPassword && (
              <ExclamationCircleIcon
                className='w-5 h-5 text-danger mt-0.88rem ml-3 mr-3 absolute top-0 right-0'
                aria-hidden='true'
              />
            )}
          </div>
        ) : type === 'checkbox' ? (
          <input
            autoComplete='nope'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
          />
        ) : type === 'textarea' ? (
          <textarea
            autoComplete='nope'
            id={id}
            name={name}
            rows='4'
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
          />
        ) : type === 'number' ? (
          <input
            autoComplete='nope'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
          />
        ) : (
          ''
        )}
      </>
    );
  }
);

export default InputElement;
