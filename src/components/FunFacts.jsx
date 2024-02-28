const FunFacts = () => {
    return (
      <div className="w-full h-[35rem] relative top-10 md:h-64  divide-x-2 flex_center">
        <div className="grid w-[60%]   divide-x-2  gap-2  place-items-center grid-cols-1 md:grid-cols-3 ">
          <div className="bg-white rounded-lg w-[100%]  h-44 shadow-md p-2"> 
            <h2 className="text-3xl font-bold text-blue-500">60+ লাখ</h2>
            <p className="text-lg text-gray-500">অ্যাপ ডাউনলোড</p>
          </div>
          <div className="bg-white rounded-lg w-[100%] h-44 shadow-md p-2">
            <h2 className="text-3xl font-bold text-blue-500">৭ কোটি+</h2>
            <p className="text-lg text-gray-500">সফল ট্রিপ/অর্ডার</p>
          </div>
          <div className="bg-white rounded-lg w-[100%] h-44 shadow-md p-2">
            <h2 className="text-3xl font-bold text-blue-500">60+ লাখ</h2>
            <p className="text-lg text-gray-500">মানুষের অগ্রযাত্রায়</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FunFacts;
  