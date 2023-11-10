import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../Firebase";
import { onValue, push, ref, set, update } from "firebase/database";
import { getDownloadURL, ref as storagref } from "firebase/storage";
import { returnIcons, returnSocialUrl } from "../assets/ReturnSocialIcons";
import Loader from "../assets/components/Loader";
import VCard from "vcard-creator";
import NotFound from "./NotFound";
import LeadformModal from "../assets/components/LeadformModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import share from "../imgs/share.png";
import imgPlchldr from "../imgs/imgPlchldr.jpg";
import logoPlchldr from "../imgs/logoPlchldr.png";
import cvrPlchldr from "../imgs/cvrPlchldr.png";

import ConfirmModal from "../assets/components/SubmitConfirmModal";

const Home = () => {
  let { userid } = useParams();
  let [userdata, setuserdata] = useState(null);
  let [sociallink, setsociallink] = useState([]);
  let [loading, setloading] = useState(true);

  // console.log(sociallink);

  // ------------------getting Data--------------------

  let [usersdata, setusersdata] = useState(null);
  let [allAnalytics, setAllAnalytics] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, `User/`);
    onValue(starCountRef, async (snapshot) => {
      const data = await snapshot.val();
      console.log(data);
      setusersdata(Object.values(data));
    });
  }, []);

  // console.log(allAnalytics);

  let [notfound, setnotfound] = useState(false);
  let [endpoint, setendpoint] = useState("");
  let [showSlide, setshowSlide] = useState(false);

  let [modal, setModal] = useState(false);
  let [confirmModal, setConfirmModal] = useState(false);

  let handleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  let handleModal = () => {
    setModal(!modal);
  };

  let currentDate = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const starCountRef2 = ref(db, `Analytic/`);
    onValue(starCountRef2, async (snapshot) => {
      const analytData = await snapshot.val();
      console.log(analytData);
      setAllAnalytics(Object.values(analytData));

      if (usersdata) {
        let checklist = usersdata?.some((elm) => {
          return userid === elm?.id || userid === elm?.username;
        });
        console.log(checklist);
        if (checklist) {
          console.log("true");
          usersdata?.map((elm) => {
            if (userid === elm?.id || userid === elm?.username) {
              // console.log(elm);
              setuserdata(elm);
              setModal(elm?.leadMode);
              elm?.links && setsociallink(Object.values(elm?.links));
              setloading(false);
            }
          });

          //     let thedata=usersdata?.filter((elm)=>{
          // return userid === elm?.id || userid === elm?.userName
          //         })
          // if(thedata){
          //   setuserdata(thedata);
          //   setModal(thedata?.leadMode)
          //   thedata?.links &&  setsociallink(Object.values(thedata?.links));
          // setloading(false);
          // }
        } else {
          setloading(false);
          setnotfound(true);
        }
      }
    });
  }, [usersdata]);

  // console.log(userdata?.Analytics?.updatedAt);

  // getting profile url

  let [profileurl, setprofileurl] = useState("");
  useEffect(() => {
    if (userdata?.profileUrl) {
      // const storage = getStorage();
      const fileRef = storagref(storage, userdata?.profileUrl);
      // console.log(loginUserData.profileUrl);

      getDownloadURL(fileRef)
        .then((URL) => {
          console.log(URL);
          setprofileurl(URL);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userdata?.profileUrl]);

  // getting logo img

  let [logourl, setlogourl] = useState("");
  useEffect(() => {
    if (userdata?.logoUrl) {
      // const storage = getStorage();
      const fileRef = storagref(storage, userdata?.logoUrl);
      // console.log(loginUserData.profileUrl);

      getDownloadURL(fileRef)
        .then((URL) => {
          console.log(URL);
          setlogourl(URL);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userdata?.logoUrl]);

  // getting logo img

  let [coverurl, setcoverurl] = useState("");
  useEffect(() => {
    if (userdata?.coverUrl) {
      // const storage = getStorage();
      const fileRef = storagref(storage, userdata?.coverUrl);
      // console.log(loginUserData.profileUrl);

      getDownloadURL(fileRef)
        .then((URL) => {
          // console.log(URL);
          setcoverurl(URL);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userdata?.logoUrl]);

  // ----------------------------------------->Analytics<-------------------------------------

  let addedInAnalyticsOrNot = (id) => {
    let addedOrNot = allAnalytics?.some((elm) => {
      return id === elm?.userid;
    });
    return addedOrNot;
  };

  let returnClickedLinkAnalyt = () => {};

  let crntUsrAnalytics = allAnalytics?.find((usr) => {
    return userdata?.id === usr?.userid;
  });
  let linkAddedInAnalyticsOrNot = (id) => {
    let addedOrNot = crntUsrAnalytics?.links?.some((elm) => {
      return id === elm?.linkID;
    });
    return addedOrNot;
  };

  useEffect(() => {
    if (userdata?.id) {
      if (addedInAnalyticsOrNot(userdata?.id)) {
        // ---------------------------updatetion for week wise analytics-------------------------
        if (currentDate > crntUsrAnalytics?.updatedWeek + oneWeek) {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            totalViews: crntUsrAnalytics?.totalViews + 1,
            updatedWeek: currentDate,
            pastWeekViews: crntUsrAnalytics?.crntWeekViews,
            pastWeekLeads: crntUsrAnalytics?.crntWeekLeads,

            // pastMonthViews: crntUsrAnalytics?.crntMonthViews,
            // pastMonthLeads: crntUsrAnalytics?.crntMonthLeads,
          }).then(() => {
            update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
              crntWeekViews: 1,
              crntWeekLeads: 0,
            });
          });
        } else {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            totalViews: crntUsrAnalytics?.totalViews + 1,
            crntWeekViews: crntUsrAnalytics?.crntWeekViews + 1,
            crntMonthViews: crntUsrAnalytics?.crntMonthViews + 1,
          });
        }

        // ---------------------------updatetion for Month wise analytics-------------------------
        if (currentDate > crntUsrAnalytics?.updatedMonth + oneMonth) {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            updatedMonth: currentDate,
            // pastWeekViews: crntUsrAnalytics?.crntWeekViews,
            // pastWeekLeads: crntUsrAnalytics?.crntWeekLeads,
            pastMonthViews: crntUsrAnalytics?.crntMonthViews,
            pastMonthLeads: crntUsrAnalytics?.crntMonthLeads,
          }).then(() => {
            update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
              crntMonthViews: crntUsrAnalytics?.crntMonthViews + 1,
              crntMonthLeads: 0,
            });
          });
        }

        // ---------------------------updatetion for Month wise analytics-------------------------
        if (currentDate > crntUsrAnalytics?.updatedDay + oneDay) {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            updatedDay: currentDate,
            todayViews: 1,
            todayLeads: 0,
          });
        } else {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            todayViews: crntUsrAnalytics?.todayViews + 1,
            todayLeads: crntUsrAnalytics?.todayLeads,
          });
        }
      } else {
        let thePushKey = push(ref(db, `Analytic/`), {
          userid: userdata?.id,
          totalViews: 1,
          totalClicks: 0,
          totalClickRate: 0,
          totalLeads: 0,

          crntWeekViews: 1,
          pastWeekViews: 0,

          crntWeekLeads: 0,
          pastWeekLeads: 0,

          crntMonthViews: 1,
          pastMonthViews: 0,

          crntMonthLeads: 0,
          pastMonthLeads: 0,

          todayViews: 1,
          todayLeads: 0,
          updatedWeek: currentDate,
          updatedMonth: currentDate,
          updatedDay: currentDate,
        }).key;

        update(ref(db, `Analytic/${thePushKey}`), {
          id: thePushKey,
        });
      }
    }
  }, [userdata?.id]);

  // useEffect(() => {
  //   if (userdata?.id) {
  //     if (userdata?.Analytics) {
  //       if (currentDate > userdata?.Analytics?.updatedAt + oneWeek) {
  //         update(ref(db, `User/${userdata?.id}/Analytics`), {
  //           totalClicks: userdata?.Analytics?.totalClicks + 1,
  //           updatedAt: currentDate,
  //           tClicksPstWk: userdata?.Analytics?.tClicksCrntWk,
  //           tContactsMePstWk: userdata?.Analytics?.tContactsMeCrntWk,
  //         }).then(() => {
  //           update(ref(db, `User/${userdata?.id}/Analytics`), {
  //             tClicksCrntWk: 0,
  //             tContactsMeCrntWk: 0,
  //           });
  //         });
  //       } else {
  //         update(ref(db, `User/${userdata?.id}/Analytics`), {
  //           totalClicks: userdata?.Analytics?.totalClicks + 1,
  //         });
  //       }
  //     } else {
  //       update(ref(db, `User/${userdata?.id}/Analytics`), {
  //         totalClicks: 1,
  //         totalLinkClicks: 0,
  //         tClicksCrntWk: 1,
  //         tClicksPstWk: 0,
  //         tContactsMeCrntWk: 0,
  //         tContactsMePstWk: 0,
  //       });
  //     }
  //   }
  // }, [userdata?.id]);

  // ----------------------------------------->Link Analytics<-------------------------------------

  let linkAnalytics = (name) => {
    if (crntUsrAnalytics?.links) {
      if (linkAddedInAnalyticsOrNot(name?.linkID)) {
        let findLink = crntUsrAnalytics?.links?.find((elm) => {
          return name?.linkID === elm?.linkID;
        });

        let linksWithoutCrntLink = crntUsrAnalytics?.links?.filter((elm) => {
          return name?.linkID != elm?.linkID;
        });
        update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
          links: [
            ...linksWithoutCrntLink,
            {
              name: findLink?.name,
              linkID: findLink?.linkID,
              clicks: findLink?.clicks + 1,
              image: "",
            },
          ],
        }).then(() => {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}/`), {
            totalClicks: crntUsrAnalytics?.totalClicks + 1,
          });
        });
      } else {
        update(ref(db, `Analytic/${crntUsrAnalytics?.id}/`), {
          links: [
            ...crntUsrAnalytics?.links,
            { name: name?.name, linkID: name?.linkID, clicks: 1, image: "" },
          ],
        }).then(() => {
          update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
            totalClicks: crntUsrAnalytics?.totalClicks + 1,
          });
        });
      }
    } else {
      update(ref(db, `Analytic/${crntUsrAnalytics?.id}/`), {
        links: [
          { name: name?.name, linkID: name?.linkID, clicks: 1, image: "" },
        ],
      }).then(() => {
        update(ref(db, `Analytic/${crntUsrAnalytics?.id}`), {
          totalClicks: 1,
        });
      });
    }
  };

  // -----------------------------------------hex to rgba for bg color-------------------------------------

  let hexToRGBA = (hex) => {
    // Remove the '#' character if present
    hex = hex?.replace("#", "");

    // Convert the hex value to RGB
    const red = parseInt(hex?.substring(0, 2), 16);
    const green = parseInt(hex?.substring(2, 4), 16);
    const blue = parseInt(hex?.substring(4, 6), 16);

    // Convert RGB to RGBA with alpha value 0.1
    const rgba = `rgba(${red}, ${green}, ${blue}, 0.1)`;

    return rgba;
  };

  // To base64

  let [base64img, setbase64img] = useState("");
  useEffect(() => {
    let cnvrtTo64 = async () => {
      const base64 = await fetch(profileurl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          return new Promise((res) => {
            reader.onloadend = () => {
              res(reader.result);
            };
          });
        });
      setbase64img(base64);
    };
    cnvrtTo64();
  }, [profileurl]);

  // Download Vcf file
  let checkHttp = (url, id) => {
    if (id === 7 || id === 4 || id === 19 || id === 12 || id === 8) {
      if (url?.includes("https://")) {
        return url;
      } else {
        return `https://${url}`;
      }
    } else {
      return url;
    }
  };

  console.log(userdata);
  let downloadVcf = async () => {
    // Define a new vCard
    const myVCard = new VCard();

    // Some variables
    const lastname = userdata?.lastName;
    const firstname = userdata?.firstName;
    const additional = "";
    const prefix = "";
    const suffix = "";

    myVCard
      .addName(lastname, firstname, additional, prefix, suffix)
      .addJobtitle(userdata?.jobTitle)
      .addCompany(userdata?.company)
      .addEmail(userdata?.email)
      .addPhoneNumber(userdata?.phone)
      .addPhoto(base64img.slice(37), "jpeg")
      .addAddress("", "", userdata?.address);

    sociallink?.map((elm) => {
      if (elm?.linkID != 3 && elm?.linkID != 1 && elm?.linkID != 2) {
        myVCard.addSocial(
          checkHttp(elm?.baseUrl + elm?.value, elm?.linkID),
          elm?.name
        );
      }
      if (elm?.linkID === 2) {
        myVCard.addPhoneNumber(elm?.value);
      }
      if (elm?.linkID === 3) {
        myVCard.addEmail(elm?.value);
      }

      if (elm?.linkID === 1) {
        myVCard.addEmail(elm?.email).addPhoneNumber(elm?.value);
      }
      if (elm?.linkID === 21) {
        myVCard.addURL(
          // elm?.value
          "https://www.fb.com"
        );
      }
      // checkHttp(elm?.baseUrl + elm?.value, elm?.linkID)
    });

    const vcardData = myVCard.toString();
    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "YoTap.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let returnSlicedString = (str, numVal) => {
    if (str?.length <= numVal) {
      return str;
    } else {
      return str?.slice(0, numVal) + "...";
    }
  };
  // console.log(userdata);

  let handleLinkAliginmentIssue = () => {
    let theLinks = sociallink?.filter((elm) => {
      return elm?.shareable === true || elm?.isFeatureOn === false;
    });

    if (theLinks?.length % 3 === 0) {
      return theLinks;
    } else {
      theLinks?.push({ linkID: null });
      // theLinks?.push({ linkID: null });
      return theLinks;
    }
  };
  let scrnWidth = window.innerWidth;
  console.log(sociallink);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {notfound || userdata.profileOn === 0 ? (
            <NotFound />
          ) : userdata?.directMode === false ? (
            <div
              className="min-h-[100vh] max-w-[420px] w-[100%] flex flex-col items-center rounded-md shadow-lg  relative"
              style={{
                fontFamily: "Inter, sans-serif",
                background: `linear-gradient(to bottom, ${hexToRGBA(
                  userdata?.cardColor
                )},${hexToRGBA(userdata?.cardColor)}, white)`,
              }}
            >
              {/* <ToastContainer position="top-center" autoClose={2000} /> */}

              <LeadformModal
                modal={modal}
                handleModal={handleModal}
                userdata={userdata}
                crntUsrAnalytics={crntUsrAnalytics}
                handleConfirmModal={handleConfirmModal}
              />
              <ConfirmModal
                confirmModal={confirmModal}
                handleConfirmModal={handleConfirmModal}
                userdata={userdata}
                prflImg={
                  profileurl ? profileurl : `https://placehold.co/116x116`
                }
              />

              <div
                className="w-[97%]  min-h-[100vh] relative"
                // style={{
                //   background: `linear-gradient(to bottom, ${hexToRGBA(
                //     userdata?.cardColor
                //   )},${hexToRGBA(userdata?.cardColor)}, white)`,
                // }}
              >
                {/* <div className="min-h-[350px] w-[100%] relative  object-cover "> */}
                <div
                  className="min-h-[355px] w-[100%] flex items-center flex-col"
                  // style={{
                  //   background: `linear-gradient(to bottom, ${hexToRGBA(
                  //     userdata?.cardColor
                  //   )},${hexToRGBA(userdata?.cardColor)}, white)`,
                  // }}
                >
                  {coverurl ? (
                    <img
                      src={coverurl}
                      // alt="background"
                      className="h-[210px] w-[90%] mt-[15px] rounded-2xl "
                    />
                  ) : (
                    <div className="h-[210px] w-[90%] mt-[15px] rounded-2xl border"></div>
                  )}

                  <div className="h-[160px] w-[100%] absolute top-[140px] flex justify-center">
                    <div className="h-[100%] w-[160px] relative">
                      <img
                        src={logourl ? logourl : logoPlchldr}
                        alt="logo"
                        className="absolute bottom-[15px] right-[-7px] h-[55px] w-[55px] rounded-full border-[1px] border-white"
                      />
                      {profileurl ? (
                        <img
                          src={profileurl}
                          alt="profile"
                          className="h-[150px] w-[150px] rounded-full border-[5px] border-white"
                        />
                      ) : (
                        <div className="h-[150px] w-[150px] rounded-full border-[5px] border-white"></div>
                      )}
                    </div>
                  </div>

                  <div className="w-[100%] flex justify-center mt-[72px] ">
                    <h2 className="text-[22px]  font-[400] text-center w-[90%]">
                      {returnSlicedString(
                        `${userdata?.firstName} ${userdata?.lastName}`,
                        30
                      )}
                    </h2>
                  </div>

                  <div className="w-[100%] flex justify-center ">
                    <h2 className="text-[16px] font-[300] text-[#4D4444] text-center w-[90%]">
                      {returnSlicedString(userdata?.jobTitle, 51)}
                    </h2>
                  </div>
                  <div className="w-[100%] flex justify-center  ">
                    <h2 className="text-[16px] font-[300] text-[#4D4444] text-center w-[90%]">
                      {returnSlicedString(userdata?.company, 51)}
                    </h2>
                  </div>

                  <div className="w-[100%] flex justify-center  ">
                    <h2 className=" text-[15px] font-[300] text-[#4D4444] text-center w-[90%]">
                      {userdata?.address}
                    </h2>
                  </div>

                  <div className="w-[100%] flex justify-center mt-[15px] text-center">
                    <p className="text-[16px] font-[300] text-[#2e363c] w-[90%]">
                      {userdata?.bio}
                    </p>
                  </div>
                  <div
                    className={`w-[100%] h-[80px] flex justify-center items-center relative`}
                  >
                    {/* bg-gradient-to-b from-[${hexToRGBA(userdata?.colorCode)}] to-white */}
                    <div className="w-[250px] flex justify-center items-center">
                      <div
                        className={`w-[166px] h-[55px]  rounded-[15px] flex justify-center items-center text-[18px] text-white font-[700] cursor-pointer`}
                        style={{
                          backgroundColor: "black",
                          fontStyle: "Inter",
                        }}
                        onClick={() => downloadVcf()}
                      >
                        Save Contact
                      </div>
                    </div>
                    <div
                      className="h-[25px] w-[25px] cursor-pointer absolute"
                      onClick={() => handleModal()}
                      style={
                        scrnWidth >= 380 ? { right: "17%" } : { right: "13%" }
                      }
                    >
                      <img src={share} alt="" className="h-[25px] w-[25px]" />
                    </div>
                  </div>
                </div>

                {/* </div> */}

                {/* <div className="w-[100%]">
                  {sociallink?.map((elm) => {
                    return (
                      <>
                        <a
                          target="_blank"
                        
                        >
                          <div className="w-[100%] flex justify-center">
                            <div
                              className="w-[90%] h-[130px] mt-4 bg-[white] shadow-xl rounded-[10px] flex border"
                              style={
                                elm?.shareable === false ||
                                elm?.isFeatureOn === false
                                  ? { display: "none" }
                                  : null
                              }
                            >
                              <div className="w-[40%]  flex justify-center items-center">
                                <img
                                  src={returnIcons(elm?.linkID)}
                                  alt=""
                                  className="h-[88px] w-[88px]"
                                />
                              </div>

                              <div className="w-[60%] flex flex-col ">
                                <h2 className="font-[700] text-[18px] mt-[20px]">
                                  {elm?.name?.length < 17
                                    ? elm?.name
                                    : elm?.name?.substring(0, 16) + "..."}
                                </h2>
                                <p className="font-[300] text-[12px] w-[90%] ">
                                  {elm?.feature?.length < 67
                                    ? elm?.feature
                                    : elm?.feature?.substring(0, 67) + "..."}
                                </p>
                              
                              </div>
                            </div>
                          </div>
                        </a>
                      </>
                    );
                  })}
                </div> */}

                <div className="w-[100%] flex justify-center mt-3">
                  <div className="w-[94%] rounded-[25px] bg-[#FAFAFA]   flex flex-col items-center">
                    {/* bg-[#f5f5f58e] */}
                    <div className="w-[95%] mt-1">
                      {sociallink?.map((elm) => {
                        return (
                          <>
                            <a
                              target="_blank"
                              href={checkHttp(
                                elm?.baseUrl + elm?.value,
                                elm?.linkID
                              )}
                              // onClick={() => linkAnalytics(elm?.title)}
                            >
                              <div className="w-[100%] flex justify-center">
                                <div
                                  className="w-[92%] h-[121px] mt-4 mb-1 bg-[white]  border-[1px] border-[#F1ECEC]  rounded-[30px] flex "
                                  style={
                                    elm?.shareable === false ||
                                    elm?.isFeatureOn === false
                                      ? { display: "none" }
                                      : null
                                  }
                                >
                                  <div className="w-[33%]  flex justify-center items-center ">
                                    <img
                                      src={returnIcons(elm?.linkID)}
                                      alt=""
                                      className="h-[75px] w-[75px]"
                                    />
                                  </div>

                                  <div className="w-[60%] flex flex-col justify-center  ">
                                    <h2 className="font-[700] text-[18px] ">
                                      {elm?.name?.length < 17
                                        ? elm?.name
                                        : elm?.name?.substring(0, 16) + "..."}
                                    </h2>
                                    <p className="font-[400] text-[13px] w-[90%] ">
                                      {elm?.feature?.length < 67
                                        ? elm?.feature
                                        : elm?.feature?.substring(0, 67) +
                                          "..."}
                                    </p>
                                    {/* 68 */}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </>
                        );
                      })}
                    </div>
                    <div className=" w-[95%]  flex justify-around items-center flex-wrap mt-5">
                      {/* grid grid-cols-3 gap-x-4 pr-7 */}
                      {sociallink?.map((elm) => {
                        return (
                          <>
                            <a
                              target="_blank"
                              href={
                                elm?.linkID != null &&
                                checkHttp(
                                  elm?.baseUrl + elm?.value,
                                  elm?.linkID
                                )
                              }
                              // returnSocialUrl(elm?.title, elm?.value)
                              class="h-[120px] w-[31%] flex flex-col  items-center mt-4 "
                              style={
                                elm?.shareable === false ||
                                elm?.isFeatureOn === true
                                  ? { display: "none" }
                                  : null
                              }
                              onClick={() => linkAnalytics(elm)}
                            >
                              {elm?.linkID != null && (
                                <img
                                  src={returnIcons(elm?.linkID)}
                                  alt="img"
                                  class={` ${"h-[75px] w-[75px]"}`}
                                  // style={elm?.name==='Calendly'? {borderRadius:'10px'}:null}
                                />
                              )}
                              <h2 class="font-[300] text-[12px] text-[#000000] mt-[6px]">
                                {elm?.name}
                              </h2>
                            </a>
                          </>
                        );
                      })}
                    </div>
                    {/* <br /> */}
                  </div>
                </div>

                <div
                  className=" w-[100%] h-[100px]  flex justify-center items-center mt-[16px]"
                  // style={{
                  //   background: `linear-gradient(to top, ${hexToRGBA(
                  //     userdata?.colorCode
                  //   )},${hexToRGBA(userdata?.colorCode)}, white)`,
                  // }}
                >
                  <div className="h-[51px] w-[211px] rounded-[15px] text-[#FFFFFF]  bg-black flex justify-center items-center  font-[500] text-[15px] cursor-pointer">
                    Create your own profile
                  </div>
                </div>
                {/* <br /> */}
              </div>
            </div>
          ) : (
            window.open(
              returnSocialUrl(userdata?.direct?.name, userdata?.direct?.value)
            )
          )}
        </>
      )}
    </>
  );
};

export default Home;
