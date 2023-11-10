import React, { useState } from 'react'
import { Box, Modal } from '@mui/material'

const NotFoundModal = ({modal,handleModal}) => {


    const style2 = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 340,
        height: 180,
        bgcolor: "white",
        // border: '2px solid #000',
        boxShadow: 24,
        border:'none',
        outline:'none',
        borderRadius:'18px'
        // p: "32px",
      };


     

  return (
    <Modal
    open={modal}
    onClose={() =>handleModal() }
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >

    <Box 
     sx={style2}>
        <div className='h-[100%] w-[100%] flex justify-center items-center flex-col'>
<h2 className='w-[80%] text-center'>The profile you want to access is not activatied or locked by user</h2>
<div className='h-[35px] w-[90px] bg-black rounded-xl flex justify-center items-center text-white mt-5 cursor-pointer' onClick={() =>handleModal()}>Ok</div>
        </div>
     </Box>
     </Modal>
    
  )
}

export default NotFoundModal