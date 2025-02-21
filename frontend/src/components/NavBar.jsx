import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !profileBtnRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDropdownVisible(false); // Close the dropdown when component mounts
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/"); // Navigate to home after logout
  };

  useEffect(() => {
    setDropdownVisible(false); // Close dropdown after login
  }, [user]); // This will run whenever the user changes (i.e., after login)

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '10px' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>Flashcards</Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexGrow: 1 }}>
        <Link to="/create" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px' }}>
          Create Flashcard
        </Link>
        <Link to="/review" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', borderRadius: '5px' }}>
          Review Flashcards
        </Link>
      </div>

      <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {!user ? (
          <Link to="/signin" style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', borderRadius: '5px' }}>
            Login
          </Link>
        ) : (
          <div style={{ position: 'relative' }}>
            <button 
              ref={profileBtnRef} 
              onClick={toggleDropdown}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              <img
                src={user.profilePic || 'https://www.w3schools.com/howto/img_avatar.png'}
                alt="Profile"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              />
            </button>
            {dropdownVisible && (
              <div 
                ref={dropdownRef}
                style={{
                  position: 'absolute',
                  top: '60px',
                  right: '0',
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  display: 'block',
                }}
              >
                <Link to="/profile" style={{ display: 'block', padding: '10px' }}>My Profile</Link>
                <Link to="/friends" style={{ display: 'block', padding: '10px' }}>Friends</Link>
                <Link to="/settings" style={{ display: 'block', padding: '10px' }}>Settings</Link>
                <button onClick={handleLogout} style={{ display: 'block', padding: '10px', width: '100%' }}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
