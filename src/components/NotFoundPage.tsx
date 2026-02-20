import { TbError404 } from "react-icons/tb";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#fcfcfc] p-6">
      <div className="flex-shrink-0">
        <TbError404 className="text-[150px] sm:text-[200px] text-gray-300" />
      </div>

      <div className="mt-8 md:mt-0 md:ml-12 max-w-md text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-black mb-4">
          Oops, something went wrong.
        </h1>
        <p className="text-lg sm:text-xl font-manropeMedium text-gray-800">
          We can’t find the page you are looking for.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
