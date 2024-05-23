import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SignupProps {
  isDarkMode: boolean; 
}

function Signup({ isDarkMode }: SignupProps) {
  const [fullNameEnglish, setFullNameEnglish] = useState('');
  const [fullNameArabic, setFullNameArabic] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameEnglishError, setFullNameEnglishError] = useState('');
  const [fullNameArabicError, setFullNameArabicEroor] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [birthDateError, setbirthDateError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[\u0000-\u007F\u0080-\u00FF]/;
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const handleSignUp = async () => {
    // Reset previous errors
    setFullNameEnglishError('');
    setFullNameArabicEroor('');
    setEmailError('');
    setMobileError('');
    setbirthDateError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate full name in English
    if (!fullNameEnglish.trim()) {
      setFullNameEnglishError('Full name in English is required');
      return;
    }
    else if (!englishRegex.test(fullNameEnglish)) {
      setFullNameEnglishError('Full name should be in English');
      return
    }
    else if (fullNameEnglish.length > 50) {
      setFullNameEnglishError('Full name should be at most 50 characters long');
      return;
    }

    // Validate full name in Arabic
    if (!fullNameArabic.trim()) {
      setFullNameArabicEroor('Full name in Arabic is required');
      return;
    }
    else if (!arabicRegex.test(fullNameArabic)) {
      setFullNameArabicEroor('Full name should be in Arabic');
      return
    }
    else if (fullNameArabic.length > 50) {
      setFullNameArabicEroor('Full name should be at most 50 characters long');
      return;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Validate mobile number
    if (!mobileNumber.trim()) {
      setMobileError('Mobile number is required');
      return;
    } else if (isNaN(Number(mobileNumber))) {
      setMobileError('Mobile number should contain only numbers');
      return;
    } else if (mobileNumber.length > 12) {
      setMobileError('Mobile number should be at most 12 characters long');
      return;
    }

    // Validate birth date
    const today = new Date();
    const userBirthDate = new Date(birthDate);
    const minAge = 18;
    const minAgeDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    if (!birthDate) {
      setbirthDateError('Birth date is required');
      return;
    }
    if (userBirthDate >= minAgeDate) {
      setbirthDateError('You must be at least 18 years old');
      return;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 8) {
      setPasswordError('Password should be at least 8 characters long');
      return;
    } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      setPasswordError('Password should contain at least one letter, one number, and one symbol');
      return;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    // sign up
    try {  
      if (await signUp(email, password, fullNameEnglish,
        fullNameArabic,
        birthDate,
        mobileNumber
        )) {
        console.log('Sign Up Successfully');
        toast.success('Verification link sent to your email')   
        navigate('/home');
      }
    } catch (error) {
      console.error(error); 
    }
  };

  return (
    <div data-bs-theme={isDarkMode ? 'dark' : 'light'}>
      <div className='d-flex justify-content-center align-items-center w-100 vh-100 mt-5'>
        <div className="card w-50 p-4 rounded">
          <h2 className="mb-3 text-center">Sign Up</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full name in English</label>
              <input type="text" className={`form-control ${fullNameEnglishError ? 'is-invalid' : ''}`} value={fullNameEnglish} onChange={(e) => setFullNameEnglish(e.target.value)} />
              {fullNameEnglishError && <div className="invalid-feedback">{fullNameEnglishError}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Full name in Arabic</label>
              <input type="text" className={`form-control ${fullNameArabicError ? 'is-invalid' : ''}`} value={fullNameArabic} onChange={(e) => setFullNameArabic(e.target.value)} />
              {fullNameArabicError && <div className="invalid-feedback">{fullNameArabicError}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile number</label>
              <input type="tel" className={`form-control ${mobileError ? 'is-invalid' : ''}`} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              {mobileError && <div className="invalid-feedback">{mobileError}</div>}
            </div>
            <div className="col-md-12">
              <label className="form-label">Birth date</label>
              <input type="date" max={formattedToday} className={`form-control ${birthDateError ? 'is-invalid' : ''}`} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              {birthDateError && <div className="invalid-feedback">{birthDateError}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input type="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm password</label>
              <input type="password" className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-secondary mt-3 col-md-12" onClick={handleSignUp}>Sign Up</button>
          </div>
          <div className='text-center p-3'>
              <p>Already have an account?  
              <Link to="/">Sign in</Link></p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
