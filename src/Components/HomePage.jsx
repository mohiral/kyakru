import React from 'react'
import FrdataThird from './FrDataThird'
import FrDataFirst from './FrDataFirst'
import ResultsTable from './FrDataFourth';
import FrDataSecond from './FrDataSecond';
// import FrDataFive from './FrDataFive';

function HomePage() {
  return (
    <>

        <FrDataFirst/>
        <FrDataSecond/>
        <FrdataThird/>
        <ResultsTable/>
        {/* <FrDataFive/> */}
    </>
  )
}

export default HomePage;