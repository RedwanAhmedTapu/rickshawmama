import  { useState, useEffect } from 'react';

const FunFacts = () => {
  const [rickshawCount, setRickshawCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [journeyCount, setJourneyCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const rickshawEl = document.getElementById('rickshawCount');
      const tripEl = document.getElementById('tripCount');
      const journeyEl = document.getElementById('journeyCount');

      if (isElementInViewport(rickshawEl)) {
        increaseCount(setRickshawCount, 20);
      }

      if (isElementInViewport(tripEl)) {
        increaseCount(setTripCount, 7);
      }

      if (isElementInViewport(journeyEl)) {
        increaseCount(setJourneyCount, 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const increaseCount = (setCount, limit) => {
    setCount((prevCount) => {
      const nextCount = prevCount + 0.1;
      return nextCount >= limit ? limit : nextCount;
    });
  };

  return (
    <div className="w-full h-[35rem] relative md:h-44 bg-[#18324D] flex items-center justify-center">
      <div className="grid w-[80%] md:w-[60%] relative top-16 divide-x-2 place-items-center grid-cols-1 md:grid-cols-3 rounded-md bg-slate-50">
        <div id="rickshawCount" className="bg-white w-[100%] flex flex-col gap-y-4 items-center justify-center rounded-t-md rounded-b-md h-44 shadow-md p-2">
          <h2 className="text-3xl font-bold text-blue-500">{rickshawCount.toFixed(1)+"+হাজার"}</h2>
          <p className="text-lg text-gray-500">রিকশামামা</p>
        </div>
        <div id="tripCount" className="bg-white w-[100%] flex flex-col gap-y-4 items-center justify-center h-44 shadow-md p-2">
          <h2 className="text-3xl font-bold text-blue-500">{tripCount.toFixed(1)+"+হাজার"}</h2>
          <p className="text-lg text-gray-500">সফল ট্রিপ/অর্ডার</p>
        </div>
        <div id="journeyCount" className="bg-white w-[100%] flex flex-col gap-y-4 items-center justify-center rounded-r-md rounded-b-md h-44 shadow-md p-2">
          <h2 className="text-3xl font-bold text-blue-500">{journeyCount.toFixed(1)+"+লাখ"}</h2>
          <p className="text-lg text-gray-500">মানুষের অগ্রযাত্রায়</p>
        </div>
      </div>
    </div>
  );
};

export default FunFacts;
