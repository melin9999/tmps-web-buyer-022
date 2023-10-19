import Navbar from '@/components/headers/Navbar';
import React from 'react';

const RootPage = () => {
  return (
    <>
      <Navbar search={false} applyFilters={null}/>
      <div className='mt-[80px] h-[1000px]'>Root Page</div>
    </>
  );
};

export default RootPage;