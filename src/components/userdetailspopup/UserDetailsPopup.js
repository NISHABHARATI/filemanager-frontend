// import React from 'react';
// import './UserDetailsPopup.css';

// const UserDetailsPopup = ({ userDetails ,isVisible, onClose }) => {
//   //console.log("my data is", userDetails);
//   if (!isVisible) return null;
//   return (
//     <div className="popup">
//       <div className="popup-content">
//         <h2>User Details</h2>
//         <label htmlFor="firstName">First Name:</label>
//         <input disabled type="text" id="firstName" 
//         value={userDetails.firstName}
//          />

//         <label htmlFor="lastName">Last Name:</label>
//         <input disabled type="text" id="lastName" value={userDetails.lastName}/>

//         <label htmlFor="email">Email:</label>
//         <input disabled type="email" id="email" value={userDetails.email}/>

//         <button onClick={onClose} className="close-button">Close</button>
//       </div>
//     </div>
//   );
// };

// export default UserDetailsPopup;
import React from 'react';
import './UserDetailsPopup.css';

const UserDetailsPopup = ({ userDetails, isVisible, onClose }) => {
  if (!isVisible) return null;
  console.log("User Details in Popup:", userDetails); // Debugging line

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>User Details</h2>
        {userDetails ? (
          <>
            <label htmlFor="firstName">First Name:</label>
            <input disabled type="text" id="firstName" value={userDetails.firstName || ''} />

            <label htmlFor="lastName">Last Name:</label>
            <input disabled type="text" id="lastName" value={userDetails.lastName || ''} />

            <label htmlFor="email">Email:</label>
            <input disabled type="email" id="email" value={userDetails.email || ''} />

            <label htmlFor="contact">Contact:</label>
            <input disabled type="contact" id="contact" value={userDetails.contact || ''} />
          </>
        ) : (
          // console.log("Cant fetch details in popup");
        
          <p>Loading...</p>
        )}
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default UserDetailsPopup;
