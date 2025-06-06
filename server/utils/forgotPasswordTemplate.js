export const forgotPasswordTemplate = ({name,otp}) =>{
  return `
  <p>${name}</p>
  <p>You're requested a password reset. Please use following OTP code to reset your password.</p>   
  <div style="background:yellow;font-size:20px;padding:20px;text-align:center;font-weight:800;">${otp}</div>
  <p>This otp is valid for 1 hour only. Enter this otp in the Penguin87 website to proceed with resetting your password.</p>
  <br/>
  </br>
  <p>Thanks</p>
  <p>Penguin87</p>
  `
}

export const verifyEmailTemplatesoi = ({name,otp}) =>{
  return `
  <p>${name}</p>
  <p>You're requested a Verify Email. Please use following OTP code to  Verify Email .</p>   
  <div style="background:yellow;font-size:20px;padding:20px;text-align:center;font-weight:800;">${otp}</div>
  <p>This otp is valid for 1 hour only. Enter this otp in the Penguin87 website to proceed with Verify Email.</p>
  <br/>
  </br>
  <p>Thanks</p>
  <p>Penguin87</p>
  `
}