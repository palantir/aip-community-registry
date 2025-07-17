import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { createAipfVotes } from '@aipf-osdk-frontend/sdk';
import client from '../../client';
import Navigation from '../common/Navigation';
import './FoodPlanner.css';

interface FoodOption {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  cookingTime: string;
}

// Mock food options (would come from the ontology in a real app)
const mockFoodOptions: FoodOption[] = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta dish with a rich meat sauce",
    ingredients: ["pasta", "ground beef", "tomatoes", "onions", "garlic"],
    cookingTime: "30 minutes"
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    description: "Quick and healthy stir-fried chicken with vegetables",
    ingredients: ["chicken breast", "bell peppers", "broccoli", "soy sauce", "rice"],
    cookingTime: "20 minutes"
  },
  {
    id: 3,
    name: "Vegetable Curry",
    description: "Flavorful vegetarian curry with mixed vegetables",
    ingredients: ["potatoes", "carrots", "peas", "curry paste", "coconut milk"],
    cookingTime: "40 minutes"
  },
  {
    id: 4,
    name: "Fish Tacos",
    description: "Light and fresh tacos with grilled fish and avocado",
    ingredients: ["white fish", "tortillas", "avocado", "lime", "cilantro"],
    cookingTime: "25 minutes"
  },
  {
    id: 5,
    name: "Pizza Night",
    description: "Make your own pizzas with your favorite toppings",
    ingredients: ["pizza dough", "tomato sauce", "cheese", "toppings of choice"],
    cookingTime: "35 minutes"
  }
];

const DayPlanner: React.FC<{
  day: string;
  options: FoodOption[];
  onVote: (option: FoodOption, vote: string) => void;
}> = ({ day, options, onVote }) => {
  return (
    <div className="day-planner card">
      <h3>{day}</h3>
      <div className="food-options">
        {options.map(option => (
          <div key={option.id} className="food-option">
            <div className="food-info">
              <h4>{option.name}</h4>
              <p>{option.description}</p>
              <div className="food-meta">
                <span>Time: {option.cookingTime}</span>
                <span>Ingredients: {option.ingredients.join(', ')}</span>
              </div>
            </div>
            <div className="vote-actions">
              <button onClick={() => onVote(option, "like")} className="vote-button like">👍</button>
              <button onClick={() => onVote(option, "dislike")} className="vote-button dislike">👎</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodPlanner: React.FC = () => {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [votingSuccess, setVotingSuccess] = useState<string | null>(null);
  
  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Shuffle options for each day to create variety
  const shuffleArray = (array: FoodOption[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const dayOptions = daysOfWeek.map(day => ({
    day,
    options: shuffleArray(mockFoodOptions).slice(0, 3) // 3 random options per day
  }));

  const handleVote = async (option: FoodOption, vote: string) => {
    if (!selectedUser) return;
    
    setLoading(true);
    console.log("Loading: " + loading)
    try {
      await client(createAipfVotes).applyAction({
        type: "food",
        date: new Date().toISOString().split('T')[0], // Current date
        vote_cast: vote,
        voter_id: selectedUser.personId
      });
      
      setVotingSuccess(`Your vote for "${option.name}" has been recorded!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setVotingSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to cast vote:", error);
    } finally {
      setLoading(false);
      console.log("Loading: " + loading)
    }
  };

  return (
    <div className="food-planner-container fade-in">
      <Navigation />
      
      <div className="food-planner-header">
        <h1>Weekly Meal Planner</h1>
        <p>Vote on meal options for the week</p>
        
        {selectedUser && selectedUser.favouriteFoods && (
          <div className="favorite-foods">
            <h3>Your favorite foods:</h3>
            <div className="food-tags">
              {selectedUser.favouriteFoods.map((food, index) => (
                <span key={index} className="food-tag">{food}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {votingSuccess && (
        <div className="vote-success slide-up">
          {votingSuccess}
        </div>
      )}
      
      <div className="weekly-planner">
        {dayOptions.map(({ day, options }) => (
          <DayPlanner 
            key={day}
            day={day}
            options={options}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodPlanner;