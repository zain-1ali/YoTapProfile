import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { push, ref, serverTimestamp, update } from "firebase/database";
import { getDownloadURL, uploadBytes, ref as sRef } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { db, storage } from "../../Firebase";

const LeadformModal = ({
  modal,
  handleModal,
  userdata,
  crntUsrAnalytics,
  handleConfirmModal,
  downloadVcf,
}) => {
  let screenWidth = screen.width;
  const style2 = {
    position: "absolute",
    top: "57%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 420,
    width: "100%",
    height: 490,
    display: "flex",
    justifyContent: "center",
    // marginRight: screenWidth >= 900 ? "20px" : "0px",

    // boxShadow: 24,

    outline: "none",
    borderRadius: "18px",
    // p: "32px",
  };

  let [showExtra, setshowExtra] = useState(false);

  let toggleShowExtra = () => {
    setshowExtra(!showExtra);
  };

  let [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    job: "",
    company: "",
  });

  let [img, setimg] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setimg(e.target.files[0]);
    }
  };

  // Get the current date
  const currentDate = new Date();

  // Function to get the abbreviated month name
  function getMonthAbbreviation(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[date.getMonth()];
  }

  // Function to add leading zero to single-digit day
  function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
  }

  // Extract day, month, and year
  const day = addLeadingZero(currentDate.getDate());
  const month = getMonthAbbreviation(currentDate);
  const year = currentDate.getFullYear();

  // Format the date string
  const formattedDate = `${month} ${day},${year}`;
  console.log(crntUsrAnalytics?.id);

  const addData = async () => {
    if (data.name && data.email && data.phone) {
      let pushKey = push(ref(db, `Contacts/`), {
        ...data,
        userid: userdata?.id,
        date: serverTimestamp(),
        // date: formattedDate,
      }).key;
      update(ref(db, `Contacts/${pushKey}`), {
        id: pushKey,
      }).then(() => {
        update(ref(db, `/Analytic/${crntUsrAnalytics?.id}`), {
          crntMonthLeads: crntUsrAnalytics?.crntMonthLeads + 1,
          crntWeekLeads: crntUsrAnalytics?.crntWeekLeads + 1,
          totalLeads: crntUsrAnalytics?.totalLeads + 1,
          todayLeads: crntUsrAnalytics?.todayLeads + 1,
        });

        // toast.success("Information submited successfuly");
        setData({
          name: "",
          email: "",
          phone: "",
          job: "",
          company: "",
        });
        handleConfirmModal();
        handleModal();
      });
      // if (img) {
      //   let name = new Date().getTime() + img.name;
      //   const storageRef = sRef(storage, name);
      //   uploadBytes(storageRef, img)
      //     .then(() => {
      //       console.log("img testing");
      //       getDownloadURL(storageRef)
      //         .then((URL) => {
      //           console.log(URL);
      //           update(
      //             ref(db, `User/${userdata?.id}/contactRequests/${pushKey}`),
      //             { imgUrl: URL }
      //           ).then(() => {
      //             setimg(null);
      //           });
      //         })
      //         .catch((error) => {
      //           console.log(error);
      //         });
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  return (
    <div>
      <Modal
        open={modal}
        onClose={() => handleModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <div
            className="h-[100%] w-[90%] overflow-y-scroll scrollbar-hide flex flex-col rounded-[30px] items-center pb-2 bg-white "
            style={{ marginRight: screenWidth >= 900 ? "15px" : "0px" }}
          >
            {/* <div className="w-[100%] mt-2 flex justify-center ">
              <div
                className="w-[56px] h-[7px] rounded-full bg-[#EBE4E4] cursor-pointer"
                onClick={() => handleModal()}
              ></div>
            </div> */}
            <div
              className="w-[100%] mt-5 flex justify-center"
              style={{
                fontFamily: "Inter",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              <span className="mr-[5px] text-[#3B57EE]">Exchange</span>
              Info with {userdata?.firstName}
            </div>

            <div class="w-[90%]  mt-[15px] bg-white">
              <div class="mt-4">
                {/* <p
                  class="ml-2 text-[#3F3939]"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "300",
                    fontSize: "16px",
                  }}
                >
                  Full Name<span className="text-[red]">*</span>
                </p> */}
                <input
                  type="text"
                  placeholder="Enter Name"
                  class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  value={data.name}
                />
              </div>

              <div class="mt-4">
                {/* <p
                  class="ml-2 text-[#3F3939]"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "300",
                    fontSize: "16px",
                  }}
                >
                  Phone Number<span className="text-[red]">*</span>
                </p> */}
                <input
                  type="text"
                  placeholder="Enter Phone"
                  class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  value={data.phone}
                />
              </div>

              <div class="mt-4">
                {/* <p
                  class="ml-2 text-[#3F3939]"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "300",
                    fontSize: "16px",
                  }}
                >
                  Email<span className="text-[red]">*</span>
                </p> */}

                <input
                  type="text"
                  placeholder="Enter Email"
                  class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                />
              </div>

              <div>
                <div class="mt-4 w-[100%] flex justify-between">
                  <div className="w-[47%] ">
                    {/* <p
                      class="ml-2 text-[#3F3939]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "300",
                        fontSize: "16px",
                      }}
                    >
                      Company
                    </p> */}
                    <input
                      type="text"
                      placeholder="Enter Company"
                      class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                      onChange={(e) =>
                        setData({ ...data, company: e.target.value })
                      }
                      value={data.company}
                    />
                  </div>
                  <div className="w-[47%] ">
                    {/* <p
                      class="ml-2 text-[#3F3939]"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: "300",
                        fontSize: "16px",
                      }}
                    >g
                      Title
                    </p> */}
                    <input
                      type="text"
                      placeholder="Enter Title"
                      class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                      onChange={(e) =>
                        setData({ ...data, job: e.target.value })
                      }
                      value={data.job}
                    />
                  </div>
                </div>

                {/* <div class="mt-2">
                  <p class="ml-2">Company</p>
                  <input
                    type="text"
                    placeholder="Enter Company"
                    class="outline-none p-2 w-[100%]  border rounded-lg h-[57px] mt-[2px]"
                    onChange={(e) =>
                      setData({ ...data, company: e.target.value })
                    }
                    value={data.company}
                  />
                </div> */}
              </div>

              <div className="w-[100%] flex justify-center mt-[20px]">
                <div
                  className="w-[100%] border rounded-lg  h-[55px] bg-[black] flex justify-center items-center text-white cursor-pointer "
                  onClick={() => addData()}
                  style={{
                    fontFamily: "Inter",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  Share
                </div>
              </div>
            </div>

            <ToastContainer position="top-center" autoClose={2000} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default LeadformModal;
