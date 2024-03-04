//Handeling Success Messages
export const CreateSuccess = (status, message, data) => {
  //success message object created
  const successObj = {
    status: status,
    message: message,
    data: data,
  };
  return successObj;
};
