const FunFacts = () => {
    return (
      <div className="w-full -z-10 h-[35rem] relative    md:h-44 bg-[#18324D]  flex_center ">
        <div className="grid w-[80%] md:w-[60%]  relative top-16  divide-x-2   place-items-center grid-cols-1 md:grid-cols-3 rounded-md bg-slate-50  ">
          <div className="bg-white  w-[100%] flex_col_center rounded-t-md rounded-b-md  h-44 shadow-md p-2"> 
            <h2 className="text-3xl font-bold text-blue-500">২ হাজার+</h2>
            <p className="text-lg text-gray-500">রিকশামামা</p>
          </div>
          <div className="bg-white w-[100%] flex_col_center h-44 shadow-md p-2">
            <h2 className="text-3xl font-bold text-blue-500">৭ হাজার+</h2>
            <p className="text-lg text-gray-500">সফল ট্রিপ/অর্ডার</p>
          </div>
          <div className="bg-white  w-[100%] flex_col_center h-44 shadow-md p-2 rounded-r-md rounded-b-md">
            <h2 className="text-3xl font-bold text-blue-500">১ লাখ+</h2>
            <p className="text-lg text-gray-500">মানুষের অগ্রযাত্রায়</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FunFacts;
  