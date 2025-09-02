
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Person, PersonMovieCredits, Movie } from '../types';
import { getPersonDetails, getPersonMovieCredits } from '../services/tmdbService';
import { IMAGE_BASE_URL } from '../constants';
import Spinner from '../components/Spinner';
import MovieList from '../components/MovieList';

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [personDetails, personCredits] = await Promise.all([
          getPersonDetails(id),
          getPersonMovieCredits(id),
        ]);
        setPerson(personDetails);
        // Combine cast and crew credits, remove duplicates, and sort by popularity
        const allCredits = [...personCredits.cast, ...personCredits.crew];
        const uniqueCredits = Array.from(new Set(allCredits.map(c => c.id)))
            .map(id => allCredits.find(c => c.id === id) as Movie);
        setCredits(uniqueCredits.sort((a,b) => (b.vote_count || 0) - (a.vote_count || 0)));

      } catch (error) {
        console.error("Failed to fetch person details:", error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner />;
  if (!person) return <div className="text-center text-xl">Person not found.</div>;

  const profileUrl = person.profile_path
    ? `${IMAGE_BASE_URL}w500${person.profile_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:space-x-8">
        <div className="md:w-1/3 flex-shrink-0">
          <img src={profileUrl} alt={person.name} className="rounded-lg shadow-lg w-full" />
        </div>
        <div className="md:w-2/3 mt-6 md:mt-0">
          <h1 className="text-4xl font-bold">{person.name}</h1>
          <p className="text-lg text-gray-400 mt-1">{person.known_for_department}</p>
          <div className="mt-4 space-y-2">
            {person.birthday && <p><span className="font-semibold">Born:</span> {person.birthday}</p>}
            {person.place_of_birth && <p><span className="font-semibold">Place of Birth:</span> {person.place_of_birth}</p>}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Biography</h2>
            <p className="text-gray-300 leading-relaxed">{person.biography || "No biography available."}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <MovieList title="Known For" movies={credits} />
      </div>
    </div>
  );
};

export default PersonDetailPage;
