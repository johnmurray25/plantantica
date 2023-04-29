import React from 'react'

const ExpandedSection = () => {
  return (
    <div></div>
  )
}

export default ExpandedSection
// import React from 'react'

// const ExpandedSection = () => {
//     return (
//         <>
//             <div className='px-4 '>
//                 <div className=" flex justify-center pr-4 py-1 text-lg">
//                     <div>
//                         <div className='futura text-sm flex items-center text-gray-100 text-opacity-60'>
//                             <>
//                                 Water every&nbsp;
//                             </>
//                             <DaysBetweenWateringToggle plant={plant} updateDaysBetweenWatering={updateDaysBetweenWatering} setDaysBetweenWatering={setDaysBetweenWatering} setWaterNext={setWateringStatus} getWaterNext={getWateringStatus} userID={userID} />
//                             &nbsp;
//                             days
//                         </div>
//                     </div>
//                 </div>
//                 {/* Instructions & Updates buttons */}
//                 <div className='relative'>
//                     {/* <button
//                                             className={`absolute top-0 left-2 text-sm hover:bg-gray-900 rounded-full py-1 px-5  text-primary futura
//                             ${!needsWater ? "border-white " : " hover:text-gray-200"}
//                             ${plant && plant.careInstructions ? "opacity-100 cursor-pointer" : "hidden"}
//                             `}
//                                             style={{ transition: 'background-color 0.4s ease' }}
//                                             onClick={() => setShowInstructions(!showInstructions)}
//                                         >
//                                             Instructions
//                                             &nbsp;
//                                             {showInstructions ? <span>&nbsp;&darr;</span> : <span>&rarr;</span>}
//                                         </button> */}
//                     <div className="flex justify-end items-center text-sm mt-1">
//                         <button
//                             className="futura mr-2 py-0.5 px-4 mt-3 text-dark text-opacity-60 bg-gray-100 bg-opacity-30 shadow-sm rounded-full text-lg
//                                 hover:bg-primary hover:bg-opacity-20 hover:text-green-100 transition-colors"
//                             onClick={() => setShowUpdates(!showUpdates)}
//                         >
//                             Updates
//                         </button>
//                         <button
//                             className="bg-green-700 hover:bg-lime-600 bg-opacity-80 text-gray-200 text-opacity-80 text-2xl shadow-sm rounded-full h-fit //py-0.5 px-2 
//                                  //hover:bg-opacity-60 //hover:text-green-900  mt-3 transition-colors"
//                             onClick={() => props.goToAddUpdateScreen(plant?.id)}
//                         >
//                             +
//                         </button>
//                     </div>
//                 </div>
//                 {/* Instructions: */}
//                 {/* <div
//                                         // layout
//                                         // animate={{ height: (!showInstructions || !height ? "0" : height / 15) || "auto" }}
//                                         className={`text-primary text-opacity-80 mb-2 py-2 pr-40 ${showInstructions ? 'opacity-100' : 'opacity-0 h-0'} transition-all ease-linear duration-100`}>
//                                         {plant?.careInstructions}
//                                     </div> */}
//                 {/* Updates: */}
//                 {showUpdates && plant &&
//                     <div className="w-full">
//                         <ResizablePanel>
//                             {isLoadingUpdates ?
//                                 <div className="flex justify-center w-full">
//                                     <ReactLoading type='bars' color="#FFF7ED" />
//                                 </div>
//                                 :
//                                 <TimelineInCard
//                                     plantId={plant.id}
//                                     {...{ updates }}
//                                     species={plant.species}
//                                     uid={userID}
//                                     key={plant.id + "_timeline"}
//                                     width={0.97 * (width || 400) / 2}
//                                     height={0.97 * (width || 400) / 2}
//                                 />
//                             }
//                         </ResizablePanel>
//                     </div>
//                 }
//                 <button
//                     className="w-full  flex justify-center items-center text-primary text-opacity-60 text-xl py-1 mt-2"
//                     onClick={() => setExpanded(false)}
//                 >
//                     <div className='bg-gray-100 bg-opacity-30 px-6 rounded-t-full '>
//                         <IoChevronUp className='text-dark text-opacity-60' />
//                     </div>
//                 </button>
//             </div>
//         </>
//     )
// }

// export default ExpandedSection