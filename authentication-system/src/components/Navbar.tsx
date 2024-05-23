import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

function Navbar({ toggleDarkMode, isDarkMode }: NavbarProps) {
    const {user, logOut} = useAuth()
    const navigate = useNavigate()

    // sign out
    const handleSignOut = async () => {
      try {
        await logOut();         
        console.log('log Out Succsfully')
        navigate('/')
      } catch (error) {
        console.log(error);
      }
    };

    // sign in
    const handleSignIn = async () => {
      navigate('/')
    };

    // sign up
    const handleSignUp = async () => {
      navigate('/signup')
    };

    // profile page
    const handleProfile = async () => {
        navigate('/profile')
    };

    // home page
    const handleHome = async () => {
      navigate('/home')
  };

    return (
        <div>
        <nav className={`navbar navbar-expand-lg fixed-top ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container-fluid">
            <div className="d-flex align-items-center ms-auto">
            {user && (
            <>
              <div className="me-3" onClick={handleProfile}>
                {isDarkMode ? 
                  <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/FFFFFF/gender-neutral-user.png" alt="Profile Dark Mode"/> : 
                  <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/gender-neutral-user.png" alt="Profile Light Mode"/>
                }
              </div>
              <div className="me-3" onClick={handleHome}>
                {isDarkMode ? 
                  <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png" alt="Home Dark Mode"/> : 
                  <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/home.png" alt="Home Light Mode"/>
                }
              </div>
            </>
          )}

            <div className="me-3" onClick={toggleDarkMode}>
            {isDarkMode ? 
              <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/FFFFFF/moon-symbol.png" alt="Dark Mode"/> : 
              <img width="30" height="30" src="https://img.icons8.com/ios/50/sun--v1.png" alt="Light Mode"/>
            }
          </div>
            {user ? (
            <>
            <Link to="/" className="btn btn-secondary me-3" onClick={handleSignOut}>Sign Out</Link>
            </>
          ) : (
            <>
            <Link to="/" className="btn btn-secondary me-3" onClick={handleSignIn}>Sign In</Link>
            <Link to="/signup" className="btn btn-secondary me-3" onClick={handleSignUp}>Sign Up</Link>
            </>
          )}
            </div>
        </div>
        </nav>
        </div>
    )
}

export default Navbar