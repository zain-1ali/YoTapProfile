import React, { useState } from "react";
import iconimg from "../imgs/notFoundBg2.png";
import NotFoundModal from "../assets/components/NotFoundModal";

const NotFound = () => {
  let [modal, setModal] = useState(false);

  let handleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="min-h-[100vh] max-w-[420px] w-[100%] ">
      <NotFoundModal modal={modal} handleModal={handleModal} />
      <div className="w-[96%] shadow-lg min-h-[100vh] border">
        <div className="w-[100%] flex justify-center text-2xl mt-[50px] ">
          Y o t a p
        </div>

        <div className="w-[100%] flex justify-center text-lg mt-[30px] text-[#808080] font-medium">
          Profile Not Found
        </div>

        <div className="w-[100%] relative  h-[200px]">
          <div
            className="w-[100%] absolute top-6  h-[90px]  z-10"
            style={{
              background:
                "linear-gradient(to bottom, #ffffff , rgba(255,255,255,0.7) , rgba(255,255,255,0.0) )",
            }}
          ></div>
          <div
            className="h-[160px] w-[100%]  absolute bottom-0"
            style={{
              backgroundImage: `url(${iconimg})`,
              backgroundSize: "cover",
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        <div className="w-[100%] flex justify-center">
          <div
            className="w-[85%] h-[60px] flex justify-center items-center rounded-full bg-[#f4f4f5] text-lg font-medium mt-[90px] cursor-pointer"
            onClick={() => handleModal()}
          >
            Why am I seeing this ?
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
