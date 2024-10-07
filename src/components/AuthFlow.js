import React, { useState } from 'react';
import ForgetPassword from './ForgetPassword';
import VerifyCode from './VerifyCode';
import ResetPassword from './ResetPassword';

const AuthFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleCodeSent = (email) => {
    setEmail(email);
    setStep(2);
  };

  const handleCodeVerified = () => {
    setStep(3);
  };

  const handlePasswordReset = () => {
    alert('Password has been reset successfully!');
    setStep(1); // Reset the flow to the first step
  };

  return (
    <div>
      {step === 1 && <ForgetPassword onCodeSent={handleCodeSent} />}
      {step === 2 && <VerifyCode email={email} onCodeVerified={handleCodeVerified} />}
      {step === 3 && <ResetPassword email={email} onPasswordReset={handlePasswordReset} />}
    </div>
  );
};

export default AuthFlow;
