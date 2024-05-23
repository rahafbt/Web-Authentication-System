import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface HomeProps {
  isDarkMode: boolean; 
}

function Home({ isDarkMode }: HomeProps) {
  const {user, isEmailVerified, resendEmailVerification, logOut} = useAuth()
  const navigate = useNavigate()

  // sign out
  const handleSignOut = async () => {
    try {
      await logOut();         
      // logOut successful
      console.log('log Out Succsfully')
      navigate('/')
    } catch (error) {
      console.log(error); // Display the error message
    }
  };

  const handleAlreadyVerified = () => {
    navigate(0);
  }

  const handleSendVerification = async () => {
    try {
      await resendEmailVerification();
      toast.success('Verification link sent to your email')         
    } catch (error) {
      toast.error('Failed to send verification link')
      console.log(error);
    }
  };

  if (isEmailVerified()) {
    // User is signed in and email is verified
    return (
      <div data-bs-theme={isDarkMode ? 'dark' : 'light'}>
        <div className="container-fluid">
          <div className='d-flex justify-content-center align-items-center w-100 vh-100 mt-5'>
            <div className="card w-60 p-4 rounded">
              <div className='header-text mb-4 text-center'>
                <h2>Hey, {user?.fullName}</h2>
                <h3>Email: {user?.email}</h3>
              </div>
              <button className='btn btn-secondary mt-3 col-md-12' onClick={handleSignOut}>Sign out</button>      
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // User is signed in but email is not verified
    return (
      <div data-bs-theme={isDarkMode ? 'dark' : 'light'}>
        <div className="container-fluid">
          <div className='d-flex justify-content-center align-items-center w-100 vh-100 mt-5'>
            <div className="card w-60 p-4 rounded">
              <div className='header-text mb-4 text-center'>
                <h2>Hey, {user?.fullName}</h2>
                <h3>Email: {user?.email}</h3>
              </div>
              <button className='btn btn-secondary mt-3 col-md-12' onClick={handleAlreadyVerified}>Email already verified</button>
          <button className='btn btn-secondary mt-3 col-md-12' onClick={handleSendVerification}>Resend verification link</button>      
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home