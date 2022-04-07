import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';

import {
  XIcon,
  DeviceMobileIcon,
  DesktopComputerIcon,
  TemplateIcon,
  PencilAltIcon,
  DocumentSearchIcon,
} from '@heroicons/react/outline';

const projectTitleDivMotion = {
  rest: { background: '#fff' },
  hover: {
    background: '#f5f5f5',
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 120,
      ease: 'easeInOut',
    },
  },
};

const SearchProject = forwardRef(
  (
    {
      id,
      name,
      type,
      placeholder,
      className,
      projects,
      projByUrl,
      returnProj,
      selectedProjectId,
    },
    ref
  ) => {
    const [filteredData, setFilteredData] = useState([]);
    const [enteredData, setEnteredData] = useState();
    const [selectedProjType, setSelectedProjType] = useState();
    const [selectedData, setSelectedData] = useState('');
    const [projectByUrl, setProjectByUrl] = useState();
    const [returnProjectName, setReturnProjectName] = useState();

    const HandleOnFilter = (e) => {
      const data = e.currentTarget.value;
      setSelectedData(data);

      setEnteredData(data);

      const newFilterProject = projects.filter((project) => {
        return project.projectName.toLowerCase().includes(data.toLowerCase());
      });

      if (data === '') {
        setFilteredData([]);
      } else {
        setFilteredData(newFilterProject);
      }
    };

    const handleOnSelectedData = (e) => {
      setFilteredData([]);
      setEnteredData('');
      setSelectedData(e.currentTarget.querySelector('p').innerHTML);
      setSelectedProjType(e.currentTarget.querySelector('svg').id);
      selectedProjectId(e.currentTarget.querySelector('p').id);
    };

    const HandleClearSelectedData = () => {
      setSelectedProjType();
      setSelectedData('');
    };

    const clearSelection = () => {
      setReturnProjectName('');
      setProjectByUrl('');
    };

    useEffect(() => {
      if (returnProj) {
        setReturnProjectName(returnProj.projectId.projectName);
      }
    }, [returnProj]);

    useEffect(() => {
      if (projByUrl && projects) {
        setProjectByUrl(projects.find((id) => id._id === projByUrl));
      }
    }, [projByUrl, projects]);

    useEffect(() => {
      if (projectByUrl) {
        selectedProjectId(projectByUrl._id);
      }
    }, [projectByUrl]);

    return (
      <>
        <div className='flex relative'>
          {selectedProjType ? (
            <div className='absolute mt-3.5 ml-4'>
              {selectedProjType === 'Mobile Development' ? (
                <DeviceMobileIcon
                  className='w-5 h-5 mr-2 fill-primary text-primary'
                  aria-hidden='true'
                />
              ) : selectedProjType === 'Web Development' ? (
                <DesktopComputerIcon
                  className='w-5 h-5 mr-2 fill-primary text-primary'
                  aria-hidden='true'
                />
              ) : selectedProjType === 'Design' ? (
                <TemplateIcon
                  className='w-5 h-5 mr-2 fill-primary text-primary'
                  aria-hidden='true'
                />
              ) : (
                <PencilAltIcon
                  className='w-5 h-5 mr-2 fill-primary text-primary'
                  aria-hidden='true'
                />
              )}
            </div>
          ) : (
            <div className='absolute mt-3.5 ml-3'>
              <DocumentSearchIcon
                className='w-5 h-5 mr-2 opacity-30'
                aria-hidden='true'
              />
            </div>
          )}
          <input
            autoComplete='off'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={
              selectedData
                ? selectedData
                : projectByUrl
                ? projectByUrl.projectName
                : returnProjectName
            }
            className={`${className} ${
              selectedProjType ? 'pl-11' : returnProjectName ? 'pl-9' : ''
            }`}
            ref={ref}
            onChange={HandleOnFilter}
            onClick={(e) => clearSelection(e)}
          />
          {selectedData && (
            <div
              className='mt-2 mr-2 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
              onClick={HandleClearSelectedData}
              title='clear'
            >
              <XIcon
                className='w-4 h-4 font-bold opacity-90'
                aria-hidden='true'
              />
            </div>
          )}
        </div>
        {enteredData && (
          <motion.div
            className='bg-white w-full py-2 px-4 absolute shadow-xl rounded-md overflow-hidden'
            style={{ zIndex: 51 }}
          >
            {filteredData &&
              filteredData.map((project, index) => (
                <motion.div
                  key={index}
                  className='mb-2 p-3 flex items-center rounded-md cursor-pointer'
                  initial='rest'
                  whileHover='hover'
                  variants={projectTitleDivMotion}
                  onClick={(e) => handleOnSelectedData(e)}
                >
                  <div>
                    <DeviceMobileIcon
                      id={project.projectCategory}
                      className={`w-5 h-5 mr-2 fill-primary text-primary ${
                        project.projectCategory === 'Mobile Development'
                          ? 'block'
                          : 'hidden'
                      }`}
                      aria-hidden='true'
                    />
                    <DesktopComputerIcon
                      id={project.projectCategory}
                      className={`w-5 h-5 mr-2 fill-primary text-primary ${
                        project.projectCategory === 'Web Development'
                          ? 'block'
                          : 'hidden'
                      }`}
                      aria-hidden='true'
                    />
                    <TemplateIcon
                      id={project.projectCategory}
                      className={`w-5 h-5 mr-2 fill-primary text-primary ${
                        project.projectCategory === 'Design'
                          ? 'block'
                          : 'hidden'
                      }`}
                      aria-hidden='true'
                    />
                    <PencilAltIcon
                      id={project.projectCategory}
                      className={`w-5 h-5 mr-2 fill-primary text-primary ${
                        project.projectCategory === 'Branding'
                          ? 'block'
                          : 'hidden'
                      }`}
                      aria-hidden='true'
                    />
                  </div>
                  <p
                    id={project._id}
                    className={`${project.projectName} text-xs text-grey font-semibold flex flex-col`}
                    style={{ lineHeight: '13px' }}
                  >
                    {project.projectName}
                  </p>
                  {/* <motion.p
                    className='bg-primary bg-opacity-20 text-xxs text-primary font-bold ml-auto py-2 px-3 flex flex-col relative rounded-md'
                    style={{ lineHeight: '13px' }}
                    variants={jobSubTitleMotion}
                  >
                    {project.projectType}
                  </motion.p> */}
                </motion.div>
              ))}
          </motion.div>
        )}
      </>
    );
  }
);

export default SearchProject;
