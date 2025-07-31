import React, { useState } from 'react';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { MatchResults } from './components/MatchResults';
import { UserProfile } from './components/UserProfile';
import { calculateCompatibility, generateMatchReasons, generatePotentialConcerns } from './utils/matching';
import { mockUsers } from './data/mockUsers';
import { User, MatchResult } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'questionnaire' | 'matches' | 'profile'>('questionnaire');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const handleQuestionnaireComplete = (answers: Record<string, any>) => {
    // Transform questionnaire answers into User object
    const newUser: User = {
      id: 'current-user',
      name: 'You', // This would come from a separate form
      age: 25, // This would come from a separate form
      location: answers.location?.[0] || 'Australia',
      bio: 'Looking for the perfect share house!',
      budget: answers.budget || { min: 200, max: 400 },
      preferences: {
        roomType: answers.roomType?.toLowerCase().replace(' ', '') || 'private',
        propertyType: answers.propertyType || [],
        amenities: [], // Would be collected in questionnaire
        location: answers.location || [],
        moveInDate: new Date(answers.moveInDate || Date.now()),
        leaseDuration: answers.leaseDuration || 'Flexible'
      },
      lifestyle: {
        sleepSchedule: answers.sleepSchedule?.toLowerCase().replace(' ', '-').replace('(asleep by 10pm)', '').replace('(asleep after midnight)', '').replace('flexible/varies', 'flexible').trim() || 'flexible',
        socialLevel: answers.socialLevel?.toLowerCase().replace(' ', '-').split(' - ')[0] || 'moderately-social',
        cleanliness: answers.cleanliness?.toLowerCase().replace(' ', '-').split(' - ')[0] || 'moderately-clean',
        guestsFrequency: answers.guestsFrequency?.toLowerCase().replace(' ', '').replace('(weekly)', '').replace('(monthly)', '').replace('(special occasions)', '') || 'occasionally',
        cookingHabits: answers.cookingHabits?.toLowerCase().replace(' ', '-').split(' - ')[0] || 'basic-cooking',
        workFromHome: answers.workFromHome?.toLowerCase() || 'sometimes',
        petsComfortable: answers.petsComfortable === 'Yes',
        smokingComfortable: answers.smokingComfortable === 'Yes',
        drinkingHabits: answers.drinkingHabits?.toLowerCase().replace(' ', '-') || 'occasional',
        exerciseHabits: answers.exerciseHabits?.toLowerCase().replace(' ', '-').split(' - ')[0] || 'moderately-active'
      },
      personality: {
        introvertExtrovert: answers.introvertExtrovert || 5,
        organizationLevel: answers.organizationLevel || 5,
        conflictResolution: answers.conflictResolution?.toLowerCase().replace(' ', '-').split(' ')[0] || 'diplomatic',
        stressResponse: answers.stressResponse?.toLowerCase().replace(' ', '-').split(' ')[0] || 'need-space',
        decisionMaking: answers.decisionMaking?.toLowerCase().replace(' ', '-') || 'thoughtful-deliberate',
        communicationStyle: answers.communicationStyle?.toLowerCase().replace(' ', '-').split(' ')[0] || 'important-matters',
        personalSpace: answers.personalSpace?.toLowerCase().replace(' ', '-').split(' - ')[0] || 'somewhat-important',
        sharedResponsibilities: answers.sharedResponsibilities?.toLowerCase().replace(' ', '-').split(' ')[0] || 'flexible-approach'
      },
      createdAt: new Date()
    };

    setUserProfile(newUser);
    
    // Calculate matches
    const matchResults: MatchResult[] = mockUsers.map(user => {
      const compatibilityScore = calculateCompatibility(newUser, user);
      const matchReasons = generateMatchReasons(newUser, user);
      const potentialConcerns = generatePotentialConcerns(newUser, user);
      
      return {
        user,
        compatibilityScore,
        matchReasons,
        potentialConcerns
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    setMatches(matchResults);
    setCurrentView('matches');
  };

  const handleContactUser = (userId: string) => {
    alert(`Contact feature would open messaging with user ${userId}`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'questionnaire':
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
      case 'matches':
        return <MatchResults matches={matches} onContactUser={handleContactUser} />;
      case 'profile':
        return userProfile ? <UserProfile user={userProfile} /> : null;
      default:
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        hasProfile={!!userProfile}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 ShareMatch Australia. Find your perfect housemate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
