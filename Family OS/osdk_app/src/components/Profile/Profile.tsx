import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { AipfChore, AipfMemberFact, AipfMemberRelation } from '@aipf-osdk-frontend/sdk';
/* eslint-disable-next-line import/named */
import { Osdk } from '@osdk/client';
import Navigation from '../common/Navigation';;
import './Profile.css';

const Profile: React.FC = () => {
  const { selectedUser } = useAppContext();
  const [facts, setFacts] = useState<Osdk.Instance<AipfMemberFact>[]>([]);
  const [relations, setRelations] = useState<Osdk.Instance<AipfMemberRelation>[]>([]);
  const [chores, setChores] = useState<Osdk.Instance<AipfChore>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!selectedUser) return;

      try {
        // Load facts
        const userFacts: Osdk.Instance<AipfMemberFact>[] = [];
        for await (const fact of selectedUser.$link.aipfMemberFacts.asyncIter()) {
          userFacts.push(fact);
        }
        setFacts(userFacts);
        
        // Load relations
        const userRelations: Osdk.Instance<AipfMemberRelation>[] = [];
        for await (const relation of selectedUser.$link.relations1.asyncIter()) {
          userRelations.push(relation);
        }
        // Also fetch relations2 since there are two links to relations
        for await (const relation of selectedUser.$link.relations2.asyncIter()) {
          userRelations.push(relation);
        }
        setRelations(userRelations);
        
        // Load chores
        const userChores: Osdk.Instance<AipfChore>[] = [];
        for await (const chore of selectedUser.$link.aipfChores.asyncIter()) {
          userChores.push(chore);
        }
        setChores(userChores);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [selectedUser]);

  if (!selectedUser) return <div>No user selected</div>;

  return (
    <div className="profile-container fade-in">
      <Navigation />
      
      <div className="profile-header">
        <div className="profile-avatar">
          {selectedUser.firstName && selectedUser.firstName.charAt(0)}
          {selectedUser.lastName && selectedUser.lastName.charAt(0)}
        </div>
        
        <div className="profile-title">
          <h1>{selectedUser.firstName} {selectedUser.lastName}</h1>
          <p className="credit-badge">Credit: {selectedUser.goodMemberCredit || 0} points</p>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section personal-info card slide-up">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">{selectedUser.age}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">{selectedUser.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{selectedUser.gender}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{selectedUser.emailAddress}</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section favorites card slide-up">
          <h2>Favorites</h2>
          
          <h3>Favorite Activities</h3>
          <p>{selectedUser.favouriteActivities || "No favorite activities listed"}</p>
          
          <h3>Favorite Foods</h3>
          {selectedUser.favouriteFoods && selectedUser.favouriteFoods.length > 0 ? (
            <div className="food-tags">
              {selectedUser.favouriteFoods.map((food, index) => (
                <span key={index} className="food-tag">{food}</span>
              ))}
            </div>
          ) : (
            <p>No favorite foods listed</p>
          )}
        </div>
        
        {loading ? (
          <div className="loading">Loading profile data...</div>
        ) : (
          <>
            <div className="profile-section facts card slide-up">
              <h2>Facts</h2>
              {facts.length > 0 ? (
                <ul className="facts-list">
                  {facts.map(fact => (
                    <li key={fact.factId} className="fact-item">
                      <span className="fact-type">{fact.factType}</span>
                      <p>{fact.factDetail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No facts found</p>
              )}
            </div>
            
            <div className="profile-section relations card slide-up">
              <h2>Relationships</h2>
              {relations.length > 0 ? (
                <ul className="relations-list">
                  {relations.map(relation => (
                    <li key={relation.relationId} className="relation-item">
                      <div className="relation-header">
                        <span className="relation-type">{relation.relationshipType}</span>
                        <span className="relation-affection">
                          Affection: {relation.affection} / 10
                        </span>
                      </div>
                      {relation.notes && <p>{relation.notes}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No relationships found</p>
              )}
            </div>
            
            <div className="profile-section chores card slide-up">
              <h2>Assigned Chores</h2>
              {chores.length > 0 ? (
                <div className="chores-list">
                  {chores.map(chore => (
                    <div key={chore.choreId} className="chore-item">
                      <div className="chore-header">
                        <h3>{chore.description}</h3>
                        <span className={`chore-status status-${chore.status?.toLowerCase()}`}>
                          {chore.status}
                        </span>
                      </div>
                      <div className="chore-details">
                        <span>Duration: {chore.duration} minutes</span>
                        <span>Intensity: {chore.intensity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No chores assigned</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;