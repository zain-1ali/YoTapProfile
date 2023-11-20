import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.min.css";
import { AiOutlineCheck } from "react-icons/ai";

const ConfirmModal = ({
  confirmModal,
  handleConfirmModal,
  userdata,
  prflImg,
  downloadVcf,
}) => {
  let screenWidth = screen.width;
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 370,
    width: "100%",
    height: 370,
    display: "flex",
    justifyContent: "center",
    outline: "none",
    borderRadius: "18px",
    backgroundColor: "white",
  };

  let returnSlicedString = (str, numVal) => {
    if (str?.length <= numVal) {
      return str;
    } else {
      return str?.slice(0, numVal) + "...";
    }
  };

  return (
    <div>
      <Modal
        open={confirmModal}
        onClose={() => handleConfirmModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <div className="w-[100%] h-[100%]">
            <div className="w-[100%] flex justify-center mt-5">
              <div className="h-[117px] w-[117px] rounded-full border-[1px] border-[#3B57EE] ">
                <img
                  src={prflImg}
                  alt=""
                  className="w-[115px] h-[115px] rounded-full border-[1px] border-[white]"
                />
              </div>
            </div>
            <div className="w-[100%] flex justify-center mt-[4px] ">
              <h2
                className="text-[28px]  font-[300] text-center w-[90%]"
                style={{
                  fontFamily: "Inter",
                }}
              >
                {returnSlicedString(
                  userdata?.firstName + " " + userdata?.lastName,
                  30
                )}
              </h2>
            </div>

            <div className="w-[100%] flex justify-center ">
              <h2
                className="text-lg font-[300] text-[#4D4444] text-center w-[90%]"
                style={{
                  fontFamily: "Inter",
                }}
              >
                {returnSlicedString(userdata?.jobTitle, 51)}
              </h2>
            </div>
            <div className="w-[100%] flex justify-center  ">
              <h2
                className="text-[15px] font-[300] text-[#4D4444] text-center w-[90%]"
                style={{
                  fontFamily: "Inter",
                }}
              >
                {returnSlicedString(userdata?.company, 51)}
              </h2>
            </div>

            <div className="w-[100%] flex justify-center items-center mt-5">
              <div
                className="w-[165px] h-[53px] rounded-[20px] bg-black flex justify-center items-center text-white cursor-pointer"
                style={{
                  fontFamily: "Inter",
                }}
                onClick={() => downloadVcf()}
              >
                {/* <AiOutlineCheck className="text-[white] text-2xl mr-[2px]" /> */}
                Save Contact
              </div>
            </div>
            <div className="w-[100%] flex justify-center items-center mt-5">
              <h2
                className="text-[#5E6EFD] text-[18px] font-[700] cursor-pointer"
                style={{
                  fontFamily: "Inter",
                }}
                onClick={() => handleConfirmModal()}
              >
                Done
              </h2>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
