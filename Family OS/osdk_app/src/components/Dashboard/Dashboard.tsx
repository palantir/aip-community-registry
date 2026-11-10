import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { AipfActivity, createAipfVotes, AipfChore, AipfMemberFact } from '@aipf-osdk-frontend/sdk';
/* eslint-disable-next-line import/named */
import { Osdk } from '@osdk/client';
import client from '../../client';
import Navigation from '../common/Navigation';
// import GeohashMap from '../maps/GeohashMapComponent.tsx';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { selectedUser } = useAppContext();
  const [activities, setActivities] = useState<Osdk.Instance<AipfActivity>[]>([]);
  const [chores, setChores] = useState<Osdk.Instance<AipfChore>[]>([]);
  const [facts, setFacts] = useState<Osdk.Instance<AipfMemberFact>[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingSuccess, setVotingSuccess] = useState<string | null>(null);
  const [geohashes, setGeohashes] = useState<string[]>([]);

  useEffect(() => {
    const loadOntologisedData = async () => {
      console.log(geohashes)
      try {
        // Load all activities and extract geohashes
        const allActivities: Osdk.Instance<AipfActivity>[] = [];
        for await (const activity of client(AipfActivity).asyncIter()) {
          allActivities.push(activity);
        }
        const locations = allActivities
          .map(act => act.activityLocation)
          .filter((loc): loc is string => typeof loc === 'string');

        setActivities(allActivities);
        setGeohashes(locations);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }

      if (!selectedUser) return;

      // Load chores
      const userChores: Osdk.Instance<AipfChore>[] = [];
      for await (const chore of selectedUser.$link.aipfChores.asyncIter()) {
        userChores.push(chore);
      }
      setChores(userChores);

      // Load member facts
      const memberFacts: Osdk.Instance<AipfMemberFact>[] = [];
      for await (const fact of selectedUser.$link.aipfMemberFacts.asyncIter()) {
        memberFacts.push(fact);
      }
      setFacts(memberFacts);
    };

    loadOntologisedData();
  }, [selectedUser, geohashes]);

  const handleVote = async (activity: Osdk.Instance<AipfActivity>, vote: string) => {
    if (!selectedUser) return;

    try {
      await client(createAipfVotes).applyAction({
        type: 'activity',
        date: new Date().toISOString().split('T')[0],
        vote_cast: vote,
        voter_id: selectedUser.personId,
      });

      setVotingSuccess(`Your vote for "${activity.activityName}" has been recorded!`);
      setTimeout(() => setVotingSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <Navigation />

      <div className="welcome-section">
        <h1>Welcome, {selectedUser?.firstName}!</h1>
        <p>What would you like to do today?</p>
      </div>

      {votingSuccess && <div className="vote-success slide-up">{votingSuccess}</div>}

      <div className="dashboard-sections">
        <div className="section card">
          <h2>Activity Proposals</h2>
          {loading ? (
            <p>Loading activities...</p>
          ) : (
            <div className="activities-list">
              {activities.map(activity => (
                <div key={activity.activityId} className="activity-item">
                  <div className="activity-info">
                    <h3>{activity.activityName}</h3>
                    <p>{activity.activityDescription}</p>
                    <div className="activity-details">
                      <span>Location: {activity.activityLocation}</span>
                      <span>Cost: {activity.activityCost}</span>
                      <span>Fun Level: {activity.activityFun}</span>
                    </div>
                  </div>
                  <div className="voting-buttons">
                    <button className="vote-button like" onClick={() => handleVote(activity, 'like')}>
                      👍
                    </button>
                    <button className="vote-button dislike" onClick={() => handleVote(activity, 'dislike')}>
                      👎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/food-planner" className="section-link">
            Go to Food Planner →
          </Link>
        </div>

        {/* {/* Map of activity locations */}
        {/* !loading && geohashes.length > 0 && (
          <div className="section card">
            <h2>Activity Locations</h2>
            <GeohashMap geohashes={geohashes} height="300px" />
          </div>
        )} */}

        <div className="section card">
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

        <div className="section card">
          <h2>Your Family Facts</h2>
          {facts.length > 0 ? (
            <div>
              {facts.map(fact => (
                <div key={fact.factId} className="fact-card">
                  <div className="fact-header">{fact.factType}</div>
                  <div className="fact-detail">{fact.factDetail}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No facts found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
