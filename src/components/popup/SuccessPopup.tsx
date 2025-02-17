import { CiCircleCheck } from "react-icons/ci";

type SuccessPopupProps = {
  message: string;
  onConfirm: () => void;
};

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 text-center bg-card rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="">
            <CiCircleCheck  size={60}/>
          </div>
        </div>
        <h4 className="mb-4 text-md">
          {message}
        </h4>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="w-1/3 px-4 py-2 font-semibold  rounded-xl duration-300 bg-orange500 hover:bg-orange600 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
