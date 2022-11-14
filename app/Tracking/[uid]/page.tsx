// "use client"
import React, { Suspense } from "react";
import ReactLoading from 'react-loading';

// import auth from '../../../firebase/auth';
import TrackingPage from "../TrackingPage";

const Tracking = ({ searchParams }) => {
  console.log("rendering Tracking")
  // const [user] = useAuthState(auth)

  return (
    <div className='text-yellow min-w-screen bg-green' /**Container */>
      <div className='min-h-screen p-4 pt-28 flex flex-col items-center m-auto mt-0'>
        {/* {user && */}
        <Suspense fallback={<ReactLoading type='bars' />}>
          <TrackingPage uid={searchParams.uid} />
        </Suspense>
      </div>
    </div >
  );
};

export default Tracking;
