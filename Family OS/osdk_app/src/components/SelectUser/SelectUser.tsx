import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
/* eslint-disable-next-line import/named */
import { Osdk } from '@osdk/client';
import { AipfFamilyMember } from '@aipf-osdk-frontend/sdk';
import client from '../../client';
import { useAppContext } from '../../hooks/useAppContext';
import './SelectUser.css';

// User card component
const UserCard: React.FC<{ 
  user: Osdk.Instance<AipfFamilyMember>; 
  onSelect: (user: Osdk.Instance<AipfFamilyMember>) => void;
}> = ({ user, onSelect }) => {
  return (
    <div 
      className="user-card card"
      onClick={() => onSelect(user)}
      onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(user);
          }
      }}
      role="button"
      tabIndex={0}>
      <div className="avatar">
        {user.firstName && user.firstName.charAt(0)}
        {user.lastName && user.lastName.charAt(0)}
      </div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.age} years old</p>
    </div>
  );
};

const SelectUser: React.FC = () => {
  const [users, setUsers] = useState<Osdk.Instance<AipfFamilyMember>[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFamilyMembers = async () => {
      try {
        // Load all family members
        const familyMembers: Osdk.Instance<AipfFamilyMember>[] = [];
        for await (const member of client(AipfFamilyMember).asyncIter()) {
          familyMembers.push(member);
        }
        setUsers(familyMembers);
      } catch (error) {
        console.error("Failed to load family members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, []);

  const handleSelectUser = (user: Osdk.Instance<AipfFamilyMember>) => {
    setSelectedUser(user);
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading">Loading family members...</div>;
  }

  return (
    <div className="select-user-container fade-in">
      <h1 className="title">Welcome to Family OS</h1>
      <p className="subtitle">Please select your profile</p>
      
      <div className="users-grid">
        {users.map(user => (
          <UserCard 
            key={user.personId} 
            user={user} 
            onSelect={handleSelectUser} 
          />
        ))}
      </div>
    </div>
  );
};

export default SelectUser;