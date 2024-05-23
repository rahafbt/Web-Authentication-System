import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SigninProps {
  isDarkMode: boolean;
}

function Signin({ isDarkMode }: SigninProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signIn, googleSignIn, ResetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    // sign in
    try {
      await signIn(email, password);
      navigate('/home');
    } catch (error) {
      toast.error('Failed to sign in');
      console.error(error);
    }
  };

  // sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate('/home');
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.error(error);
    }
  };

  // reset password
  const handleResetPassword = async () => {
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    try {
      await ResetPassword(email);
      // Show success message here
      toast.success('Password reset link sent to your email.')
    } catch (error) {
      toast.error('Failed to send password reset link')
      console.error(error);
    }
  };

  return (
    <div data-bs-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center w-100 vh-100 mt-5">
          <div className="card w-60 p-4 rounded">
            <div className='header-text mb-4 text-center'>
              <h2>Hello, Again</h2>
              <p>We are happy to have you back</p>
            </div>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>
              <div className="col-md-12">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>
            </div>
            <div>
              <a href='#' onClick={handleResetPassword}>Forgot Password?</a>
            </div>
            <div className="text-center">
              <button className="btn btn-secondary mt-3 col-md-12" onClick={handleSignIn}>Sign in</button>
            </div>
            <div className="text-center">
              <button className="btn btn-secondary mt-3 col-md-12" onClick={handleGoogleSignIn}><img className='me-2' width="25" height="25" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo"/>Sign in with Google</button>
            </div>
            <div className='text-center p-3'>
              <p>Don't have an account?  
              <Link to="/signup">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
