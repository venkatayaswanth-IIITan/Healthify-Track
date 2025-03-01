import React, { useState, useEffect } from 'react';
import { Award, Gift, ShoppingBag, Coffee, Dumbbell, Utensils } from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  image: string;
  category: string;
}

const Rewards = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<{id: number, date: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Load points and redeemed rewards from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem('rewardPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    }

    const savedRedeemed = localStorage.getItem('redeemedRewards');
    if (savedRedeemed) {
      setRedeemedRewards(JSON.parse(savedRedeemed));
    }

    // Set example rewards
    const exampleRewards: Reward[] = [
      {
        id: 1,
        title: 'Free Coffee',
        description: 'Redeem for a free coffee at participating cafes',
        points: 100,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'food'
      },
      {
        id: 2,
        title: '10% Off Sportswear',
        description: 'Get 10% off your next sportswear purchase',
        points: 200,
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'fitness'
      },
      {
        id: 3,
        title: 'Free Gym Pass',
        description: 'One-day pass to a premium gym',
        points: 300,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'fitness'
      },
      {
        id: 4,
        title: 'Healthy Meal Delivery',
        description: 'Free delivery on your next healthy meal order',
        points: 150,
        image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'food'
      },
      {
        id: 5,
        title: 'Meditation App Premium',
        description: '1-month premium subscription to a meditation app',
        points: 250,
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'wellness'
      },
      {
        id: 6,
        title: 'Water Bottle',
        description: 'Eco-friendly reusable water bottle',
        points: 180,
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        category: 'merchandise'
      }
    ];
    
    setRewards(exampleRewards);
  }, []);

  // Save redeemed rewards to localStorage
  useEffect(() => {
    localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards));
  }, [redeemedRewards]);

  const handleRedeemReward = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedemption = () => {
    if (selectedReward && points >= selectedReward.points) {
      // Deduct points
      const newPoints = points - selectedReward.points;
      setPoints(newPoints);
      localStorage.setItem('rewardPoints', newPoints.toString());
      
      // Add to redeemed rewards
      const newRedeemed = [
        ...redeemedRewards,
        { id: selectedReward.id, date: new Date().toISOString() }
      ];
      setRedeemedRewards(newRedeemed);
      
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const isRedeemed = (id: number) => {
    return redeemedRewards.some(reward => reward.id === id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="h-5 w-5" />;
      case 'fitness': return <Dumbbell className="h-5 w-5" />;
      case 'wellness': return <Coffee className="h-5 w-5" />;
      case 'merchandise': return <ShoppingBag className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800">Rewards</h1>
      
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Reward Points</h2>
            <p className="text-3xl font-bold mt-1">{points} points</p>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Rewards
          </button>
          <button
            onClick={() => setSelectedCategory('food')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              selectedCategory === 'food' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Utensils className="h-4 w-4 mr-1" />
            Food & Drink
          </button>
          <button
            onClick={() => setSelectedCategory('fitness')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              selectedCategory === 'fitness' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Dumbbell className="h-4 w-4 mr-1" />
            Fitness
          </button>
          <button
            onClick={() => setSelectedCategory('wellness')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              selectedCategory === 'wellness' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Coffee className="h-4 w-4 mr-1" />
            Wellness
          </button>
          <button
            onClick={() => setSelectedCategory('merchandise')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center ${
              selectedCategory === 'merchandise' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Merchandise
          </button>
        </div>
      </div>
      
      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRewards.map(reward => {
          const redeemed = isRedeemed(reward.id);
          
          return (
            <div key={reward.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={reward.image} 
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                  </div>
                  <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
                    <Award className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm font-medium text-purple-800">{reward.points}</span>
                  </div>
                </div>
                
                <div className="flex items-center mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    {getCategoryIcon(reward.category)}
                    <span className="ml-1 capitalize">{reward.category}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={redeemed || points < reward.points}
                  className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium ${
                    redeemed
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : points < reward.points
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {redeemed 
                    ? 'Already Redeemed' 
                    : points < reward.points
                      ? `Need ${reward.points - points} more points`
                      : 'Redeem Reward'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Redemption History */}
      {redeemedRewards.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Redemption History</h2>
          
          <div className="space-y-3">
            {redeemedRewards.map((redeemed, index) => {
              const reward = rewards.find(r => r.id === redeemed.id);
              if (!reward) return null;
              
              return (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={reward.image} 
                      alt={reward.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{reward.title}</p>
                    <p className="text-xs text-gray-500">
                      Redeemed on {new Date(redeemed.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirm Redemption</h2>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to redeem <span className="font-medium">{selectedReward.title}</span> for <span className="font-medium">{selectedReward.points} points</span>?
            </p>
            
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Current Points:</span>
                <span className="font-medium">{points}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-700">Points to Redeem:</span>
                <span className="font-medium text-red-600">-{selectedReward.points}</span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Remaining Points:</span>
                <span className="font-medium">{points - selectedReward.points}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;