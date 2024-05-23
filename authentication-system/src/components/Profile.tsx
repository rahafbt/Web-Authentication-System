import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseSetup';

// Define the type for props
interface ProfileProps {
  isDarkMode: boolean; // Specify the type of isDarkMode prop
}


const Profile = ({ isDarkMode }: ProfileProps) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = collection(db, 'users', user.uid, 'data');
          const querySnapshot = await getDocs(userDocRef);
          querySnapshot.forEach((docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            } else {
              console.log('User data not found');
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div data-bs-theme={isDarkMode ? 'dark' : 'light'}>
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center w-100 vh-100 mt-5">
        <div className="card w-50 p-4 rounded">
          <div className='header-text mb-4 text-center'>
            <h2>Profile</h2>
            <p>Your profile information</p>
          </div>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Full Name (English)</label>
              <input
                type="text"
                className="form-control"
                value={userData?.fullNameEnglish || ''}
                disabled
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Full Name (Arabic)</label>
              <input
                type="text"
                className="form-control"
                value={userData?.fullNameArabic || ''}
                disabled
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Birth Date</label>
              <input
                type="date"
                className="form-control"
                value={userData?.birthDate || ''}
                disabled
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                value={userData?.mobileNumber || ''}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
