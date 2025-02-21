import React from 'react'
import FlashcardList from "./FlashcardList";

const Dashboard = ({ user, onLogout }) => {
  return (
    <div>
      <FlashcardList user={user} />
    </div>
  );
};

export default Dashboard;
